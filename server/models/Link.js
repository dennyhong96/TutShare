const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    url: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    categories: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    medium: {
      type: String,
      enum: ["video", "book", "e-book", "article"],
      default: "video",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
