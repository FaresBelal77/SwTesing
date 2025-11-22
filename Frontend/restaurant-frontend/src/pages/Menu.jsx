import { useState, useEffect } from "react";
import { menuAPI } from "../services/api";
import "../Menu.css";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuItems();
      // Backend returns array directly
      setMenuItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="menu-loading">Loading menu...</div>;
  }

  if (error) {
    return <div className="menu-error">{error}</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-container">
        <h1 className="menu-title">Our Menu</h1>

        {menuItems.length === 0 ? (
          <p className="menu-empty">No menu items available</p>
        ) : (
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="menu-item-card"
              >
                <h2 className="menu-item-name">{item.name}</h2>
                <p className="menu-item-description">{item.description}</p>
                <p className="menu-item-price">
                  ${item.price?.toFixed(2) || "N/A"}
                </p>
                {item.category && (
                  <span className="menu-item-category">
                    {item.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

