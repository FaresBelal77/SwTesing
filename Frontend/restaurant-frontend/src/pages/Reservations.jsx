import { useState, useEffect } from "react";
import { reservationAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import "../Reservations.css";

export default function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    date: "",
    time: "",
    numberOfGuests: 1,
    notes: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getUserReservations();
      setReservations(response.data.reservations || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await reservationAPI.createReservation(form);
      setMessage("Reservation created successfully!");
      setForm({ date: "", time: "", numberOfGuests: 1, notes: "" });
      fetchReservations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to create reservation"
      );
    }
  };

  if (loading && reservations.length === 0) {
    return <div className="reservations-loading">Loading reservations...</div>;
  }

  return (
    <div className="reservations-page">
      <div className="reservations-container">
        <h1 className="reservations-title">My Reservations</h1>

        {/* Create Reservation Form */}
        <div className="reservation-form-card">
          <h2 className="reservation-form-title">Make a New Reservation</h2>

          {error && (
            <div className="reservation-error">{error}</div>
          )}

          {message && (
            <div className="reservation-success">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="reservation-label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="reservation-input"
                required
              />
            </div>

            <div>
              <label className="reservation-label">Time (24h format)</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="reservation-input"
                required
              />
            </div>

            <div>
              <label className="reservation-label">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.numberOfGuests}
                onChange={(e) =>
                  setForm({ ...form, numberOfGuests: parseInt(e.target.value) })
                }
                className="reservation-input"
                required
              />
            </div>

            <div>
              <label className="reservation-label">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="reservation-textarea"
                rows="3"
                maxLength="240"
              />
            </div>

            <button
              type="submit"
              className="reservation-button"
            >
              Create Reservation
            </button>
          </form>
        </div>

        {/* Reservations List */}
        <div className="reservations-list-card">
          <h2 className="reservations-list-title">My Reservations</h2>

          {reservations.length === 0 ? (
            <p className="reservations-empty">No reservations found</p>
          ) : (
            <div>
              {reservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className="reservation-item"
                >
                  <div>
                    <p className="reservation-item-detail">
                      <span className="reservation-item-label">Date: </span>
                      {new Date(reservation.date).toLocaleDateString()}
                    </p>
                    <p className="reservation-item-detail">
                      <span className="reservation-item-label">Time: </span>
                      {reservation.time}
                    </p>
                    <p className="reservation-item-detail">
                      <span className="reservation-item-label">Guests: </span>
                      {reservation.numberOfGuests}
                    </p>
                    <p className="reservation-item-detail">
                      <span className="reservation-item-label">Status: </span>
                      <span
                        className={`reservation-status ${
                          reservation.status === "confirmed"
                            ? "confirmed"
                            : reservation.status === "cancelled"
                            ? "cancelled"
                            : "pending"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </p>
                    {reservation.notes && (
                      <p className="reservation-notes">
                        <span className="reservation-item-label">Notes: </span>
                        {reservation.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

