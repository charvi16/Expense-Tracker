import dotenv from 'dotenv';
dotenv.config();

console.log("LOADED GROQ KEY =", process.env.GROQ_API_KEY);


import http from 'http';
import app from './app.js';
import "../src/cron/subscriptionCron.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
