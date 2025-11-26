import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";
import groq from "../config/groqClient.js";

const router = express.Router();

router.get("/", protect, getDashboardData);

export default router;
