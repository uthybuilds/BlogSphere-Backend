const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "blog", required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const COMMENT = mongoose.model("comment", commentSchema);

module.exports = COMMENT;
