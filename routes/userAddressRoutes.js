const express = require("express");
const router = express.Router();
const userAddressController = require("../controllers/userAddressController");

// Define routes and attach controller methods
router.post("/create", userAddressController.createUserAddress);

module.exports = router;
