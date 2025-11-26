import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const key = process.env.GROQ_API_KEY;

if (!key) {
  console.warn("⚠️ Warning: GROQ_API_KEY missing. AI Insights disabled.");
}

const groq = new Groq({
  apiKey: key || "dummy-key", // prevents crash
});

export default groq;
