const express = require("express");
const router = express.Router();
const openOrderController = require("../controllers/openorderController.js"); // Ensure you are using the correct controller

// Routes for OpenOrder
router.get('/api/openorders/:userId', openOrderController.getOpenOrders); // Get all open orders for a user
router.post('/openorders', openOrderController.createOpenOrder); // Create a new open order
router.put('/api/openorders/:openOrderId', openOrderController.updateOpenOrder); // Update an open order
router.delete('/api/openorders/:openOrderId', openOrderController.deleteOpenOrder); // Delete an open order

module.exports = router;
