import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Auth
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  // If backend returns a token, store it
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const register = async (username, email, password) => {
  const res = await API.post("/auth/register", { username, email, password });
  // If backend returns a token, store it
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem("token"); // clear token
  await API.post("/auth/logout");
};

// User profile
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/users/profile", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const res = await API.put("/users/profile", profileData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

// Expenses
export const getExpenses = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/expenses", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const updateExpense = async (token, id, expenseData) => {
  const res = await API.put(`/expenses/${id}`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getExpenseById = async (id, token) => {
  const res = await API.get(`/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};



export const addExpense = async (expense) => {
  const token = localStorage.getItem("token");
  const res = await API.post("/expenses", expense, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};

export const deleteExpense = async (id) => {
  const token = localStorage.getItem("token");
  await API.delete(`/expenses/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
