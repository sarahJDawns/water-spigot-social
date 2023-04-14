const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("info", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error : Failed to destroy the session during logout.", err);
    } else {
      console.log("User has logged out.");
    }
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long.",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  User.findOne({
    $or: [{ email: req.body.email }, { userName: req.body.userName }],
  })
    .then((existingUser) => {
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
      });
      return user.save();
    })
    .then((user) => {
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getDeleteAccount = (req, res) => {
  res.render("delete-account");
};

exports.postDeleteAccount = async (req, res) => {
  const validationErrors = [];
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../delete-account");
  }
  if (!req.body.password || !req.body.confirmPassword) {
    req.flash("errors", { msg: "All fields are required." });
    return res.redirect("/delete-account");
  }

  try {
    await Post.deleteMany({ user: req.user._id });
    await Comment.deleteMany({ user: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    console.log("Deleted User");
    req.flash("info", { msg: "Your account has been deleted." });
    return res.render("delete-account", {
      msg: "Your account has been deleted.",
    });
  } catch (err) {
    console.error("Error in deletion");
    res.redirect("/signup");
  }
};
