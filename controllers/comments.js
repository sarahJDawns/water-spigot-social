const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
  createComment: async (req, res) => {
    try {
      if (!req.body.comment || req.body.comment.trim() === "") {
        req.flash("errors", { msg: "Comment must be added!" });
        return res.redirect("/post/" + req.params.id);
      }

      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        user: req.user.id,
        createdAt: new Date(),
      });

      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        },
        { new: true }
      );
      if (comment.user.toString() !== req.user.id) {
        console.log("Likes +1");
        res.redirect(`/post/${comment.post}`);
      } else {
        res.redirect(`/post/${comment.post}`);
      }
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findOne({ _id: req.params.id });
      if (comment.user.toString() === req.user.id) {
        await Comment.findOneAndDelete({ _id: req.params.id });
      }
      console.log("Deleted Comment");
      res.redirect(`/post/${comment.post}`);
    } catch (err) {
      res.redirect(`/post/${comment.post}`);
    }
  },
};
