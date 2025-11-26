import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getBudgets } from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", protect, getBudgets);

export default router;
