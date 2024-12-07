const express = require("express");
const router = express.Router();
const productMainController = require("../controllers/productMainController");

// Define route for fetching products with random order, pagination, and filtering
router.get("/products", productMainController.getProducts);
router.get("/search", productMainController.searchProducts);

module.exports = router;
