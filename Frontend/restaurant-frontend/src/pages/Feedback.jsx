import { useState } from "react";
import { feedbackAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";

export default function Feedback() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    rating: 5,
    comment: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (form.rating < 1 || form.rating > 5) {
      setError("Rating must be between 1 and 5");
      setLoading(false);
      return;
    }

    try {
      await feedbackAPI.submitFeedback(form);
      setMessage("Feedback submitted successfully! Thank you for your feedback.");
      setForm({ rating: 5, comment: "" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Submit Feedback</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Rating</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: parseInt(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-2xl font-bold text-yellow-500">
                {form.rating} ⭐
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Rate your experience from 1 (poor) to 5 (excellent)
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Comment (optional)</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="border p-2 w-full rounded"
              rows="5"
              placeholder="Share your thoughts about your experience..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          Your feedback helps us improve our service. We appreciate your time and
          input!
        </p>
      </div>
    </div>
  );
}

