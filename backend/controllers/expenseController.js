const mongoose = require('mongoose');
const Expense = require('../models/expense');
const asyncHandler = require('express-async-handler');

// Create multiple expenses
exports.createExpenses = asyncHandler(async (req, res) => {
  const expensesData = req.body.expenses;
  if (!Array.isArray(expensesData) || expensesData.length === 0) {
    return res.status(400).json({ message: 'Expenses must be a non-empty array' });
  }

  const expensesToCreate = expensesData.map(expense => {
    if (!expense.amount || expense.amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (!expense.date || isNaN(new Date(expense.date))) {
      throw new Error('Invalid date');
    }
    return {
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      date: expense.date,
      user: req.user._id,
    };
  });

  const createdExpenses = await Expense.insertMany(expensesToCreate);
  res.status(201).json(createdExpenses);
});

// Get all expenses
exports.getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id });
  res.status(200).json(expenses);
});

// Get expense by ID
exports.getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid expense ID' });
  }
  const expense = await Expense.findOne({ _id: id, user: req.user._id });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.status(200).json(expense);
});

// Category filter
exports.getExpensesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ message: 'Category is required' });
  const expenses = await Expense.find({ user: req.user._id, category });
  res.status(200).json(expenses);
});

// Amount exact filter
exports.getExpensesByExactAmount = asyncHandler(async (req, res) => {
  const { amount } = req.query;
  if (!amount) return res.status(400).json({ message: 'Amount is required' });
  const expenses = await Expense.find({ user: req.user._id, amount: parseFloat(amount) });
  res.status(200).json(expenses);
});

// Amount range filter
exports.getExpensesByAmountRange = asyncHandler(async (req, res) => {
  const { minAmount, maxAmount } = req.query;
  if (minAmount === undefined || maxAmount === undefined) {
    return res.status(400).json({ message: 'Min and max amount are required' });
  }
  const expenses = await Expense.find({
    user: req.user._id,
    amount: { $gte: parseFloat(minAmount), $lte: parseFloat(maxAmount) },
  });
  res.status(200).json(expenses);
});

// Date exact filter
exports.getExpensesByDay = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required' });
  const start = new Date(date);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const expenses = await Expense.find({ user: req.user._id, date: { $gte: start, $lte: end } });
  res.status(200).json(expenses);
});

// Date range filter
exports.getExpensesByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start and end date are required' });
  }
  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });
  res.status(200).json(expenses);
});

// Monthly filter
exports.getMonthlyExpenses = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) return res.status(400).json({ message: 'Month and year are required' });
  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0) },
  });
  res.status(200).json(expenses);
});

// Totals
exports.getExpensesTotal = asyncHandler(async (req, res) => {
  const total = await Expense.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
  ]);
  res.status(200).json({ totalAmount: total[0] ? total[0].totalAmount : 0 });
});

// Update expense
exports.updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid expense ID' });
  const { amount, description, category, date } = req.body;
  const updates = {};
  if (amount !== undefined) updates.amount = amount;
  if (description !== undefined) updates.description = description;
  if (category !== undefined) updates.category = category;
  if (date !== undefined) updates.date = date;
  const updatedExpense = await Expense.findOneAndUpdate({ _id: id, user: req.user._id }, updates, { new: true });
  if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });
  res.status(200).json(updatedExpense);
});

// Delete expense
exports.deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid expense ID' });
  const deletedExpense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });
  if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });
  res.status(200).json({ message: 'Expense deleted successfully' });
});
