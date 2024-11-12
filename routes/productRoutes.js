const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files

const productController = require("../controllers/productController");

// Create a product (with image upload)
router.post(
  "/",
  upload.single("productImage"),
  productController.createProduct
);

// Get all products or a single product by ID
router.get("/:id?", productController.getProducts);

// Update a product by ID
router.put(
  "/:id",
  upload.single("productImage"),
  productController.updateProduct
);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
