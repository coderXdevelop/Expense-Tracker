import React from "react";
import { useNavigate } from "react-router-dom";

const ExpenseTable = ({ expenses, onDelete }) => {
  const navigate = useNavigate();
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🧾</div>
        <p>No expenses found. Start tracking your spending!</p>
      </div>
    );
  }

  return (
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
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/expenses/${expense._id}/edit`)}
                >
                  ✎ Edit
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(expense._id)}
                >
                  ✕ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="total-row">
            <td><strong>Total</strong></td>
            <td>
              <span className="expense-amount">${totalAmount.toFixed(2)}</span>
            </td>
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ExpenseTable;
