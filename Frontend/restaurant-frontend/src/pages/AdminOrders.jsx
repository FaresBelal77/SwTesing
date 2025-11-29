import { useState, useEffect } from "react";
import { orderAPI } from "../services/api";
import "../AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      const response = await orderAPI.getAllOrders();
      console.log("Admin Orders API response:", response);
      console.log("Admin Orders response data:", response.data);
      
      // Backend returns { message: "...", data: [...] }
      let ordersData = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        }
      }
      
      console.log("Parsed admin orders:", ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load orders";
      setError(errorMsg);
      setOrders([]); // Clear orders on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setError("");
      setMessage("");
      await orderAPI.updateOrderStatus(id, newStatus);
      setMessage("Order status updated successfully!");
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  if (loading) {
    return <div className="admin-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        <h1 className="admin-orders-title">Manage Orders</h1>

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
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="admin-orders-list-card">
          <h2 className="admin-orders-list-title">
            All Orders ({filteredOrders.length})
          </h2>

          {filteredOrders.length === 0 ? (
            <p className="admin-empty">No orders found</p>
          ) : (
            <div className="admin-orders-list">
              {filteredOrders.map((order) => (
                <div key={order._id} className="admin-order-item">
                  <div className="admin-order-header">
                    <div>
                      <p className="admin-order-id">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="admin-order-customer">
                        Customer: {order.customer?.name || "Unknown"}
                      </p>
                      <p className="admin-order-email">
                        {order.customer?.email || "N/A"}
                      </p>
                      <p className="admin-order-date">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="admin-order-right">
                      <p className="admin-order-price">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </p>
                      <span className={`admin-order-status admin-order-status-${order.status}`}>
                        {order.status}
                      </span>
                      <p className="admin-order-type">{order.orderType}</p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="admin-order-items">
                      <p className="admin-order-items-title">Items:</p>
                      <ul className="admin-order-items-list">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.menuItem?.name || "Unknown"} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="admin-order-actions">
                    {order.status !== "pending" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "pending")}
                        className="admin-button-pending"
                      >
                        Set Pending
                      </button>
                    )}
                    {order.status !== "preparing" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "preparing")}
                        className="admin-button-preparing"
                      >
                        Set Preparing
                      </button>
                    )}
                    {order.status !== "completed" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "completed")}
                        className="admin-button-confirm"
                      >
                        Complete
                      </button>
                    )}
                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, "cancelled")}
                        className="admin-button-cancel"
                      >
                        Cancel
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

