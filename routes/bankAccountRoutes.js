const express = require("express");
const router = express.Router();

// Import the bank controller methods
const bankAccountController = require("../controllers/bankAccountController");

// Add bank routes using the controller methods
router.post("/add-bank", bankAccountController.addBank);
router.get("/banks/:userId", bankAccountController.getBanks);
router.delete("/delete-bank/:bankId", bankAccountController.deleteBank);

module.exports = router;
