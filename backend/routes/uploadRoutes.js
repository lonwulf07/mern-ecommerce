import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Save in the uploads folder
  },
  filename(req, file, cb) {
    // Use the original file name with a timestamp to avoid conflicts
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// Check file type to allow only images
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

// Initialize multer with the defined storage and file filter
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Route to handle image upload
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image Uploaded successfully",
    // Return the path to the uploaded image
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
