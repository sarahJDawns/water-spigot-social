const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      if (!req.body.comment || req.body.comment.trim() === "") {
        req.flash("errors", { msg: "Comment must be added!" });
        return res.redirect("/post/" + req.params.id);
      }

      // const comment =
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        user: req.params.id,
        user: req.user.id,
        // user: req.user.userName,
        createdAt: new Date(),
      });

      //   console.log("Comment has been added!");
      //   res.redirect("/post" + req.params.id);
      // } catch (err) {
      //   console.log(err);
      // }
      // const { comment, postId, userId } = req.body;
      // const newComment = new Comment({
      //   comment,
      //   post: postId,
      //   user: userId,
      // });

      // // Save the new comment
      // await newComment.save();
      // await Comment.find({
      //   post: req.params.id,
      // }).populate({
      //   path: "user",
      //   // select: "userName",
      //   match: { username: req.user.username },
      //   // path: "post",
      //   // select: "user",
      //   // populate: {
      //   //   path: "user",
      //   //   select: "userName",
      //   // },
      // });
      // Populate the user field with the associated userName from the User model
      // await savedComment.populate("user", "userName").execPopulate();

      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }

    //   res.status(201).json({ success: true, comment: savedComment });
    // } catch (error) {
    //   res.status(500).json({ success: false, error: error.message });
    // }
  },
  likeComment: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      console.log("req.params.id:", req.params.id);
      await Comment.findOneAndDelete({ _id: commentId });

      console.log("Deleted Comment");
      res.redirect(`/post/${req.user.userName}`);
    } catch (err) {
      res.redirect(`/post/${req.user.userName}`);
    }
  },
};
