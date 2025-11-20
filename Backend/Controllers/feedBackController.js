const Feedback = require("../models/FeedbackSchema");

const submitFeedback = async (req, res) => {
  try {
    const { rating, comment, customer } = req.body || {};
    const customerId = req.user?.id || req.user?._id || customer;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Not a customer." });
    }

    if (typeof rating !== "number") {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const feedback = await Feedback.create({
      customer: customerId,
      rating,
      comment,
    });

    return res.status(201).json({
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({
      message: "Failed to submit feedback.",
      error: error.message,
    });
  }
};

const viewFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!feedbackId) {
      return res.status(400).json({ message: "Feedback ID is required." });
    }

    const feedback = await Feedback.findById(feedbackId).populate("customer", "name email");

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    return res.status(200).json({
      message: "Feedback retrieved successfully.",
      feedback,
    });
  } catch (error) {
    console.error("Error viewing feedback:", error);
    return res.status(500).json({
      message: "Failed to view feedback.",
      error: error.message,
    });
  }
};

const viewAllFeedbacks = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All feedback retrieved successfully.",
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback collection:", error);
    return res.status(500).json({
      message: "Failed to fetch feedback collection.",
      error: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
  viewFeedback,
  viewAllFeedbacks,
};
