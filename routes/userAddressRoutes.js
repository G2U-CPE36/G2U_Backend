const express = require("express");
const router = express.Router();
const userAddressController = require("../controllers/userAddressController");

// Define routes and attach controller methods
router.post("/create", userAddressController.createUserAddress);
router.get("/:userId", getUserAddresses); // Get Addresses by User ID
router.delete("/:addressId", deleteUserAddress); // Delete Address by Address ID
router.put("/:addressId", editUserAddress); // Edit Address by Address ID

module.exports = router;
