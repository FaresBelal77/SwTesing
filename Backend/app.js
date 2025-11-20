const express = require("express");
require("dotenv").config()
const app = express();
const mongoose = require('mongoose');

/*import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";*/
const orderRoutes = require("./Routes/orderRoutes");

const cors=require('cors');
app.use(cors());

app.use(express.json());
mongoose.connect('mongodb+srv://testing:1234@restaurant.pumi6d7.mongodb.net/?appName=Restaurant')

.then(() => {
    console.log("MongoDB has been connected");
})
.catch((err) => {
    console.error("Connection error:", err);
    process.exit(1)// mn el a5er  1 ----> error..... we 0----> eshta 3alek
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

const PORT =3000;
app.listen(PORT, () => console.log("server started on port 3000"));