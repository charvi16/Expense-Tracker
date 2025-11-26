import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { sendManualMonthlyReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/send-now", protect, sendManualMonthlyReport);

export default router;
