const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt
const prisma = new PrismaClient();
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// Ensure SECRET_KEY exists
if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the .env file");
}

module.exports = {
  signin: async (req, res) => { 
    try {
      const { email, password } = req.body; // Accept email instead of username

      // Find the user by email
      const user = await prisma.user.findFirst({
        select: {
          userId: true,
          email: true,
          password: true, // Select the password field for comparison
        },
        where: {
          email, // Match email instead of username
          status: "use", // Only active users
        },
      });

      if (user) {
        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          // Create JWT token
          const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "30d" } // Token expiration of 30 days
          );

          return res.json({
            token,
            userId: user.userId,
            email: user.email,
          });
        } else {
          // If password is incorrect
          return res.status(401).json({ message: "Wrong password" });
        }
      }

      // If user not found
      return res.status(404).json({ message: "User not found" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },



  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Create new user with the hashed password
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword, // Store the hashed password
          status: "use", // Default status is 'use'
        },
      });

      return res.json({ message: "User registered successfully" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  list: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
       where: {
         status: "use", // Only active users
        },
        orderBy: {
          userId: "asc", 
        },
        select: {
          userId: true,
          username: true,
          email: true,
        },
      });

      return res.json({ results: users });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { userId, firstName, lastName, address, phone } = req.body;
  
      // Validate required fields
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
  
      await prisma.user.update({
        where: { userId: parseInt(userId) }, // Ensure userId is an integer
        data: { firstName, lastName, address, phone }, // Update fields
      });
  
      return res.json({ message: "Profile updated successfully" });
    } catch (e) {
      console.error("Error updating profile:", e.message);
      return res.status(500).json({ error: e.message });
    }
  },
  

  getUserById: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      const user = await prisma.user.findUnique({
        where: { userId }, // Use userId as the key
        select: {
          userId: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          // Select related UserAddresses
          UserAddresses: {
            select: {
              address: true, // Address is part of the UserAddresses model
              province: true,
              district: true,
              subDistrict: true,
              postcode: true,
              note: true,
              receiverName: true,
              phone: true,
            },
          },
          // Optionally include other fields like password, status, etc.
          status: true, // Optional, depending on your requirements
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
  // In userController.js

  remove: async (req, res) => {
    try {
      const { userId } = req.params;

      // Soft delete: update user status to 'deleted'
      const user = await prisma.user.update({
        where: { userId: parseInt(userId) },
        data: { status: "deleted" },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User deleted successfully" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  like: async (req, res) => {
    const { userId, productId } = req.body;
  
    // Validate that both userId and productId are provided
    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId are required' });
    }
  
    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { userId }, // Adjust field name as per your schema
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the product exists
      const product = await prisma.product.findUnique({
        where: { productId }, // Adjust field name as per your schema
      });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Check if the user has already favorited this product
      const existingFavorite = await prisma.favorite.findFirst({
        where: {
          userId,
          productId,
        },
      });
  
      if (existingFavorite) {
        // If the favorite exists, delete it (unlike)
        await prisma.favorite.delete({
          where: { favoriteId: existingFavorite.favoriteId },
        });
  
        return res.status(200).json({
          message: 'Product unliked successfully',
          userId,
          productId,
        });
      } else {
        // If the favorite does not exist, create it (like)
        const favorite = await prisma.favorite.create({
          data: {
            userId,
            productId,
          },
        });
  
        return res.status(201).json({
          message: 'Product liked successfully',
          favoriteId: favorite.favoriteId,
          userId: favorite.userId,
          productId: favorite.productId,
        });
      }
    } catch (error) {
      console.error('Error in like function:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getLike: async (req, res) => {
    const { userId } = req.params; // Retrieve userId from the request parameters
  
    try {
      // Fetch the liked products for the given userId
      const likedProducts = await prisma.favorite.findMany({
        where: { userId: parseInt(userId) }, // Use userId from params
        include: {
          Product: true, // Include the related Product
        },
      });
  
      // Format the liked products to include user and province information
      const formattedLikedProducts = await Promise.all(
        likedProducts.map(async (favorite) => {
          const userWithAddress = await prisma.user.findUnique({
            where: { userId: favorite.userId }, // Find the user based on userId in the Favorite
            select: {
              username: true,
              email: true,
              UserAddresses: { select: { province: true } },
            },
          });
  
          return {
            ...favorite.Product, // Include product details
            province: userWithAddress?.UserAddresses[0]?.province || null, // Get the province, or null if not found
            username: userWithAddress?.username, // Include username
            email: userWithAddress?.email, // Include email
          };
        })
      );
  
      // If no liked products are found, return a message
      if (formattedLikedProducts.length === 0) {
        return res.status(404).json({ message: "No liked products found" });
      }
  
      // Send the liked products back in the response
      return res.status(200).json({ likedProducts: formattedLikedProducts });
    } catch (error) {
      console.error("Error fetching liked products:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  
  

  myPost: async (req, res) => {
    const { userId } = req.params; // Retrieve userId from the URL parameters
  
    // Validate if userId is present
    if (!userId) {
      return res.status(400).json({ error: "userId is required in URL" });
    }
  
    try {
      // Fetch products posted by the given userId
      const products = await prisma.product.findMany({
        where: { userId: parseInt(userId) }, // Query for products with the specific userId
        include: {
          Category: true, // Include related category information
          ProductOrders: {
            select: {
              orderStatus: true, // Fetch the status from ProductOrder table
            },
          },
        },
      });
  
      // If no products are found, return a message
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this user" });
      }
  
      // Format the products to include the status
      const formattedProducts = products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        categoryId: product.categoryId,
        categoryName: product.Category?.categoryName || null, // Include category name if available
        productDescription: product.productDescription,
        productImage: product.productImage, // Assuming this is a filename or URL
        userId: product.userId,
        price: product.price,
        condition: product.condition,
        status: product.ProductOrders.length > 0 ? product.ProductOrders[0].orderStatus : "posted", // Default to "posted" if no status found
      }));
  
      // Return the array of formatted products directly
      return res.status(200).json(formattedProducts);
    } catch (error) {
      console.error("Error fetching posted products:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  
   

};

