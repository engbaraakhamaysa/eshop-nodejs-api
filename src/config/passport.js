const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");
const RefreshToken = require("../models/RefreshToken.model");

const {
  createAccessToken,
  createRefreshToken,
} = require("../controllers/auth.controller");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_USER_ID,
      clientSecret: process.env.GOOGLE_USER_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessTokenFromGoogle, refreshTokenFromGoogle, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name: profile.displayName || "No Name",
            email,
            password: "google_oauth_user",
          });
          await user.save();
        }

        const accessTokenJWT = createAccessToken(user);
        const refreshTokenJWT = createRefreshToken(user);

        await new RefreshToken({
          token: refreshTokenJWT,
          user: user._id,
        }).save();

        return done(null, {
          user,
          token: {
            accessToken: accessTokenJWT,
            refreshToken: refreshTokenJWT,
          },
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
