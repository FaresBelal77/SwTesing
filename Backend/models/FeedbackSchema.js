const FeedbackSchema = new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
  
      comment: { type: String },
  
    },
    { timestamps: true }
  );
  
  export default model("Feedback", FeedbackSchema)