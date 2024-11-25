const { PrismaClient } = require('@prisma/client'); // Correct import
const prisma = new PrismaClient(); // Initialize Prisma client


// Get all open orders for a user
exports.getOpenOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const openOrders = await prisma.openOrder.findMany({
      where: { userId: parseInt(userId) },
      include: { User: true }, // Include user information
    });

    if (openOrders.length === 0) {
      return res.status(404).json({ message: "No open orders found for this user" });
    }

    return res.status(200).json(openOrders);
  } catch (error) {
    console.error("Error fetching open orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new open order
exports.createOpenOrder = async (req, res) => {
  const { userId, productName, categoryId, price, productDescription, productImage } = req.body;

  try {
    const newOrder = await prisma.openOrder.create({
      data: {
        userId,
        productName,
        categoryId,
        price,
        productDescription,
        productImage,
      },
    });

    return res.status(201).json({ message: "Open order created successfully", openOrder: newOrder });
  } catch (error) {
    console.error("Error creating open order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update an open order
exports.updateOpenOrder = async (req, res) => {
  const { openOrderId } = req.params;
  const { productName, categoryId, price, productDescription, productImage } = req.body;

  try {
    const updatedOrder = await prisma.openOrder.update({
      where: { openOrderId: parseInt(openOrderId) },
      data: {
        productName,
        categoryId,
        price,
        productDescription,
        productImage,
      },
    });

    return res.status(200).json({ message: "Open order updated successfully", openOrder: updatedOrder });
  } catch (error) {
    console.error("Error updating open order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an open order
exports.deleteOpenOrder = async (req, res) => {
  const { openOrderId } = req.params;

  try {
    await prisma.openOrder.delete({
      where: { openOrderId: parseInt(openOrderId) },
    });

    return res.status(200).json({ message: "Open order deleted successfully" });
  } catch (error) {
    console.error("Error deleting open order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
