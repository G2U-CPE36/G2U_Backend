const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new product with an image
exports.createProduct = async (req, res) => {
  const { productName, categoryId, productDescription, userId } = req.body;

  // Get the image path if file is uploaded
  const productImage = req.file ? req.file.path : null;

  try {
    // Create a new product entry in the database
    const newProduct = await prisma.product.create({
      data: {
        productName,
        categoryId,
        productDescription,
        productImage, // Save the image path in the database
        userId,
      },
    });
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get all products or a single product by ID
exports.getProducts = async (req, res) => {
  const { id } = req.params;

  try {
    // If id is provided, fetch the single product by ID
    if (id) {
      const product = await prisma.product.findUnique({
        where: { productId: parseInt(id) },
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    }

    // If no id is provided, fetch all products
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, categoryId, productDescription, userId } = req.body;

  // Get the image path if file is uploaded
  const productImage = req.file ? req.file.path : null;

  try {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { productId: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product entry
    const updatedProduct = await prisma.product.update({
      where: { productId: parseInt(id) },
      data: {
        productName: productName || existingProduct.productName, // If no new name, keep the old one
        categoryId: categoryId || existingProduct.categoryId, // If no new category, keep the old one
        productDescription:
          productDescription || existingProduct.productDescription, // Keep old description if not provided
        productImage: productImage || existingProduct.productImage, // Update image path if new image uploaded
        userId: userId || existingProduct.userId, // Keep userId if not updated
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id) },
    });

    // Check if product exists before deleting
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await prisma.product.delete({
      where: { productId: parseInt(id) },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
