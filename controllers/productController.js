const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use memory storage to access file content in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit each file size to 5 MB
  fileFilter: (req, file, cb) => {
    // Only allow PNG and JPEG files
    if (["image/png", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and JPEG files are allowed"));
    }
  },
});

// Create a product with multiple images stored as Bytes[]
exports.createProduct = [
  upload.array("productImage", 10), // Allow up to 10 images
  async (req, res) => {
    try {
      // Validate uploaded images
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
      }

      // Convert files to Uint8Array for Prisma's Bytes[]
      const productImages = req.files.map((file) => new Uint8Array(file.buffer));

      const {
        productName,
        categoryId,
        productDescription,
        userId,
        price,
        condition,
      } = req.body;

      // Validate required fields
      if (!productName || !categoryId || !productDescription || !userId || !price || !condition) {
        return res
          .status(400)
          .json({ error: "All fields are required (productName, categoryId, productDescription, userId, price, condition)" });
      }

      // Validate numeric fields
      if (isNaN(categoryId) || isNaN(userId) || isNaN(price)) {
        return res
          .status(400)
          .json({ error: "categoryId, userId, and price must be valid numbers" });
      }

      // Create the product in the database
      const product = await prisma.product.create({
        data: {
          productName,
          categoryId: parseInt(categoryId),
          productDescription,
          userId: parseInt(userId),
          price: parseFloat(price),
          condition,
          productImage: productImages,
        },
      });

      // Success response
      res.status(201).json({ message: "Created complete", productId: product.productId });
    } catch (error) {
      console.error("Error creating product:", error);

      // Prisma-specific error handling
      if (error.code === "P2011") {
        return res.status(400).json({ error: "Null constraint violation" });
      }

      res.status(500).json({ error: "An unexpected error occurred" });
    }
  },
];


// Update product with image upload
exports.updateProduct = [
  upload.single("productImage"),
  async (req, res) => {
    const { productId } = req.params;
    const {
      productName,
      categoryId,
      productDescription,
      userId,
      price,
      condition,
    } = req.body;

    if (
      !productName ||
      !categoryId ||
      !productDescription ||
      !userId ||
      !price ||
      !condition
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { userId: parseInt(userId) },
      });

      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const productData = {
        productName,
        categoryId: parseInt(categoryId),
        productDescription,
        userId: parseInt(userId),
        price: parseFloat(price),
        condition,
      };

      if (req.file) {
        productData.productImage = req.file.buffer; // Update product image
      }

      const updatedProduct = await prisma.product.update({
        where: { productId: parseInt(productId) },
        data: productData,
      });

      return res.status(200).json({ message: "Product updated successfully", updatedAt: updatedProduct.updatedAt });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Error updating product" });
    }
  },
];

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { productId: parseInt(productId) },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Error deleting product" });
  }
};

// Controller to get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
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

    const formattedProducts = products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      categoryId: product.categoryId,
      productDescription: product.productDescription,
      productImage: product.productImage,
      userId: product.userId,
      username: product.User.username, // Add username
      price: product.price,
      condition: product.condition,
      province: product.User.UserAddresses.length > 0 ? product.User.UserAddresses[0].province : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return res.status(200).json(formattedProducts);
  } catch (e) {
    console.error("Error retrieving products:", e);
    return res.status(500).json({ error: e.message });
  }
};

// Controller to get a product by ID
exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) },
      include: {
        Category: true,
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

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const formattedProduct = {
      productId: product.productId,
      productName: product.productName,
      categoryId: product.categoryId,
      productDescription: product.productDescription,
      productImage: product.productImage,
      userId: product.userId,
      username: product.User.username, // Add username
      price: product.price,
      condition: product.condition,
      province: product.User.UserAddresses.length > 0 ? product.User.UserAddresses[0].province : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return res.status(200).json(formattedProduct);
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({ error: "Error fetching product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { productId: parseInt(productId) },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Error deleting product" });
  }
};


exports.toggleProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        productId: parseInt(productId),
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Toggle the status field
    const updatedProduct = await prisma.product.update({
      where: {
        productId: parseInt(productId),
      },
      data: {
        status: !product.status, // Flip the current boolean value
      },
    });

    return res.status(200).json({
      message: `Product status updated successfully`,
      productId: updatedProduct.productId,
      newStatus: updatedProduct.status,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    return res.status(500).json({ error: "Error toggling product status" });
  }
};

