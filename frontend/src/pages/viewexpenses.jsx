import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { logout, deleteExpense, getExpenses } from "../service/api";


const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchExpenses();
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
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="page-wide">
      <div className="page-header">
        <h1>Your Expenses</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/add-expense" className="btn btn-primary btn-sm">+ Add New</Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">⎋ Logout</button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧾</div>
          <p>No expenses found. Start tracking your spending!</p>
          <Link to="/add-expense" className="btn btn-primary">+ Add an Expense</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.description}</td>
                  <td>
                    <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="expense-category">{expense.category}</span>
                  </td>
                  <td>
                    <span className="expense-date">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/expenses/${expense._id}/edit`)}
                      >
                        ✎ Edit
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(expense._id)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewExpenses;
