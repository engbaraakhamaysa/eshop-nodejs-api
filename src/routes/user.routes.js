const express = require("express");
const router = express.Router();
const { getAllClinents } = require("../controllers/user.controller");

router.get("/allusers", getAllClinents);

module.exports = router;
