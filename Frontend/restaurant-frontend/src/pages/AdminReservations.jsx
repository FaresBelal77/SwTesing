import { useState, useEffect } from "react";
import { reservationAPI } from "../services/api";
import "../AdminReservations.css";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAllReservations();
      setReservations(response.data.reservations || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setError("");
      setMessage("");
      await reservationAPI.updateReservationStatus(id, newStatus);
      setMessage("Reservation status updated successfully!");
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update reservation status");
    }
  };

  const filteredReservations = statusFilter === "all"
    ? reservations
    : reservations.filter(r => r.status === statusFilter);

  if (loading) {
    return <div className="admin-loading">Loading reservations...</div>;
  }

  return (
    <div className="admin-reservations-page">
      <div className="admin-reservations-container">
        <h1 className="admin-reservations-title">Manage Reservations</h1>

        {error && <div className="admin-error">{error}</div>}
        {message && <div className="admin-success">{message}</div>}

        {/* Filter */}
        <div className="admin-filter">
          <label className="admin-filter-label">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Reservations List */}
        <div className="admin-reservations-list-card">
          <h2 className="admin-reservations-list-title">
            All Reservations ({filteredReservations.length})
          </h2>

          {filteredReservations.length === 0 ? (
            <p className="admin-empty">No reservations found</p>
          ) : (
            <div className="admin-reservations-list">
              {filteredReservations.map((reservation) => (
                <div key={reservation._id} className="admin-reservation-item">
                  <div className="admin-reservation-header">
                    <div>
                      <p className="admin-reservation-customer">
                        Customer: {reservation.customer?.name || "Unknown"}
                      </p>
                      <p className="admin-reservation-email">
                        {reservation.customer?.email || "N/A"}
                      </p>
                    </div>
                    <span className={`admin-reservation-status admin-reservation-status-${reservation.status}`}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="admin-reservation-details">
                    <p className="admin-reservation-detail">
                      <span className="admin-reservation-label">Date: </span>
                      {new Date(reservation.date).toLocaleDateString()}
                    </p>
                    <p className="admin-reservation-detail">
                      <span className="admin-reservation-label">Time: </span>
                      {reservation.time}
                    </p>
                    <p className="admin-reservation-detail">
                      <span className="admin-reservation-label">Guests: </span>
                      {reservation.numberOfGuests}
                    </p>
                    {reservation.notes && (
                      <p className="admin-reservation-detail">
                        <span className="admin-reservation-label">Notes: </span>
                        {reservation.notes}
                      </p>
                    )}
                  </div>

                  <div className="admin-reservation-actions">
                    {reservation.status !== "confirmed" && (
                      <button
                        onClick={() => handleStatusUpdate(reservation._id, "confirmed")}
                        className="admin-button-confirm"
                      >
                        Confirm
                      </button>
                    )}
                    {reservation.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusUpdate(reservation._id, "cancelled")}
                        className="admin-button-cancel"
                      >
                        Cancel
                      </button>
                    )}
                    {reservation.status !== "pending" && (
                      <button
                        onClick={() => handleStatusUpdate(reservation._id, "pending")}
                        className="admin-button-pending"
                      >
                        Set Pending
                      </button>
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

