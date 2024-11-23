const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller function to create user address
exports.createUserAddress = async (req, res) => {
  const {
    userId,
    province,
    district,
    subDistrict,
    postcode,
    address,
    note,
    receiverName,
    phone,
  } = req.body;

  // Validate required fields
  if (
    !userId ||
    !province ||
    !district ||
    !postcode ||
    !address ||
    !receiverName ||
    !phone
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create the user address
    const newAddress = await prisma.userAddress.create({
      data: {
        userId: parseInt(userId), // Ensure userId is an integer
        province,
        district,
        subDistrict,
        postcode,
        address,
        note,
        receiverName,
        phone: BigInt(phone), // Ensure phone is stored as BigInt
      },
    });
    newAddress.phone = newAddress.phone.toString();
    return res.status(201).json(newAddress); // Return the created address
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating address" });
  }
};
