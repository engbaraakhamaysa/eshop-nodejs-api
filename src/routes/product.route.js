const express = require("express");

const router = express.Router();
const {
  createDraftProduct,
  saveProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/product.controller");

router.get("/", getAllProducts);

router.post("/draft", createDraftProduct);

router.put("/save/:productId", saveProduct);

router.put("/:productId", updateProduct);

router.delete("/:productId", deleteProduct);

module.exports = router;
