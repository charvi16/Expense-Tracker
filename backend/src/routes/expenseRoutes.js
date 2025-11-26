import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { createExpense, getExpenses } from '../controllers/expenseController.js';

const router = express.Router();

router.route('/')
  .post(protect, createExpense)
  .get(protect, getExpenses);

export default router;
