const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routers
const authRoutes = require("./Routes/authRoutes");
const menuRoutes = require("./Routes/menuRoutes");
const reservationRoutes = require("./Routes/reservationRoutes");
const feedBackRouter = require("./Routes/feedBackRouter");
const orderRoutes = require("./Routes/orderRoutes");

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// MongoDB connection
const mongoUri =
  process.env.DB_URL ||
  "mongodb+srv://testing:1234@restaurant.pumi6d7.mongodb.net/?appName=Restaurant";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/feedback", feedBackRouter);
app.use("/api/orders", orderRoutes);

// Health/Test endpoints
app.get("/", (req, res) => res.send("Server is running"));
app.get("/test", (req, res) =>
  res.json({ message: "Test endpoint working" })
);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
