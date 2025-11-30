const Category = require("../models/Category.model");

//Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//Create category with image
const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!req.file)
      return res.status(400).json({ message: "Image Is required" });

    const imagePath = `/src/uploads/${req.file.filename}`;

    const newCat = new Category({
      title,
      image: imagePath,
    });

    await newCat.save();
    res.status(200).json({ category: newCat });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (req.file) updates.image = `/src/uploads/${req.file.filename}`;

    const updated = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ category: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
