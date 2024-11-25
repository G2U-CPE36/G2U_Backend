const express = require("express");
const router = express.Router();
const productOrderController = require("../controllers/productOrderController");

// Route to create an order with status "PENDING"
router.post("/create", productOrderController.createOrder);

// Route to update the order status (e.g., when buyer updates info)
router.patch("/update-status", productOrderController.updateOrderStatus);

module.exports = router;
