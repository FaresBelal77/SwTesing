const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const reservationRoutes = require("./Routes/reservationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.DB_URL ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/swtesing_reservations";
const CLIENT_URLS = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:3000"];

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URLS,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

app.use("/api", reservationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log("MongoDB has been connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});

module.exports = app;