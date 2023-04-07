const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["/views/*.ejs", "/views/partials/*.ejs"],
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
