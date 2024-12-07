const express = require("express");
const router = express.Router();
const userAddressController = require("../controllers/userAddressController");

// Define routes and attach controller methods
router.post("/create", userAddressController.createUserAddress);
router.get("/:userId", userAddressController.getUserAddresses); // Get Address by User ID
router.delete("/:addressId", userAddressController.deleteUserAddress); // Delete Address by Address ID
router.put("/:addressId", userAddressController.editUserAddress); // Edit Address by Address ID

module.exports = router;
