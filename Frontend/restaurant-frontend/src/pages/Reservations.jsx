import { useState, useEffect } from "react";
import { reservationAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";

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
    return <div className="text-center">Loading reservations...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>

      {/* Create Reservation Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Make a New Reservation</h2>

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
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Time (24h format)</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Number of Guests</label>
            <input
              type="number"
              min="1"
              max="20"
              value={form.numberOfGuests}
              onChange={(e) =>
                setForm({ ...form, numberOfGuests: parseInt(e.target.value) })
              }
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border p-2 w-full rounded"
              rows="3"
              maxLength="240"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Reservation
          </button>
        </form>
      </div>

      {/* Reservations List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Reservations</h2>

        {reservations.length === 0 ? (
          <p className="text-gray-600">No reservations found</p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="border p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      Date: {new Date(reservation.date).toLocaleDateString()}
                    </p>
                    <p>Time: {reservation.time}</p>
                    <p>Guests: {reservation.numberOfGuests}</p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          reservation.status === "confirmed"
                            ? "text-green-600"
                            : reservation.status === "cancelled"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </p>
                    {reservation.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        Notes: {reservation.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

