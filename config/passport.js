import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import User from '../models/User.js';

passport.use( 
  new GitHubStrategy( 
    {
      clientID: process.env.GITHUB_CLIENT_ID, // GitHub client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // GitHub client secret
      callbackURL: process.env.GITHUB_CALLBACK_URL, // GitHub callback URL
    },
    async (accessToken, refreshToken, profile, done) => { 
      try {
      
        let user = await User.findOne({ githubId: profile.id }); // Find user by GitHub ID
        if (user) {
          return done(null, user); 
        }
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null; // Get user email
        if (email) {
          user = await User.findOne({ email }); // Find user by email
          if (user) {
            
            user.githubId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

      
        user = new User({
          name: profile.displayName || profile.username, // User name
          email: email || `${profile.username}@github.com`, // User email
          githubId: profile.id, // GitHub ID
          password: undefined, // No password for GitHub users
        });
        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Find user by ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});