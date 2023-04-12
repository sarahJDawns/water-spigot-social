const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const { postcss } = require("autoprefixer");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user);
    try {
      const posts = await Post.find({ user: req.user.id }).populate({
        path: "user",
        match: { username: req.user.username },
      });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate({ path: "user", match: { username: req.user.username } })
        // .populate("user")
        .lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      // const postId = new mongoose.Types.ObjectId(req.params.id);
      // const post = await Post.find({ post: postId })
      const posts = await Post.findById(req.params.id).populate({
        path: "user",
        // match: { userName: req.user.userName },
      });
      // .populate("user");
      // const commentId = new mongoose.Types.ObjectId(req.params.id);
      // const comments = await Comment.find({ comment: commentId })
      const comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: "desc" })
        .populate({
          path: "user",
          // select: "userName",
          // match: { username: req.user.username },
        })
        // .populate({ path: "user", match: { username: req.user.username } })
        // .populate({
        //   path: "user",
        //   // select: "userName",
        // })
        // path: "post",
        // select: "user",
        // populate: {
        //   path: "user",
        //   select: "userName",
        //   populate: {
        //     path: "user",
        //     select: "userName",
        //     // },
        //   },
        // })
        // .populate("userName")
        .lean();
      // await Comment.populate(comments);
      // for (const comment of comments) {
      //   await comment.populate("user", "username").execPopulate();
      // }

      console.log(comments);
      console.log(posts);
      res.render("post.ejs", {
        post: posts,
        user: req.user,
        comments: comments,
      });
    } catch (err) {
      console.log(err);
    }
  },

  createPost: async (req, res) => {
    try {
      let image = undefined;
      let cloudinaryId = undefined;
      const { title, caption, file } = req.body;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
        cloudinaryId = result.public_id;
      }

      if (!req.body.title && !req.body.caption) {
        req.flash("errors", { msg: "At least one field must be filled." });
        return res.redirect("/profile");
      }

      if (!req.body.title.trim() && !req.body.caption.trim()) {
        req.flash("errors", { msg: "At least one field must not be empty." });
        return res.redirect("/profile");
      }

      await Post.create({
        title: title,
        image: image,
        cloudinaryId: cloudinaryId,
        caption: caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      req.flash("errors", { msg: "Failed to add post" });
      res.redirect("/profile");
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
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
  deletePost: async (req, res) => {
    try {
      let post = await Post.findOneAndDelete({ _id: req.params.id });
      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
