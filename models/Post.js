const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    require: false,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// PostSchema.virtual("user", {
//   ref: "User",
//   localField: "userName",
//   foreignField: "userName",
//   justOne: true,
// });

// PostSchema.virtual("user", {
//   ref: "User",
//   localField: "userName",
//   foreignField: "_id",
//   justOne: true,
//   populate: { select: "userName" },
// });
module.exports = mongoose.model("Post", PostSchema);
