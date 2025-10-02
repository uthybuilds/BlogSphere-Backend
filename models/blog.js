const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    subTitle: {
      type: String,
    },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const BLOG = mongoose.model("blog", blogSchema);

module.exports = BLOG;
