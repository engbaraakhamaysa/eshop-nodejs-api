const express = require("express");

const router = express.Router();
const {
  createDraftProduct,
  saveProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/product.controller");

router.get("/", getAllProducts);
router.get("/:productId", getSingleProduct);
router.post("/draft", createDraftProduct);

router.put("/save/:productId", saveProduct);

router.put("/:productId", updateProduct);

router.delete("/:productId", deleteProduct);

module.exports = router;
