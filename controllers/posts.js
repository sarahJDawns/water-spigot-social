const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username;

      const posts = await Post.find({ user: userId }).populate({
        path: "user",
        match: { username: username },
      });

      res.render("profile.ejs", { posts, user: req.user });
    } catch (err) {
      console.error(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate({ path: "user", match: { username: req.user.username } })
        .lean();
      res.render("feed.ejs", { posts });
    } catch (error) {
      console.log(error);
    }
  },
  getPost: async (req, res) => {
    try {
      const posts = await Post.findById(req.params.id).populate({
        path: "user",
      });
      const comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: "asc" })
        .populate({
          path: "user",
          match: { username: req.user.username },
        })
        .lean();
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
      const { title, caption, file } = req.body;
      let image, cloudinaryId;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
        cloudinaryId = result.public_id;
      }

      if (!title && !caption && !image) {
        req.flash("errors", { msg: "At least one field must be filled." });
        return res.redirect("/profile");
      }

      await Post.create({
        title,
        image,
        cloudinaryId,
        caption,
        likes: 0,
        user: req.user.id,
      });

      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      req.flash("errors", { msg: "Failed to add post" });
      res.redirect("/profile");
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(req.params.id, { $inc: { likes: 1 } });
      res.redirect(`/post/${req.params.id}`);
    } catch (error) {
      console.log(error);
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
