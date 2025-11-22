import { useState, useEffect } from "react";
import { feedbackAPI } from "../services/api";
import "../AdminFeedback.css";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAllFeedbacks();
      setFeedbacks(response.data.feedbacks || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading feedback...</div>;
  }

  return (
    <div className="admin-feedback-page">
      <div className="admin-feedback-container">
        <h1 className="admin-feedback-title">All Feedback</h1>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-feedback-list-card">
          <h2 className="admin-feedback-list-title">
            Customer Feedback ({feedbacks.length})
          </h2>

          {feedbacks.length === 0 ? (
            <p className="admin-empty">No feedback found</p>
          ) : (
            <div className="admin-feedback-list">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="admin-feedback-item">
                  <div className="admin-feedback-header">
                    <div>
                      <p className="admin-feedback-customer">
                        {feedback.customer?.name || "Anonymous"}
                      </p>
                      <p className="admin-feedback-email">
                        {feedback.customer?.email || "N/A"}
                      </p>
                    </div>
                    <div className="admin-feedback-rating">
                      <span className="admin-feedback-stars">
                        {"⭐".repeat(feedback.rating || 0)}
                      </span>
                      <span className="admin-feedback-rating-value">
                        {feedback.rating}/5
                      </span>
                    </div>
                  </div>

                  {feedback.comment && (
                    <div className="admin-feedback-comment">
                      <p className="admin-feedback-comment-label">Comment:</p>
                      <p className="admin-feedback-comment-text">{feedback.comment}</p>
                    </div>
                  )}

                  <p className="admin-feedback-date">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

