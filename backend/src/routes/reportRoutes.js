import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { generateReportPDF } from "../controllers/reportController.js";

const router = express.Router();

router.get("/pdf", protect, generateReportPDF);

export default router;
