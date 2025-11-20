const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Reservation", ReservationSchema);