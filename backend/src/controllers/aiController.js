import aiBudgetAdvice from "../services/aiBudgetService.js";
import aiCategoryPredictor from "../services/aiCategoryPredictor.js";
import cashflowPredictor from "../services/aiCashflowPredictor.js";
import chatbotService from "../services/chatbotService.js";

// GET /api/advisor
export const getAdvisorTips = async (req, res) => {
  try {
    const tips = await aiBudgetAdvice(req.user._id);
    res.json({ tips });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate advice" });
  }
};


// POST /api/chatbot
export const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await chatbotService(req.user._id, message);
    res.json({ reply });
  } catch {
    res.status(500).json({ message: "Chatbot failed" });
  }
};
