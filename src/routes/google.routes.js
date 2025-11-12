const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    const redirectURL = `http://localhost:3000/google/callback?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`;
    res.redirect(redirectURL);
  }
);

module.exports = router;
