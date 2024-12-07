const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require('multer');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Get all open orders for a user
exports.getOpenOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const openOrders = await prisma.openOrder.findMany({
      where: { userId: parseInt(userId) },
      include: {
        User: {
          select: {
            userId: true,
            username: true,
            email: true,
            UserAddresses: {
              select: { province: true },
            },
          },
        },
      },
    });

    const formattedOrders = openOrders.map((order) => ({
      orderId: order.openOrderId,
      userId: order.userId,
      username: order.User?.username || null,
      email: order.User?.email || null,
      province:
        order.User?.UserAddresses?.length > 0
          ? order.User.UserAddresses[0].province
          : null,
      productName: order.productName,
      categoryId: order.categoryId,
      price: order.price,
      productDescription: order.productDescription,
      picture: order.productImage,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    if (formattedOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No open orders found for this user" });
    }

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching open orders:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Create a new open order
exports.createOpenOrder = async (req, res) => {
  // Apply the upload middleware
  const uploadSingle = upload.single("productImage");

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Error uploading file" });
    }

    const { userId, productName, categoryId, price, productDescription } = req.body;

    // Ensure productImage is uploaded
    const productImage = req.file ? req.file.buffer : null;

    try {
      const newOrder = await prisma.openOrder.create({
        data: {
          userId: parseInt(userId), // Parse userId to an integer
          productName,
          categoryId: parseInt(categoryId), // Parse categoryId to an integer
          price: parseInt(price), // Parse price to an integer
          productDescription,
          productImage,
        },
      });

      return res.status(201).json({ message: "Open order created successfully", openOrder: newOrder });
    } catch (error) {
      console.error("Error creating open order:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
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

// Get all open orders
exports.getAllOpenOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    let openOrders;

    // Check if the userId contains a range (e.g., "1-20")
    if (userId.includes('-')) {
      const [start, end] = userId.split('-').map(Number);

      // Validate the range
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ message: "Invalid range format. Use 'start-end' format." });
      }

      // Query for orders within the range
      openOrders = await prisma.openOrder.findMany({
        where: {
          userId: {
            gte: start, // Greater than or equal to start of the range
            lte: end,   // Less than or equal to end of the range
          },
        },
        include: {
          User: {
            select: {
              userId: true,
              username: true,
              email: true,
              UserAddresses: {
                select: { province: true },
              },
            },
          },
        },
      });
    } else {
      // Handle single userId
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        return res.status(400).json({ message: "Invalid userId. Must be a number or range." });
      }

      openOrders = await prisma.openOrder.findMany({
        where: { userId: userIdInt },
        include: {
          User: {
            select: {
              userId: true,
              username: true,
              email: true,
              UserAddresses: {
                select: { province: true },
              },
            },
          },
        },
      });
    }

    // Check if no orders were found
    if (!openOrders || openOrders.length === 0) {
      return res.status(404).json({ message: "No open orders found for the specified user(s)" });
    }

    // Format the response
    const formattedOrders = openOrders.map((order) => ({
      orderId: order.openOrderId,
      userId: order.userId,
      username: order.User?.username || null,
      email: order.User?.email || null,
      province: order.User?.UserAddresses?.[0]?.province || null,
      productName: order.productName,
      categoryId: order.categoryId,
      price: order.price,
      productDescription: order.productDescription,
      picture: order.productImage, // Use productImage as-is
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching open orders:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};



