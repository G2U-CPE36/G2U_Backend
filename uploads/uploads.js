const multer = require("multer");
const path = require("path");

// Set up storage configuration to store uploaded files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Files will be saved in the 'uploads' folder in the root directory
  },
  filename: (req, file, cb) => {
    // Create a unique file name using the current timestamp and the original file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Only allow image files (JPG, JPEG, PNG) to be uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, JPEG, and PNG files are allowed.")
    );
  }
};

// Initialize multer with storage and file filter configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
