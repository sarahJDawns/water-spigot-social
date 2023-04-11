const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      if (!req.body.comment || req.body.comment.trim() === "") {
        req.flash("errors", { msg: "Comment must be added!" });
        return res.redirect("/post/" + req.params.id);
      }

      const comment = await Comment.create({
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
