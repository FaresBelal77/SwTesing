const express = require("express");
const { body } = require("express-validator");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const reservationController = require("../Controllers/reservationController");

const router = express.Router();

const reservationValidators = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be ISO8601 formatted"),
  body("time")
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be HH:MM (24h)"),
  body("numberOfGuests")
    .isInt({ min: 1, max: 20 })
    .withMessage("Guests must be between 1 and 20"),
  body("notes").optional().isString().trim().isLength({ max: 240 }),
];

// Customer: create reservation
router.post(
  "/users/reservations",
  //authenticationMiddleware,
  authorizationMiddleware(["customer",'admin']),
  reservationValidators,
  reservationController.createReservation
);

// Customer: view own reservations
router.get(
  "/users/reservations",
  authenticationMiddleware,
  authorizationMiddleware(["customer",'admin']),
  reservationController.getUserReservations
);

// Admin: view all reservations
router.get(
  "/reservations",
  authenticationMiddleware,
  authorizationMiddleware(["admin"]),
  reservationController.getAllReservations
);

// Admin: update reservation status
router.patch(
  "/reservations/:id",
  authenticationMiddleware,
  authorizationMiddleware(["admin"]),
  [
    body("status")
      .isIn(["pending", "confirmed", "cancelled"])
      .withMessage("Invalid reservation status"),
  ],
  reservationController.updateReservationStatus
);

module.exports = router;
