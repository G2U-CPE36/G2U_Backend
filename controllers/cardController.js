const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Utility function to reset all cards' isDefault field for a user
const resetDefaultCards = async (userId) => {
  await prisma.card.updateMany({
    where: { userId },
    data: { isDefault: false },
  });
};

// Add a new card
const addCard = async (req, res) => {
  const { userId, cardNumber, expiryDate, cvv, isDefault } = req.body;

  try {
    if (!cardNumber || cardNumber.length !== 16) {
      return res.status(400).json({ error: "Invalid card number." });
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return res
        .status(400)
        .json({ error: "Invalid expiry date format. Use MM/YY." });
    }
    if (!cvv || cvv.length !== 3) {
      return res.status(400).json({ error: "Invalid CVV." });
    }

    // Check if card number already exists for the user
    const existingCard = await prisma.card.findFirst({
      where: {
        userId,
        cardNumber,
      },
    });

    if (existingCard) {
      return res.status(400).json({
        error: "This card number is already linked to the user.",
      });
    }

    if (isDefault) {
      await resetDefaultCards(userId);
    }

    const card = await prisma.card.create({
      data: {
        cardNumber,
        expiryDate,
        cvv,
        userId,
        isDefault: !!isDefault,
      },
    });

    res.status(201).json({ message: "Card added successfully", card });
  } catch (error) {
    console.error("Error in add-card:", error);
    res
      .status(500)
      .json({ error: "Failed to add card. Please try again later." });
  }
};

// Get all cards for a user (with pagination)
const getCards = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const cards = await prisma.card.findMany({
      where: { userId: parseInt(userId) },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    res.status(200).json(cards);
  } catch (error) {
    console.error("Error in get-cards:", error);
    res.status(500).json({ error: "Failed to fetch cards." });
  }
};

// Delete a card by ID
const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await prisma.card.delete({
      where: { id: parseInt(cardId) },
    });

    res.status(200).json({ message: "Card deleted successfully", card });
  } catch (error) {
    console.error("Error in delete-card:", error);
    res.status(500).json({ error: "Failed to delete card." });
  }
};

// Set a card as default
const setDefaultCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await prisma.card.findUnique({
      where: { id: parseInt(cardId) },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    await resetDefaultCards(card.userId);

    const updatedCard = await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: { isDefault: true },
    });

    res.status(200).json({
      message: "Card set as default successfully.",
      updatedCard,
    });
  } catch (error) {
    console.error("Error in set-default:", error);
    res.status(500).json({ error: "Failed to set card as default." });
  }
};

module.exports = {
  addCard,
  getCards,
  deleteCard,
  setDefaultCard,
};
