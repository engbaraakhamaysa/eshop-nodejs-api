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
    res.status(200).json({
      user: req.user.user,
      token: req.user.token,
    });
  }
);

module.exports = router;
