const express = require("express");

const router = express.Router();
const { createDraftProduct } = require("../controllers/product.controller");

router.post("/draft", createDraftProduct);

module.exports = router;
