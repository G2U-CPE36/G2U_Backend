const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const userAddressRoutes = require("./routes/userAddressRoutes");
const productMainRoutes = require("./routes/productMainRoutes");
const productOrderRoutes = require("./routes/productOrderRoutes");
const openorderRoutes = require("./routes/openOrderRoutes");
const cardRoutes = require("./routes/cardRoutes");
const bankAccountRoutes = require("./routes/bankAccountRoutes");
const cors = require("cors");
const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);

// Body parser middleware
app.use(bodyParser.json()); // Allows sending JSON data
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", userAddressRoutes);
app.use("/api/mainproduct", productMainRoutes);
app.use("/api/order",productOrderRoutes);
app.use("/api/openorders", openorderRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/bankAccounts", bankAccountRoutes);

// Start server

app.listen(25000, () => {
  console.log("Server is running on port 25000");
});