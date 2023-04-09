const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};

// module.exports = {
//   createComment: async (req, res) => {
//     try {
//       const comment = new Comment({
//         comment: req.body.comment,
//         likes: 0,
//         post: req.params.id,
//         user: req.user,
//       });
//       const comments = await Comment.find({ post: req.params.id })
//         .sort({ createdAt: "desc" })
//         .populate("user")
//         .lean();
//       await comment.populate("user");
//       comment.user = await User.findById(comment.user).exec();
//       await comment.save();
//       console.log("Comment has been added!");
//       console.log(comment.user);
//       console.log(comment.user.userName);
//       res.redirect("/post/", +req.params.id);
//     } catch (error) {
//       console.log(error);
//     }
//   },
// };
