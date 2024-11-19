// routes/productRoute.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// POST: Create a product
router.post("/create", productController.createProduct);

// GET: Get all products
router.get("/getproducts", productController.getAllProducts);

// GET: Get a product by ID
router.get("/products/:productId", productController.getProductById);

// PUT: Update a product by ID
router.put("/products/:productId", productController.updateProduct);

// DELETE: Delete a product by ID
router.delete("/products/:productId", productController.deleteProduct);

module.exports = router;
