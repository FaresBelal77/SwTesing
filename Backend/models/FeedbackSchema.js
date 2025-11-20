const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("Feedback", FeedbackSchema);