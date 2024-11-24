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
    isDefault, // New field to set whether the address is the default
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
    // If the address is to be set as the default, ensure the user does not have another default address
    if (isDefault) {
      // Update all the user's existing addresses to have isDefault = false
      await prisma.userAddress.updateMany({
        where: {
          userId: parseInt(userId),
          isDefault: true, // Only affect current default addresses
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create the new address
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
        isDefault: isDefault || false, // Set the default flag if provided, otherwise false
      },
    });

    newAddress.phone = newAddress.phone.toString(); // Convert phone to string for response
    return res.status(201).json(newAddress); // Return the created address
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating address" });
  }
};
