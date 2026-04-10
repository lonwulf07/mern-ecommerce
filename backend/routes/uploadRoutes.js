import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// 1. Tell Multer where to save the file and what to name it
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Save in the uploads folder
  },
  filename(req, file, cb) {
    // Name it: fieldname-timestamp.extension (e.g., image-16312345.jpg)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// 2. Security Check: Only allow image files
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

// 3. Initialize Multer with our rules
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. The actual API Route
// 'image' is the name of the field coming from the frontend form
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image Uploaded successfully",
    // We replace backslashes with forward slashes for Windows compatibility
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
