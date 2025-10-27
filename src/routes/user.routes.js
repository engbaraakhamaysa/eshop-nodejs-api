const express = require("express");
const router = express.Router();
const { getAllClinents } = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/allusers", authMiddleware, getAllClinents);

module.exports = router;
