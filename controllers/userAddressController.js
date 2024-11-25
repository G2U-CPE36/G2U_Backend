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
},
// Controller function to get user addresses
exports.getUserAddresses = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const addresses = await prisma.userAddress.findMany({
      where: {
        userId: parseInt(userId), // Ensure userId is an integer
      },
    });

    // Convert phone numbers to string for response
    const formattedAddresses = addresses.map((address) => ({
      ...address,
      phone: address.phone.toString(),
    }));

    return res.status(200).json(formattedAddresses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving addresses" });
  }
},

// Controller function to delete a user address
exports.deleteUserAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId) {
    return res.status(400).json({ error: "Address ID is required" });
  }

  try {
    // Check if the address exists
    const address = await prisma.userAddress.findUnique({
      where: {
        id: parseInt(addressId),
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // Delete the address
    await prisma.userAddress.delete({
      where: {
        id: parseInt(addressId),
      },
    });

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting address" });
  }
};




