const express = require("express");
require("dotenv").config( {quiet: true} )
const app = express();
const mongoose = require('mongoose');

const authRoutes = require("./Routes/authRoutes");


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

app.use("/api/auth", authRoutes);




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
//console.log(process.env.MONGO_USER, process.env.MONGO_PASS);