const express = require("express");
const router = express.Router();

const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  addMenuItemToOrder,
  removeMenuItemFromOrder,
  deleteOrder,
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

router.post(
  "/:id/items",
  authenticationMiddleware,
  authorizationMiddleware(["customer", "admin"]),
  addMenuItemToOrder
);

router.delete(
  "/:id/items",
  authenticationMiddleware,
  authorizationMiddleware(["customer", "admin"]),
  removeMenuItemFromOrder
);

router.delete(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(["customer", "admin"]),
  deleteOrder
);

module.exports = router;

