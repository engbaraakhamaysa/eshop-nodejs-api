const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },

    images: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },

    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model("Product", productSchema);
