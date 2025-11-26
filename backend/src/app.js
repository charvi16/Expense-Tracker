import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
connectDB();

import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import billRoutes from './routes/billRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import profileRoutes from "./routes/profileRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


import { notFound, errorHandler } from './middleware/errorMiddleware.js';


const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));


app.get('/', (req, res) => {
  res.send('FinTrackAI API running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/bills', billRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reports", reportRoutes);   
app.use("/api/calendar", calendarRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
