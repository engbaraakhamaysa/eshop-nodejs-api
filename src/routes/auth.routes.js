const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

module.exports = router;
