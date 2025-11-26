import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  getAdvisorTips,
  askChatbot,
} from "../controllers/aiController.js";

const router = express.Router();

router.get("/advisor", protect, getAdvisorTips);
router.post("/chatbot", protect, askChatbot);

export default router;
