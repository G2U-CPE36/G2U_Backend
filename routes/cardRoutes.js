const express = require("express");
const cardController = require("../controllers/cardController");

const router = express.Router();

// Add a new card
router.post("/add-card", cardController.addCard);

// Get all cards for a user
router.get("/:userId", cardController.getCards);

// Delete a card by ID
router.delete("/delete-card/:cardId", cardController.deleteCard);

// Set a card as default
router.patch("/set-default/:cardId", cardController.setDefaultCard);

module.exports = router;
