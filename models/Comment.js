const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

CommentSchema.virtual("userName", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
  select: "userName",
});

module.exports = mongoose.model("Comment", CommentSchema);
