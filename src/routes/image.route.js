const express = require("express");
const route = express.Router();

const upload = require("../middleware/upload.middleware");
const {
  uploadImages,
  deleteImage,
} = require("../controllers/image.controller");

//Upload multiple images for a product

route.post("/:productId", upload.array("images", 10), uploadImages);

//Delete an imge
route.delete("/:imageId", deleteImage);

module.exports = route;
