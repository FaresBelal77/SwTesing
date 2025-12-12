import axios from "axios";

// Use relative URL so it works on the same port as the backend
const API_BASE_URL = "/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies if needed in future
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  forgetPassword: (data) => api.put("/auth/forgetPassword", data),
  getMe: () => api.get("/auth/me"), // Get current user
};

// Menu API
export const menuAPI = {
  getMenuItems: () => api.get("/menu/list"),
  addMenuItem: (data) => api.post("/menu/add", data),
  editMenuItem: (id, data) => api.put(`/menu/edit/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/delete/${id}`),
};

// Reservation API
export const reservationAPI = {
  createReservation: (data) => api.post("/reservations/users/reservations", data),
  getUserReservations: () => api.get("/reservations/users/reservations"),
  getAllReservations: () => api.get("/reservations/reservations"),
  updateReservationStatus: (id, status) =>
    api.patch(`/reservations/reservations/${id}`, { status }),
};

// Order API
export const orderAPI = {
  createOrder: (data) => api.post("/orders/create", data),
  getUserOrders: () => api.get("/orders/user"),
  getAllOrders: () => api.get("/orders/all"),
  updateOrderStatus: (id, status) => api.patch(`/orders/update/${id}`, { status }),
  addMenuItemToOrder: (orderId, menuItemId, quantity) =>
    api.post(`/orders/${orderId}/items`, { menuItemId, quantity }),
  removeMenuItemFromOrder: (orderId, menuItemId) =>
    api.delete(`/orders/${orderId}/items`, { data: { menuItemId } }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: (data) => api.post("/feedback", data),
  getAllFeedbacks: () => api.get("/feedback"),
  getFeedback: (feedbackId) => api.get(`/feedback/${feedbackId}`),
};

export default api;

