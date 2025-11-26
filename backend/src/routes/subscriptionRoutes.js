import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getSubscriptions } from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/", protect, getSubscriptions);

export default router;
