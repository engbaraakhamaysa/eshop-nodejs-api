const Product = require("../models/Product.model");
const Image = require("../models/Image.model");

//Upload images for a draft product

const uploadImages = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const images = [];

    for (const file of req.files) {
      const image = await Image.create({
        url: `/uploads/${file.filename}`,
        product: productId,
      });

      images.push(image);

      //Add image ID to Product.images

      product.images.push(image._id);
    }

    await product.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      images,
      product,
    });
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    //Remove imag from produc.images array
    await Product.findByIdAndUpdate(image.product, {
      $pull: { images: image._id },
    });

    //Delete image file from uploads folder

    const fs = require("fs");
    const path = require("path");

    const imgPath = path.join(__dirname, "..", image.url);
    fs.unlink(imgPath, (err) => {
      if (err) console.log("Error deleteing image file:", err.message);
    });

    await image.deleteOne();

    res.status(200).json({ message: "Image Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { uploadImages, deleteImage };
