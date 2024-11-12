const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new user
exports.createUser = async (req, res) => {
  const { firstName, lastName, username, email, phone } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        phone,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: parseInt(userId),
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, username, email, phone } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId: parseInt(userId),
      },
      data: {
        firstName,
        lastName,
        username,
        email,
        phone,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
