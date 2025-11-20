const express = require("express");
const router = express.Router();

const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../Controllers/orderController");

router.post(
  "/create",
  authenticationMiddleware,
  authorizationMiddleware(["customer", "admin"]),
  createOrder
);

router.get(
  "/user",
  authenticationMiddleware,
  authorizationMiddleware(["customer", "admin"]),
  getUserOrders
);

router.get(
  "/all",
  authenticationMiddleware,
  authorizationMiddleware(["admin"]),
  getAllOrders
);

router.patch(
  "/update/:id",
  authenticationMiddleware,
  authorizationMiddleware(["admin"]),
  updateOrderStatus
);

module.exports = router;

