const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: 32,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      maxlength: 32,
      index: true,
    },
    image: {
      url: String,
      key: String, // For deleting the image
    },
    description: {
      type: String,
      required: true,
      minlength: 25,
      maxlength: 1000,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cateogry", categorySchema);
