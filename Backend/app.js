const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
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
    console.error("MongoDB connection error:", err.message);
    console.error("Server will continue but database operations will fail.");
    console.error("Please ensure MongoDB is running or update DB_URL in .env file");
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/feedback", feedBackRouter);
app.use("/api/orders", orderRoutes);

// Health/Test endpoints
app.get("/api/test", (req, res) =>
  res.json({ message: "Test endpoint working" })
);

// Serve static files from the React app in production
const frontendBuildPath = path.join(__dirname, "../Frontend/restaurant-frontend/dist");
app.use(express.static(frontendBuildPath));

// The "catchall" handler: for any request that doesn't match an API route,
// send back React's index.html file (for client-side routing)
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Route not found" });
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
