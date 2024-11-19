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
      const { username, password } = req.body;

      // Find the user by username
      const user = await prisma.user.findFirst({
        select: {
          userId: true,
          username: true,
          password: true, // Select the password field for comparison
        },
        where: {
          username,
          status: "use", // Only active users
        },
      });

      if (user) {
        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          // Create JWT token
          const token = jwt.sign(
            { userId: user.userId, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "30d" } // Token expiration of 30 days
          );

          return res.json({
            token,
            userId: user.userId,
            username: user.username,
          });
        }
      }

      // If user not found or invalid credentials
      return res.status(401).json({ message: "Unauthorized" });
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
          userId: "desc", // Order by descending userId
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

      await prisma.user.update({
        where: { userId: parseInt(userId) }, // Parse userId as an integer
        data: { firstName, lastName, address, phone },
      });

      return res.json({ message: "Profile updated successfully" });
    } catch (e) {
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

  // Other methods like remove, etc. remain the same...
};
