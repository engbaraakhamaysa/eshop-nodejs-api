const express = require("express");

const router = express.Router();
const {
  createDraftProduct,
  saveProduct,
} = require("../controllers/product.controller");

router.post("/draft", createDraftProduct);

router.put("/save/:productId", saveProduct);

module.exports = router;
