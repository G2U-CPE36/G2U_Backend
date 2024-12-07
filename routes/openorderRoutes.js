const express = require("express");
const router = express.Router();
const openOrderController = require("../controllers/openorderController.js"); // Ensure you are using the correct controller

// Routes for OpenOrder
router.get('/:userId', openOrderController.getOpenOrders); // Get all open orders for a user
router.post("/create", openOrderController.createOpenOrder); // Create a new open order
router.put('/:openOrderId', openOrderController.updateOpenOrder); // Update an open order
router.delete('/:openOrderId', openOrderController.deleteOpenOrder); // Delete an open order
router.get("/get/:userId", openOrderController.getAllOpenOrders);

module.exports = router;
