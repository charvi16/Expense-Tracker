import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getBills } from "../controllers/billController.js";

const router = express.Router();

router.get("/", protect, getBills);

export default router;
