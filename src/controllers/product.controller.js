const Product = require("../models/Product.model");

const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("category")
      .populate("images");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("images");
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

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

//Update product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, price, categoryId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    //Edit Data
    if (title) product.title = title;
    if (price) product.price = price;
    if (categoryId) product.category = categoryId;

    await product.save();

    res.status(200).json({ message: "Product updated sucessfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    //Delete all image
    const Image = require("../models/Image.model");
    const fs = require("fs");
    const path = require("path");

    for (const imageId of product.images) {
      const image = await Image.findById(imageId);
      if (image) {
        const imgPath = path.join(__dirname, "..", image.url);
        fs.unlink(imgPath, (err) => {
          if (err) console.log(err.message);
        });
        await image.deleteOne();
      }
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createDraftProduct,
  saveProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
};
