const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
fileFilter: (req, file, cb) => {
  const supportedExtensions = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname);

  if (!supportedExtensions.includes(ext)) {
    cb(new Error("File type is not supported"), false);
    return;
  }

  cb(null, true);
},
});
