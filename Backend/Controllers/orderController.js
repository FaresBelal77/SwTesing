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

const calculateOrderTotal = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items are required.");
  }

  const menuItemIds = items.map((item) => item.menuItem);
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  if (menuItems.length !== menuItemIds.length) {
    throw new Error("One or more menu items do not exist.");
  }

  const priceMap = menuItems.reduce((acc, menuItem) => {
    acc[menuItem._id.toString()] = menuItem.price;
    return acc;
  }, {});

  return items.reduce((total, item) => {
    const unitPrice = priceMap[item.menuItem];
    if (typeof unitPrice !== "number") {
      throw new Error("Unable to determine price for one of the items.");
    }

    return total + unitPrice * item.quantity;
  }, 0);
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

