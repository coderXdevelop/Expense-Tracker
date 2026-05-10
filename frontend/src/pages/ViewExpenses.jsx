import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import {
  logout,
  deleteExpense,
  getExpenses,
  getExpensesByCategory,
  getExpensesByDateRange,
  getExpensesByDay,
  getExpensesByAmountRange,
  getExpensesByExactAmount,
  getExpensesTotal,
} from "../service/Api.js";
import ExpenseTable from "./ExpenseTable.jsx";
import FilterBar from "./Filterbar.jsx";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [lifetimeTotal, setLifetimeTotal] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchExpenses();
      fetchLifetimeTotal();
    }
  }, [user, navigate]);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchLifetimeTotal = async () => {
    try {
      const data = await getExpensesTotal();
      setLifetimeTotal(data.totalAmount);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  const handleFilter = async ({ category, exactAmount, minAmount, maxAmount, day, startDate, endDate }) => {
    try {
      if (category) {
        setExpenses(await getExpensesByCategory(category));
      } else if (exactAmount) {
        setExpenses(await getExpensesByExactAmount(exactAmount));
      } else if (minAmount && maxAmount) {
        setExpenses(await getExpensesByAmountRange(minAmount, maxAmount));
      } else if (day) {
        setExpenses(await getExpensesByDay(day));
      } else if (startDate && endDate) {
        setExpenses(await getExpensesByDateRange(startDate, endDate));
      } else {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
      fetchLifetimeTotal();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="page-wide">
      <div className="page-header">
        <h1>Your Expenses</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link to="/expenses/add" className="btn btn-primary btn-sm">+ Add New</Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">⎋ Logout</button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar onFilter={handleFilter} />

      {/* Table */}
      <ExpenseTable expenses={expenses} onDelete={handleDelete} />

      {/* Totals */}
      <div className="totals-bar">
        <p><strong>Lifetime Total:</strong> ${lifetimeTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ViewExpenses;
