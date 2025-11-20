/*import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authorizationMiddleware from "./Middleware/authorizationMiddleware.js";
import feedBackRouter from "./Routes/feedBackRouter.js";
import orderRoutes from "./Routes/orderRoutes.js";

dotenv.config();

const app = express();

/*import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
const orderRoutes = require("./Routes/orderRoutes");

app.use(cors());


app.use(express.json());
mongoose.connect('mongodb+srv://testing:1234@restaurant.pumi6d7.mongodb.net/?appName=Restaurant')

mongoose
  .connect(mongoUri, {
  })
  .then(() => {
    console.log("MongoDB has been connected");
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1); // 1 -> error, 0 -> success
  });

/*app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use("/orders", orderRoutes);



app.get('/',(req,res)=>{
    res.send('App.get function successful')
})
app.get('/test', async (req, res) => {
    try {
      const events = await Event.find(); 
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error connecting to MongoDB", error: error.message });
    }
  });
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import authRoutes from "./Controllers/authController.js";
import menuRoutes from "./Routes/menuRoutes.js";
import reservationRoutes from "./Routes/reservationRoutes.js";
import feedBackRouter from "./Routes/feedBackRouter.js";
import orderRoutes from "./Routes/orderRoutes.js";

// Import middleware
import authorizationMiddleware from "./Middleware/authorizationMiddleware.js";
import authenticationMiddleware from "./Middleware/authenticationMiddleware.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.DB_URL|| 'mongodb+srv://testing:1234@restaurant.pumi6d7.mongodb.net/?appName=Restaurant';
mongoose.connect(mongoUri)
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

// Test endpoints
app.get('/', (req, res) => res.send('Server is running'));
app.get('/test', async (req, res) => {
  try {
    // Example test: replace Event with your model if needed
    // const events = await Event.find(); 
    res.json({ message: "Test endpoint working" });
  } catch (error) {
    res.status(500).json({ message: "Error connecting to DB", error: error.message });
  }
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
