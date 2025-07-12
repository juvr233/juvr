import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model';
import { logger } from './logger';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          isVerified: true, // Google-verified email
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        logger.error('Error in Google OAuth strategy', err);
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
