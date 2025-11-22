import { useState, useEffect } from "react";
import { menuAPI } from "../services/api";
import "../AdminMenu.css";

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuItems();
      setMenuItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await menuAPI.editMenuItem(editingId, form);
        setMessage("Menu item updated successfully!");
      } else {
        await menuAPI.addMenuItem(form);
        setMessage("Menu item added successfully!");
      }
      setForm({ name: "", description: "", price: "", category: "", available: true });
      setEditingId(null);
      fetchMenuItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || "",
      available: item.available !== false,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      await menuAPI.deleteMenuItem(id);
      setMessage("Menu item deleted successfully!");
      fetchMenuItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete menu item");
    }
  };

  const cancelEdit = () => {
    setForm({ name: "", description: "", price: "", category: "", available: true });
    setEditingId(null);
  };

  if (loading) {
    return <div className="admin-loading">Loading menu items...</div>;
  }

  return (
    <div className="admin-menu-page">
      <div className="admin-menu-container">
        <h1 className="admin-menu-title">Manage Menu Items</h1>

        {/* Add/Edit Form */}
        <div className="admin-menu-form-card">
          <h2 className="admin-menu-form-title">
            {editingId ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>

          {error && <div className="admin-error">{error}</div>}
          {message && <div className="admin-success">{message}</div>}

          <form onSubmit={handleSubmit} className="admin-menu-form">
            <div>
              <label className="admin-label">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input"
                required
              />
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="admin-textarea"
                rows="3"
                required
              />
            </div>

            <div className="admin-form-row">
              <div>
                <label className="admin-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="admin-input"
                  placeholder="e.g., pizza, pasta, dessert"
                />
              </div>
            </div>

            <div>
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="admin-checkbox"
                />
                Available
              </label>
            </div>

            <div className="admin-form-buttons">
              <button type="submit" className="admin-button">
                {editingId ? "Update Item" : "Add Item"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="admin-button-cancel">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Menu Items List */}
        <div className="admin-menu-list-card">
          <h2 className="admin-menu-list-title">All Menu Items</h2>

          {menuItems.length === 0 ? (
            <p className="admin-empty">No menu items found</p>
          ) : (
            <div className="admin-menu-grid">
              {menuItems.map((item) => (
                <div key={item._id} className="admin-menu-item-card">
                  <div className="admin-menu-item-header">
                    <h3 className="admin-menu-item-name">{item.name}</h3>
                    <span className={`admin-menu-item-status ${item.available ? "available" : "unavailable"}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="admin-menu-item-description">{item.description}</p>
                  <div className="admin-menu-item-footer">
                    <p className="admin-menu-item-price">${item.price?.toFixed(2) || "0.00"}</p>
                    {item.category && (
                      <span className="admin-menu-item-category">{item.category}</span>
                    )}
                  </div>
                  <div className="admin-menu-item-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="admin-button-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="admin-button-delete"
                    >
                      Delete
                    </button>
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

