const { validationResult } = require("express-validator");
const Reservation = require("../models/ReservationSchema");
const User = require("../models/UserSchema");
const Feedback = require("../models/FeedbackSchema");
const orderSchema = require("../models/OrderSchema");
const menuItemSchema = require("../models/MenuItemSchema");

const ACTIVE_STATES = ["pending", "confirmed"];

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Invalid reservation payload",
      errors: errors.array(),
    });
    return true;
  }
  return false;
};

const resolveCustomerId = (user) => user?.id || user?._id;

const reservationController = {
  createReservation: async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const { date, time, numberOfGuests, notes } = req.body;
    const customerId = resolveCustomerId(req.user);
    if (!customerId) {
      return res.status(401).json({ message: "User identity missing" });
    }

    try {
      const existingReservation = await Reservation.findOne({
        date,
        time,
        isActive: true,
        status: { $in: ACTIVE_STATES },
      });

      if (existingReservation) {
        return res.status(409).json({
          message:
            "Selected time slot is unavailable. Please choose another slot.",
        });
      }

      const reservation = await Reservation.create({
        customer: customerId,
        date,
        time,
        numberOfGuests,
        notes,
      });

      return res.status(201).json({
        message: "Reservation created successfully",
        reservation,
      });
    } catch (error) {
      console.error("createReservation error:", error);
      return res.status(500).json({ message: "Unable to create reservation" });
    }
  },

  getUserReservations: async (req, res) => {
    try {
      const customerId = resolveCustomerId(req.user);
      if (!customerId) {
        return res.status(401).json({ message: "User identity missing" });
      }

      const reservations = await Reservation.find({
        customer: customerId,
      }).sort({
        date: 1,
        time: 1,
      });

      return res.status(200).json({ reservations });
    } catch (error) {
      console.error("getUserReservations error:", error);
      return res
        .status(500)
        .json({ message: "Unable to fetch reservations" });
    }
  },

  getAllReservations: async (req, res) => {
    try {
      const { status } = req.query;
      const query = {};
      if (status) {
        query.status = status;
      }

      const reservations = await Reservation.find(query)
        .populate("customer", "name email role")
        .sort({ createdAt: -1 });

      return res.status(200).json({ reservations });
    } catch (error) {
      console.error("getAllReservations error:", error);
      return res
        .status(500)
        .json({ message: "Unable to fetch all reservations" });
    }
  },

  updateReservationStatus: async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;

    try {
      const reservation = await Reservation.findById(id);

      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      reservation.status = status;
      reservation.isActive = ACTIVE_STATES.includes(status);

      await reservation.save();

      return res.status(200).json({
        message: "Reservation status updated",
        reservation,
      });
    } catch (error) {
      console.error("updateReservationStatus error:", error);
      return res
        .status(500)
        .json({ message: "Unable to update reservation" });
    }
  },
};

module.exports = reservationController;