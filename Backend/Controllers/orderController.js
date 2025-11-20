const Order = require("../models/OrderSchema");
const Reservation = require("../models/ReservationSchema");
const MenuItem = require("../models/MenuItemSchema");

const asyncHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    console.error("Order controller error:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const getNormalizedMenuItemId = (menuItem) => {
  if (!menuItem) {
    throw new Error("Menu item reference is missing.");
  }

  if (menuItem._id) {
    return menuItem._id.toString();
  }

  return menuItem.toString();
};

const calculateOrderTotal = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items are required.");
  }

  const normalizedItems = items.map((item) => {
    const normalizedQuantity = Number(item.quantity);

    if (!item.menuItem) {
      throw new Error("Each order item must include a menuItem id.");
    }

    if (Number.isNaN(normalizedQuantity) || normalizedQuantity <= 0) {
      throw new Error("Each order item must have a quantity greater than zero.");
    }

    return {
      menuItem: getNormalizedMenuItemId(item.menuItem),
      quantity: normalizedQuantity,
    };
  });

  const menuItemIds = normalizedItems.map((item) => item.menuItem);
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  if (menuItems.length !== menuItemIds.length) {
    throw new Error("One or more menu items do not exist.");
  }

  const priceMap = menuItems.reduce((acc, menuItem) => {
    acc[menuItem._id.toString()] = menuItem.price;
    return acc;
  }, {});

  return normalizedItems.reduce((total, item) => {
    const unitPrice = priceMap[item.menuItem];
    if (typeof unitPrice !== "number") {
      throw new Error("Unable to determine price for one of the items.");
    }

    return total + unitPrice * item.quantity;
  }, 0);
};

const isAdmin = (user = {}) => user.role?.trim() === "admin";

const isOrderOwner = (order, user = {}) => {
  const userId = user._id?.toString() || user.id?.toString();
  if (!userId || !order?.customer) {
    return false;
  }
  return order.customer.toString() === userId;
};

const ensureOrderAccess = (order, user) => {
  if (!isAdmin(user) && !isOrderOwner(order, user)) {
    const error = new Error("You are not allowed to modify this order.");
    error.statusCode = 403;
    throw error;
  }
};

const recalculateOrderTotalAndSave = async (order) => {
  if (!order.items || order.items.length === 0) {
    order.totalPrice = 0;
    await order.save();
    return order;
  }

  order.totalPrice = await calculateOrderTotal(order.items);
  await order.save();
  return order;
};

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, orderType = "dine-in", reservationId } = req.body;
  const customerId = req.user?._id || req.body.customerId;

  if (!customerId) {
    return res
      .status(400)
      .json({ message: "Customer information is required to create an order." });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items cannot be empty." });
  }

  let linkedReservation = null;

  if (reservationId) {
    linkedReservation = await Reservation.findById(reservationId);

    if (!linkedReservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }
  }

  const totalPrice = await calculateOrderTotal(items);

  const order = await Order.create({
    customer: customerId,
    reservation: linkedReservation?._id || null,
    items,
    orderType,
    totalPrice,
  });

  res.status(201).json({
    message: "Order created successfully.",
    data: order,
  });
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const customerId = req.user?._id || req.query.customerId;

  if (!customerId) {
    return res.status(400).json({ message: "Customer id is required." });
  }

  const orders = await Order.find({ customer: customerId })
    .populate("items.menuItem")
    .populate("reservation")
    .sort({ createdAt: -1 });

  res.json({
    message: "Orders fetched successfully.",
    data: orders,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, orderType } = req.query;
  const filters = {};

  if (status) filters.status = status;
  if (orderType) filters.orderType = orderType;

  const orders = await Order.find(filters)
    .populate("customer", "name email")
    .populate("items.menuItem")
    .populate("reservation")
    .sort({ createdAt: -1 });

  res.json({
    message: "All orders fetched successfully.",
    data: orders,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["pending", "preparing", "completed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${allowedStatuses.join(", ")}`,
    });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  order.status = status;
  await order.save();

  res.json({
    message: "Order status updated successfully.",
    data: order,
  });
});

exports.addMenuItemToOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { menuItemId, quantity = 1 } = req.body;

  if (!menuItemId) {
    return res.status(400).json({ message: "menuItemId is required." });
  }

  const normalizedQuantity = Number(quantity);
  if (Number.isNaN(normalizedQuantity) || normalizedQuantity <= 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be a number greater than zero." });
  }

  const normalizedMenuItemId = menuItemId.toString();

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  ensureOrderAccess(order, req.user);

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found." });
  }

  const existingItem = order.items.find(
    (item) => getNormalizedMenuItemId(item.menuItem) === normalizedMenuItemId
  );

  if (existingItem) {
    existingItem.quantity += normalizedQuantity;
  } else {
    order.items.push({ menuItem: menuItemId, quantity: normalizedQuantity });
  }

  order.markModified("items");
  await recalculateOrderTotalAndSave(order);

  res.json({
    message: "Menu item added to order.",
    data: order,
  });
});

exports.removeMenuItemFromOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { menuItemId } = req.body;

  if (!menuItemId) {
    return res.status(400).json({ message: "menuItemId is required." });
  }

  const normalizedMenuItemId = menuItemId.toString();

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  ensureOrderAccess(order, req.user);

  const initialLength = order.items.length;
  order.items = order.items.filter(
    (item) => getNormalizedMenuItemId(item.menuItem) !== normalizedMenuItemId
  );

  if (order.items.length === initialLength) {
    return res
      .status(404)
      .json({ message: "Menu item does not exist in this order." });
  }

  order.markModified("items");
  await recalculateOrderTotalAndSave(order);

  res.json({
    message: "Menu item removed from order.",
    data: order,
  });
});

exports.deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  ensureOrderAccess(order, req.user);

  await order.deleteOne();

  res.json({ message: "Order deleted successfully." });
});

