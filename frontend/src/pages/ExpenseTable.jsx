import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExpenseTable = ({ expenses, onDelete }) => {
  const navigate = useNavigate();
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const downloadAsCSV = () => {
    const headers = ["Description", "Amount", "Category", "Date"];
    const rows = expenses.map((expense) => [
      expense.description,
      expense.amount.toFixed(2),
      expense.category,
      new Date(expense.date).toLocaleDateString(),
    ]);
    rows.push(["Total", totalAmount.toFixed(2), "", ""]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  const downloadAsJSON = () => {
    const data = {
      expenses: expenses.map((expense) => ({
        description: expense.description,
        amount: parseFloat(expense.amount.toFixed(2)),
        category: expense.category,
        date: new Date(expense.date).toLocaleDateString(),
      })),
      summary: {
        totalExpenses: expenses.length,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        generatedAt: new Date().toISOString(),
      },
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  const downloadAsExcel = () => {
    // Create a simple HTML table that Excel can read
    const htmlContent = `
      <table border="1">
        <thead>
          <tr style="background-color: #f0a500; color: white;">
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (expense) => `
            <tr>
              <td>${expense.description}</td>
              <td>₹${expense.amount.toFixed(2)}</td>
              <td>${expense.category}</td>
              <td>${new Date(expense.date).toLocaleDateString()}</td>
            </tr>
          `
            )
            .join("")}
          <tr style="background-color: #f0a500; font-weight: bold;">
            <td>Total</td>
            <td>₹${totalAmount.toFixed(2)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

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
      <div className="table-header">
        <div className="download-section">
          <div className="download-dropdown">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            >
              ⬇ Download
            </button>
            {showDownloadMenu && (
              <div className="download-menu">
                <button className="download-option" onClick={downloadAsCSV}>
                  📄 CSV Format
                </button>
                <button className="download-option" onClick={downloadAsJSON}>
                  📋 JSON Format
                </button>
                <button className="download-option" onClick={downloadAsExcel}>
                  📊 Excel Format
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
                <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
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
              <span className="expense-amount">₹{totalAmount.toFixed(2)}</span>
            </td>
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ExpenseTable;
