const prisma = require('@prisma/client');
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

// Create a new order with a "PENDING" status
async function createOrder(req, res) {
  const { userId, sellerId, productId, addressId } = req.body;

  try {
    const newOrder = await prismaClient.productOrder.create({
      data: {
        userId,
        sellerId,
        productId,
        addressId,
        orderStatus: 'PENDING', // Initial status is "PENDING"
      },
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
}

// Update the order status
async function updateOrderStatus(req, res) {
  const { orderId, newStatus } = req.body;

  try {
    // Update the order status in the database
    const updatedOrder = await prismaClient.productOrder.update({
      where: {
        orderId: orderId,
      },
      data: {
        orderStatus: newStatus,
      },
    });

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
}

module.exports = {
  createOrder,
  updateOrderStatus,
};
