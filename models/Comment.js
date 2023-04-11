const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: false,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// CommentSchema.virtual("user", {
//   ref: "User",
//   localField: "userName",
//   foreignField: "userName",
//   justOne: true,
//   populate: { select: "userName" },
// });

// CommentSchema.virtual("user", {
//   ref: "User",
//   localField: "user",
//   foreignField: "_id",
//   justOne: true,
//   populate: { select: "userName" },
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true },

//   // ... other options ...
// });

module.exports = mongoose.model("Comment", CommentSchema);
