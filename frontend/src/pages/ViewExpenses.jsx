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
  getMonthlyExpenses,
  getExpensesTotal,
} from "../service/Api.js";
import ExpenseTable from "../components/ExpenseTable.jsx";
import FilterBar from "../components/Filterbar.jsx";
import ExpensePieChart from "../components/ExpensePieChart.jsx";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [lifetimeTotal, setLifetimeTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [showTotalType, setShowTotalType] = useState("lifetime");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchExpenses();
      fetchLifetimeTotal();
      fetchMonthlyTotal();
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
      setLifetimeTotal(data.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  const fetchMonthlyTotal = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const data = await getMonthlyExpenses(month, year);
      setMonthlyExpenses(data);
      const total = Array.isArray(data)
        ? data.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
        : 0;
      setMonthlyTotal(total);
    } catch (error) {
      console.error("Error fetching monthly total:", error);
      setMonthlyTotal(0);
      setMonthlyExpenses([]);
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
      fetchMonthlyTotal();
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
          <Link to="/profile" className="btn btn-secondary btn-sm">
            ← Back to Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">⎋ Logout</button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar onFilter={handleFilter} />

      {/* Table */}
      <ExpenseTable expenses={expenses} onDelete={handleDelete} />

      {/* Totals Toggle Section */}
      <div className="totals-section">
        <div className="totals-header">
          <div className="totals-toggle-group">
            <button
              className={`totals-toggle ${showTotalType === "monthly" ? "active" : ""}`}
              onClick={() => setShowTotalType("monthly")}
            >
              📅 Monthly
            </button>
            <button
              className={`totals-toggle ${showTotalType === "lifetime" ? "active" : ""}`}
              onClick={() => setShowTotalType("lifetime")}
            >
              📊 Lifetime
            </button>
          </div>
        </div>
        <div className="totals-content">
          <div className="totals-display">
            {showTotalType === "monthly" ? (
              <div className="total-card">
                <div className="total-label">Monthly Total</div>
              <div className="total-amount">₹{monthlyTotal.toFixed(2)}</div>
                <div className="total-period">Current Month</div>
              </div>
            ) : (
              <div className="total-card">
                <div className="total-label">Lifetime Total</div>
              <div className="total-amount">₹{lifetimeTotal.toFixed(2)}</div>
                <div className="total-period">All Time</div>
              </div>
            )}
          </div>

          <div className="pie-chart-wrapper">
            <div className="pie-chart-header">
              <h3>
                {showTotalType === "monthly" ? "Monthly Breakdown by Category" : "Lifetime Breakdown by Category"}
              </h3>
            </div>
            <ExpensePieChart 
              expenses={showTotalType === "monthly" ? monthlyExpenses : expenses} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpenses;
