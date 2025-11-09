const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Client = require("../models/Client.model");
const RefreshToken = require("../models/RefreshToken.model");

const {
  createAccessToken,
  createRefreshToken,
  refreshToken,
} = require("../controllers/auth.controller");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessTokenFromGoogle, refreshTokenFromGoogle, profile, doen) => {
      try {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return doen(new Error("No email found in Google profiel"), null);
        }

        let user = await Client.findOne({ email });
        if (!user) {
          user = new Client({
            name: profile.displayName || "No Name",
            email: email,
            password: "google_oauth_user",
          });
          await user.save();
        }

        const accessTokenJWT = createAccessToken(user);
        const refreshTokenJWT = createRefreshToken(user);

        const stored = new RefreshToken({
          token: refreshTokenJWT,
          user: user._id,
        });
        await stored.save();

        return doen(null, {
          user,
          token: { accessToken: accessTokenJWT, refreshToken: refreshTokenJWT },
        });
      } catch (err) {
        return doen(err, nell);
      }
    }
  )
);
module.exports = passport;
