const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Create a new order with a "PENDING" status
async function createOrder(req, res) {
  const { userId, sellerId, productId, addressId } = req.body;

  try {
    const newOrder = await prisma.productOrder.create({
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
  const { orderId } = req.params; // Get orderId from URL params
  const { newStatus } = req.body; // Get newStatus from request body

  try {
    // Ensure the orderId and newStatus are provided
    if (!orderId || !newStatus) {
      return res.status(400).json({ message: "orderId and newStatus are required" });
    }

    const updatedOrder = await prisma.productOrder.update({
      where: {
        orderId: parseInt(orderId), // Use orderId from the URL parameter
      },
      data: {
        orderStatus: newStatus, // Set the new order status
      },
    });

    return res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: "Error updating order status", error: error.message });
  }
}

async function getOrderById(req, res) {
  const { orderId } = req.params;

  try {
    const order = await prisma.productOrder.findUnique({
      where: {
        orderId: parseInt(orderId), // Ensure it's parsed as an integer
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
}

// Delete an order by ID
async function deleteOrder(req, res) {
  const { orderId } = req.params;

  try {
    const order = await prisma.productOrder.delete({
      where: {
        orderId: parseInt(orderId), // Ensure it's parsed as an integer
      },
    });

    res.status(200).json({ message: "Order deleted successfully", order });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
}
async function getAllOrders(req, res) {
  try {
    const orders = await prisma.productOrder.findMany({
      include: {
        Product: true, // Include product details
        User: {
          select: {
            username: true, // Include buyer's username
          },
        },
        Seller: {
          select: {
            username: true, // Include seller's username
          },
        },
      },
    });

    // Format the orders
    const formattedOrders = orders.map((order) => ({
      orderId: order.orderId,
      userId: order.userId,
      sellerId: order.sellerId,
      productId: order.productId,
      addressId: order.addressId,
      orderStatus: order.orderStatus,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      paymentStatus: order.paymentStatus,
      Product: {
        productId: order.Product.productId,
        userId: order.Product.userId,
        productName: order.Product.productName,
        categoryId: order.Product.categoryId,
        productDescription: order.Product.productDescription,
        productImage: order.Product.productImage, // Keep the productImage array as is
      },
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Error fetching all orders", error: error.message });
  }
}

// Get orders by userId (as Buyer or Seller)
async function getOrdersByUserId(req, res) {
  const { userId } = req.params;

  try {
    const orders = await prisma.productOrder.findMany({
      where: {
        OR: [
          { userId: parseInt(userId) }, // Orders where the user is the buyer
          { sellerId: parseInt(userId) }, // Orders where the user is the seller
        ],
      },
      include: {
        Product: true, // Include product details
        User: {
          select: {
            username: true, // Include buyer's username
          },
        },
        Seller: {
          select: {
            username: true, // Include seller's username
          },
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders by userId:", error);
    res.status(500).json({ message: "Error fetching orders by userId", error: error.message });
  }
}

module.exports = {
  createOrder,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
  getAllOrders,
  getOrdersByUserId
};
