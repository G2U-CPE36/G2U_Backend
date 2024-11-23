// controllers/productController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProduct = async (req, res) => {
  const {
    productName,
    categoryId,
    productDescription,
    productImage,
    userId,
    price,
    condition,
  } = req.body;

  // Validate required fields
  if (
    !productName ||
    !categoryId ||
    !productDescription ||
    !productImage ||
    !userId ||
    !price ||
    !condition
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

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
        price,
        condition,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating product" });
  }
};

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
            firstName: true,
            lastName: true,
            phone: true,
            UserAddresses: {
              select: {
                province: true,
              },
            },
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      productName: product.productName,
      categoryId: product.categoryId,
      productDescription: product.productDescription,
      productImage: product.productImage,
      userId: product.userId,
      price: product.price,
      condition: product.condition,
      province:
        product.User.UserAddresses.length > 0
          ? product.User.UserAddresses[0].province
          : null,
    }));

    return res.json(formattedProducts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

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
            firstName: true,
            lastName: true,
            phone: true,
            UserAddresses: {
              select: {
                province: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productWithProvince = {
      ...product,
      province:
        product.User.UserAddresses.length > 0
          ? product.User.UserAddresses[0].province
          : null,
    };

    return res.status(200).json(productWithProvince);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching product" });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const {
    productName,
    categoryId,
    productDescription,
    productImage,
    userId,
    price,
    condition,
  } = req.body;

  if (
    !productName ||
    !categoryId ||
    !productDescription ||
    !productImage ||
    !userId ||
    !price ||
    !condition
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: parseInt(productId) },
      data: {
        productName,
        categoryId,
        productDescription,
        productImage,
        userId,
        price,
        condition,
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating product" });
  }
};

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
