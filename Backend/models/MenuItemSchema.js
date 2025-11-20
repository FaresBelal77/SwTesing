const { Schema, model } = require("mongoose");

const MenuItemSchema = new Schema(
    {
      name: { type: String, required: true },
  
      description: { type: String },
  
      price: { type: Number, required: true },
  
      category: { type: String }, // Drinks, Pizza, Dessert, etc.
  
      available: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );
  
module.exports = model("MenuItem", MenuItemSchema);