import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// Helper: attach token
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------- AUTH ----------------
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  if (res.data.token) localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (username, email, password) => {
  const res = await API.post("/auth/register", { username, email, password });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await API.post("/auth/verify-otp", { email, otp });
  if (res.data.token) localStorage.setItem("token", res.data.token);
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  await API.post("/auth/logout");
};

// ---------------- USER PROFILE ----------------
export const getUserProfile = async () => {
  const res = await API.get("/users/profile", { headers: authHeader() });
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await API.put("/users/profile", profileData, { headers: authHeader() });
  return res.data;
};

// ---------------- EXPENSES ----------------
// Create multiple expenses
export const addExpenses = async (expensesArray) => {
  const res = await API.post(
    "/expenses",
    { expenses: expensesArray }, // backend expects { expenses: [...] }
    { headers: authHeader() }
  );
  return res.data;
};

// Get all expenses
export const getExpenses = async () => {
  const res = await API.get("/expenses", { headers: authHeader() });
  return res.data;
};

// Get single expense by ID
export const getExpenseById = async (id) => {
  const res = await API.get(`/expenses/${id}`, { headers: authHeader() });
  return res.data;
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  const res = await API.put(`/expenses/${id}`, expenseData, { headers: authHeader() });
  return res.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  await API.delete(`/expenses/${id}`, { headers: authHeader() });
};

// ---------------- FILTERS & REPORTS ----------------
// Category filter
export const getExpensesByCategory = async (category) => {
  const res = await API.get(`/expenses/filter/category?category=${category}`, { headers: authHeader() });
  return res.data;
};

// Amount filters
export const getExpensesByExactAmount = async (amount) => {
  const res = await API.get(`/expenses/filter/amount-exact?amount=${amount}`, { headers: authHeader() });
  return res.data;
};

export const getExpensesByAmountRange = async (minAmount, maxAmount) => {
  const res = await API.get(`/expenses/filter/amount-range?minAmount=${minAmount}&maxAmount=${maxAmount}`, { headers: authHeader() });
  return res.data;
};

// Date filters
export const getExpensesByDay = async (date) => {
  const res = await API.get(`/expenses/filter/day?date=${date}`, { headers: authHeader() });
  return res.data;
};

export const getExpensesByDateRange = async (startDate, endDate) => {
  const res = await API.get(`/expenses/filter/date-range?startDate=${startDate}&endDate=${endDate}`, { headers: authHeader() });
  return res.data;
};

// Monthly filter
export const getMonthlyExpenses = async (month, year) => {
  const res = await API.get(`/expenses/filter/monthly?month=${month}&year=${year}`, { headers: authHeader() });
  return res.data;
};

// Totals
export const getExpensesTotal = async () => {
  const res = await API.get("/expenses/total", { headers: authHeader() });
  return res.data;
};
