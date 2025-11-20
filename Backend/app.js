import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authorizationMiddleware from "./Middleware/authorizationMiddleware.js";
import feedBackRouter from "./Router/feedBackRouter.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const mongoUri = 'mongodb+srv://testing:1234@restaurant.pumi6d7.mongodb.net/?appName=Restaurant';


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

app.use("/api/auth", authorizationMiddleware);
app.use("/api/feedback", feedBackRouter);



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