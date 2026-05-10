const express = require('express');
const router = express.Router();
const {
  createExpenses,
  getExpenses,
  getExpenseById,
  getExpensesByCategory,
  getExpensesByExactAmount,
  getExpensesByAmountRange,
  getExpensesByDay,
  getExpensesByDateRange,
  getMonthlyExpenses,
  getExpensesTotal,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Totals FIRST
router.get('/expenses/total', protect, getExpensesTotal);

// CRUD
router.post('/expenses', protect, createExpenses);
router.get('/expenses', protect, getExpenses);
router.get('/expenses/:id', protect, getExpenseById);
router.put('/expenses/:id', protect, updateExpense);
router.delete('/expenses/:id', protect, deleteExpense);

// Filters
router.get('/expenses/filter/category', protect, getExpensesByCategory);
router.get('/expenses/filter/amount-exact', protect, getExpensesByExactAmount);
router.get('/expenses/filter/amount-range', protect, getExpensesByAmountRange);
router.get('/expenses/filter/day', protect, getExpensesByDay);
router.get('/expenses/filter/date-range', protect, getExpensesByDateRange);
router.get('/expenses/filter/monthly', protect, getMonthlyExpenses);


module.exports = router;
