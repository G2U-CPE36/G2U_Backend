const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add a bank account
const addBank = async (req, res) => {
  const { userId, accountNumber, bankName, accountHolder, isDefault } = req.body;

  try {
    // Check if the account number already exists for the user
    const existingAccount = await prisma.bankAccount.findFirst({
      where: { userId, accountNumber },
    });

    if (existingAccount) {
      return res
        .status(400)
        .json({ error: "This account number is already linked to the user." });
    }

    // Create the bank account
    const bankAccount = await prisma.bankAccount.create({
      data: {
        accountNumber,
        bankName,
        accountHolder,
        userId,
        isDefault: isDefault === "true" || isDefault === true,
      },
    });

    res.status(201).json({ message: "Bank account added successfully", bankAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add bank account" });
  }
};

// Get all bank accounts for a user
const getBanks = async (req, res) => {
  const { userId } = req.params;

  try {
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId: parseInt(userId) },
    });
    res.status(200).json(bankAccounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bank accounts" });
  }
};

// Delete a bank account by ID
const deleteBank = async (req, res) => {
  const { bankId } = req.params;

  try {
    const bankAccount = await prisma.bankAccount.delete({
      where: { id: parseInt(bankId) },
    });
    res.status(200).json({ message: "Bank account deleted successfully", bankAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete bank account" });
  }
};

module.exports = {
  addBank,
  getBanks,
  deleteBank,
};
