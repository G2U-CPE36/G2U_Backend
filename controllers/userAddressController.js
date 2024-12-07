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
    isDefault,
  } = req.body;

  // Validate required fields
  if (!userId || !province || !district || !postcode || !address || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // If the address is to be set as the default, ensure the user does not have another default address
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId: parseInt(userId),
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Log the userId and phone value to check them
    console.log('Creating address for userId:', userId);
    console.log('Phone:', phone);

    // Create the new address
    const newAddress = await prisma.userAddress.create({
      data: {
        userId: parseInt(userId),
        province,
        district,
        subDistrict,
        postcode,
        address,
        note,
        receiverName,
        phone: phone.toString(),
        isDefault: isDefault || false,
      },
    });

    // Convert phone to string for response
    newAddress.phone = newAddress.phone.toString();

    return res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error.message);  // More detailed error logging
    return res.status(500).json({ error: "Error creating address", details: error.message });
  }
};

// Controller function to get user addresses
exports.getUserAddresses = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const addresses = await prisma.userAddress.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    const formattedAddresses = addresses.map((address) => ({
      ...address,
      phone: address.phone.toString(),
    }));

    return res.status(200).json(formattedAddresses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving addresses" });
  }
};

// Controller function to delete a user address
// deleteUserAddress.js
exports.deleteUserAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const address = await prisma.userAddress.findUnique({
      where: {
        addressId: parseInt(addressId),  // Assuming 'id' is the unique field
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await prisma.userAddress.delete({
      where: { addressId: parseInt(addressId) },
    });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting address" });
  }
};


// Controller function to edit a user address
exports.editUserAddress = async (req, res) => {
  const { addressId } = req.params;
  const {
    province,
    district,
    subDistrict,
    postcode,
    address,
    note,
    receiverName,
    phone,
    isDefault,
  } = req.body;

  if (!addressId) {
    return res.status(400).json({ error: "Address ID is required" });
  }

  try {
    const addressToEdit = await prisma.userAddress.findUnique({
      where: {
        addressId: parseInt(addressId),
      },
    });

    if (!addressToEdit) {
      return res.status(404).json({ error: "Address not found" });
    }

    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId: addressToEdit.userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        addressId: parseInt(addressId),
      },
      data: {
        province: province || addressToEdit.province,
        district: district || addressToEdit.district,
        subDistrict: subDistrict || addressToEdit.subDistrict,
        postcode: postcode || addressToEdit.postcode,
        address: address || addressToEdit.address,
        note: note || addressToEdit.note,
        receiverName: receiverName || addressToEdit.receiverName,
        phone: phone ? phone.toString() : addressToEdit.phone,
        isDefault: isDefault !== undefined ? isDefault : addressToEdit.isDefault,
      },
    });

    updatedAddress.phone = updatedAddress.phone.toString(); // Convert phone to string for response
    return res.status(200).json(updatedAddress);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error editing address" });
  }
};
