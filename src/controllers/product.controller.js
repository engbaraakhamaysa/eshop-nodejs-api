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

module.exports = { createDraftProduct };
