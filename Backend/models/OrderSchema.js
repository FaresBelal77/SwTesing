const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      // Optional reservation reference
      reservation: {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
        required: false,   // explicitly optional
        default: null,
      },
  
      items: [
        {
          menuItem: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
  
      totalPrice: { type: Number, required: true },
  
      orderType: {
        type: String,
        enum: ["pre-order", "dine-in"],
        default: "dine-in",
      },
  
      status: {
        type: String,
        enum: ["pending", "preparing", "completed", "cancelled"],
        default: "pending",
      },
    },
    { timestamps: true }
  );
  
module.exports = model("Order", OrderSchema);