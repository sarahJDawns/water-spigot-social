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
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// CommentSchema.pre("find", function () {
//   this.populate("user");
// });

module.exports = mongoose.model("Comment", CommentSchema);
