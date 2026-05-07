const Expense = require('../models/expense');
const asyncHandler = require('express-async-handler');

// Create a new expense
exports.createExpenses = asyncHandler(async (req, res) => {
  const expensesData = req.body.expenses;
  if (!Array.isArray(expensesData) || expensesData.length === 0) {
    return res.status(400).json({ message: 'Expenses must be a non-empty array' });
  }

  const expensesToCreate = expensesData.map(expense => ({
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date,
    user: req.user._id,
  }));

  const createdExpenses = await Expense.insertMany(expensesToCreate);
  res.status(201).json(createdExpenses);
});

// Get all expenses for the authenticated user
exports.getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id });
  res.status(200).json(expenses);
});

// Get a single expense by ID
exports.getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findOne({ _id: id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  res.status(200).json(expense);
});

// Update an expense
exports.updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;

  const updates = {};
  if (amount !== undefined) updates.amount = amount;
  if (description !== undefined) updates.description = description;
  if (category !== undefined) updates.category = category;
  if (date !== undefined) updates.date = date;

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, user: req.user._id },
    updates,
    { new: true }
  );

  if (!updatedExpense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  res.status(200).json(updatedExpense);
});

// Delete an expense
exports.deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedExpense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

  if (!deletedExpense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  res.status(200).json({ message: 'Expense deleted successfully' });
});
