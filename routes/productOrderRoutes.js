const express = require('express');
const router = express.Router();
const productOrderController = require("../controllers/productOrderController");  // Correct path to your controller

// Create a new order
router.post("/orders", productOrderController.createOrder);

// Update the order status
router.put('/orders/:orderId/status', productOrderController.updateOrderStatus);

// Get an order by ID
router.get('/orders/:orderId', productOrderController.getOrderById);

// Delete an order by ID
router.delete('/orders/:orderId', productOrderController.deleteOrder);

router.get("/", productOrderController.getAllOrders);

router.get('/user/:userId', productOrderController.getOrdersByUserId);

module.exports = router;
