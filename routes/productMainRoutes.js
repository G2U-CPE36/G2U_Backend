const express = require("express");
const router = express.Router();
const productMainController = require("../controllers/productMainController");

// Define routes and attach controller methods
router.get("/main", productMainController.getAllMainProducts);
router.get("/filter", productMainController.searchAndFilterProducts);
module.exports = router;
