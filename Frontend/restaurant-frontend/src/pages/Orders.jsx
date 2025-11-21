import { useState, useEffect } from "react";
import { orderAPI, menuAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";

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
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
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

      await orderAPI.createOrder(orderData);
      setMessage("Order created successfully!");
      setOrderForm({
        items: [{ menuItem: "", quantity: 1 }],
        orderType: "dine-in",
        reservationId: "",
      });
      fetchOrders();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create order. Please check your menu items."
      );
    }
  };

  if (loading && orders.length === 0) {
    return <div className="text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Create Order Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Order</h2>

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
            <label className="block mb-2 font-medium">Order Type</label>
            <select
              value={orderForm.orderType}
              onChange={(e) =>
                setOrderForm({ ...orderForm, orderType: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              <option value="dine-in">Dine-in</option>
              <option value="pre-order">Pre-order</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Reservation ID (optional)</label>
            <input
              type="text"
              value={orderForm.reservationId}
              onChange={(e) =>
                setOrderForm({ ...orderForm, reservationId: e.target.value })
              }
              className="border p-2 w-full rounded"
              placeholder="Leave empty if no reservation"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Menu Items</label>
            {orderForm.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.menuItem}
                  onChange={(e) =>
                    handleItemChange(index, "menuItem", e.target.value)
                  }
                  className="border p-2 flex-1 rounded"
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
                  className="border p-2 w-20 rounded"
                  required
                />
                {orderForm.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Add Item
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Order
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${order.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        order.status === "completed"
                          ? "text-green-600"
                          : order.status === "cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </p>
                    <p className="text-sm text-gray-600">{order.orderType}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="font-medium mb-1">Items:</p>
                  <ul className="list-disc list-inside text-sm">
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
  );
}

