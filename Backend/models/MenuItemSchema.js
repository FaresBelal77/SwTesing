const MenuItemSchema = new Schema(
    {
      name: { type: String, required: true },
  
      description: { type: String },
  
      price: { type: Number, required: true },
  
      category: { type: String,
        enum: [ "Breakfast","Main course", "Appetizers", "Salads", "Soups", "Desserts", "Drinks","Extras"],
        required: true,
      },
  
      available: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  
  export default model("MenuItem", MenuItemSchema);