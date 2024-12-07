const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user (username, email, password)
router.post("/register", userController.register);

// Sign in an existing user
router.post("/signin", userController.signin); // Add this route for signin

// Get all users (for admin purposes or debugging, optional)
router.get("/list", userController.list);

// Get a specific user by ID (for profile view)
router.get("/:userId", userController.getUserById);

// Update user profile (name, last name, address, phone number)
router.put("/:userId", userController.updateProfile);

// Soft delete a user (status set to 'delete')
router.delete("/:userId", userController.remove);

// User Like
router.post("/like", userController.like);

router.get("/getLike/:userId", userController.getLike);

router.get("/myPost/:userId", userController.myPost);


module.exports = router;
