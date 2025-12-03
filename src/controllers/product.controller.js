const Product = require("../models/Product.model");

//Create draft product (after selecting category)

const createDraftProduct = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    //Create draft product
    const draft = new Product({
      title: "",
      price: 0,
      category: categoryId,
      images: [],
      isDraft: true,
    });

    await draft.save();

    res.status(200).json({
      message: "Draft product created",
      product: draft,
      productId: draft._id,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//Save product (final)
const saveProduct = async (req, res) => {
  try {
    const { productId } = req.params; //ID product Draft
    const { title, price, isDraft } = req.body;
    if (!productId)
      return res.status(400).json({ message: "Product ID is Required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    //Edit Data
    if (title) product.title = title;
    if (price) product.price = price;
    product.isDraft = false;

    await product.save();

    res.status(200).json({ message: "Product saved successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createDraftProduct, saveProduct };
