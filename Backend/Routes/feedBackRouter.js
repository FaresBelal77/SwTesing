const express = require("express");
const {
  submitFeedback,
  viewFeedback,
  viewAllFeedbacks,
} = require("../Controllers/feedBackController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(["admin", "customer"]),
  submitFeedback
);

router.get(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(["admin"]),
  viewAllFeedbacks
);

router.get(
  "/:feedbackId",
  authenticationMiddleware,
  authorizationMiddleware(["admin", "customer"]),
  viewFeedback
);

module.exports = router;

