import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getCalendar } from "../controllers/calendarController.js";

const router = express.Router();

router.get("/", protect, getCalendar);

export default router;
