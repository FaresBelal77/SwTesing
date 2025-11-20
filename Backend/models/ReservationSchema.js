const ReservationSchema = new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      date: { type: String, required: true },
      time: { type: String, required: true },
  
      numberOfGuests: { type: Number, required: true },
  
      status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
      },
    },
    { timestamps: true }
  );
  
  export default model("Reservation", ReservationSchema);