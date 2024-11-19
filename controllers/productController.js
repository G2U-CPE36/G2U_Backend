// controllers/productController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new product
exports.createProduct = async (req, res) => {
  const { productName, categoryId, productDescription, productImage, userId } =
    req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        productName,
        categoryId,
        productDescription,
        productImage,
        userId,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating product" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true, // Include category data in response
        User: true, // Include user data in response
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching products" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) },
      include: {
        Category: true,
        User: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching product" });
  }
};

// Update product details
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { productName, categoryId, productDescription, productImage, userId } =
    req.body;

  try {
    const product = await prisma.product.update({
      where: { productId: parseInt(productId) },
      data: {
        productName,
        categoryId,
        productDescription,
        productImage,
        userId,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating product" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.delete({
      where: { productId: parseInt(productId) },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting product" });
  }
};
