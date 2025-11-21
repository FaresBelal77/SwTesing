import { useState, useEffect } from "react";
import { menuAPI } from "../services/api";

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
    return <div className="text-center">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

      {menuItems.length === 0 ? (
        <p className="text-center text-gray-600">No menu items available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <p className="text-lg font-bold text-blue-600">
                ${item.price?.toFixed(2) || "N/A"}
              </p>
              {item.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-gray-200 rounded text-sm">
                  {item.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

