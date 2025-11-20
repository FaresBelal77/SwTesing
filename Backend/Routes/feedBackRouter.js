import express from "express";
import { submitFeedback, viewFeedback, viewAllFeedbacks} from "../Controllers/feedBackController.js";
import authenticationMiddleware from "../Middleware/authenticationMiddleware.js";
import authorizationMiddleware from "../Middleware/authorizationMiddleware.js";

const router = express.Router();

router.post("/", authenticationMiddleware,authorizationMiddleware(["Admin", "User"]), submitFeedback);

router.get( "/",authenticationMiddleware,authorizationMiddleware(["Admin"]),viewAllFeedbacks);

router.get("/:feedbackId",authenticationMiddleware,authorizationMiddleware(["Admin", "User"]),viewFeedback);

export default router;

