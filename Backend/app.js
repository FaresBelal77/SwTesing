const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/*import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";*/
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
app.use("/api/feedback", feedbackRoutes);*/

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));