import { useState, useEffect } from "react";
import { orderAPI, menuAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import "../Orders.css";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [orderForm, setOrderForm] = useState({
    items: [{ menuItem: "", quantity: 1 }],
    orderType: "dine-in",
    reservationId: "",
  });

  useEffect(() => {
    fetchOrders(true);
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await menuAPI.getMenuItems();
      // Backend returns array directly
      setMenuItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load menu items:", err);
    }
  };

  const fetchOrders = async (clearErrors = false) => {
    try {
      setLoading(true);
      if (clearErrors) {
        setError("");
      }
      const response = await orderAPI.getUserOrders();
      console.log("Orders API response:", response);
      console.log("Orders response data:", response.data);
      
      // Backend returns { message: "...", data: [...] }
      let ordersData = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        }
      }
      
      console.log("Parsed orders:", ordersData);
      setOrders(ordersData);
      // Clear error on successful fetch
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      console.error("Error response:", err.response?.data);
      // Only show error if we're not in the middle of creating an order
      const errorMsg = err.response?.data?.message || "Failed to load orders";
      if (clearErrors || !message) {
        setError(errorMsg);
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setOrderForm({
      ...orderForm,
      items: [...orderForm.items, { menuItem: "", quantity: 1 }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm({ ...orderForm, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderForm.items];
    newItems[index][field] = field === "quantity" ? parseInt(value) : value;
    setOrderForm({ ...orderForm, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate items
    const validItems = orderForm.items.filter(
      (item) => item.menuItem && item.quantity > 0
    );

    if (validItems.length === 0) {
      setError("Please add at least one menu item");
      return;
    }

    try {
      const orderData = {
        items: validItems.map((item) => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
        })),
        orderType: orderForm.orderType,
      };

      if (orderForm.reservationId) {
        orderData.reservationId = orderForm.reservationId;
      }

      const response = await orderAPI.createOrder(orderData);
      console.log("Order created response:", response.data);
      
      if (response.data && response.data.message) {
        setMessage("Order created successfully!");
        setError(""); // Clear any previous errors
        setOrderForm({
          items: [{ menuItem: "", quantity: 1 }],
          orderType: "dine-in",
          reservationId: "",
        });
        // Refresh orders immediately and clear any errors
        await fetchOrders(true);
      }
    } catch (err) {
      console.error("Create order error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "Failed to create order. Please check your menu items."
      );
      setMessage(""); // Clear success message if there's an error
    }
  };

  if (loading && orders.length === 0) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {/* Create Order Form */}
        <div className="order-form-card">
          <h2 className="order-form-title">Create New Order</h2>

          {error && (
            <div className="order-error">{error}</div>
          )}

          {message && (
            <div className="order-success">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="order-label">Order Type</label>
              <select
                value={orderForm.orderType}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, orderType: e.target.value })
                }
                className="order-select"
              >
                <option value="dine-in">Dine-in</option>
                <option value="pre-order">Pre-order</option>
              </select>
            </div>

            <div>
              <label className="order-label">Reservation ID (optional)</label>
              <input
                type="text"
                value={orderForm.reservationId}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, reservationId: e.target.value })
                }
                className="order-input"
                placeholder="Leave empty if no reservation"
              />
            </div>

            <div>
              <label className="order-label">Menu Items</label>
              {orderForm.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <select
                    value={item.menuItem}
                    onChange={(e) =>
                      handleItemChange(index, "menuItem", e.target.value)
                    }
                    className="order-item-select"
                    required
                  >
                    <option value="">Select menu item</option>
                    {menuItems.map((menuItem) => (
                      <option key={menuItem._id} value={menuItem._id}>
                        {menuItem.name} - ${menuItem.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="order-quantity-input"
                    required
                  />
                  {orderForm.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="order-button-remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="order-button-add"
              >
                Add Item
              </button>
            </div>

            <button
              type="submit"
              className="order-button"
            >
              Create Order
            </button>
          </form>
        </div>

        {/* Orders List */}
        <div className="orders-list-card">
          <h2 className="orders-list-title">Order History</h2>

          {orders.length === 0 ? (
            <p className="orders-empty">No orders found</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="order-item"
                >
                  <div className="order-item-header">
                    <div className="order-item-left">
                      <p className="order-item-id">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="order-item-date">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="order-item-right">
                      <p className="order-item-price">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </p>
                      <p
                        className={`order-status ${
                          order.status === "completed"
                            ? "completed"
                            : order.status === "cancelled"
                            ? "cancelled"
                            : "pending"
                        }`}
                      >
                        {order.status}
                      </p>
                      <p className="order-type">{order.orderType}</p>
                    </div>
                  </div>

                  <div className="order-items-list">
                    <p className="order-items-title">Items:</p>
                    <ul className="order-items-ul">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.menuItem?.name || "Unknown"} x {item.quantity}
                        </li>
                      ))}
                    </ul>
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

