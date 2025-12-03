const express = require("express");

const router = express.Router();
const {
  createDraftProduct,
  saveProduct,
  updateProduct,
} = require("../controllers/product.controller");

router.post("/draft", createDraftProduct);

router.put("/save/:productId", saveProduct);

router.put("/:productId", updateProduct);

module.exports = router;
