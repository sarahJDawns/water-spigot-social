const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
createComment: async (req, res) => {
  try {
    const { comment } = req.body;
    const { id } = req.params;
    const { user } = req;

    if (!comment || comment.trim() === "") {
      req.flash("errors", { msg: "Comment must be added!" });
      return res.redirect(`/post/${id}`);
    }

    await Comment.create({
      comment,
      likes: 0,
      post: id,
      user: user.id,
      createdAt: new Date(),
    });

    res.redirect(`/post/${id}`);
  } catch (err) {
    console.log(err);
  }
},
likeComment: async (req, res) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 } },
      { new: true }
    );

    const redirectPath = `/post/${updatedComment.post}`;
    res.redirect(redirectPath);
  } catch (err) {
    console.log(err);
  }
},
deleteComment: async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() === req.user.id) {
      await Comment.findByIdAndDelete(req.params.id);
    }
    res.redirect(`/post/${comment.post}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/post/${comment.post}`);
  }
},
};
