import { useState } from "react";
import { useAuth } from "../context/authContext";
import { addExpenses } from "../service/Api.js";
import { Link } from "react-router-dom";

const AddExpense = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([
    { amount: "", description: "", category: "food", date: "" },
  ]);
  const [success, setSuccess] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
  };

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      { amount: "", description: "", category: "food", date: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpenses(expenses);
      setSuccess(true);
      setExpenses([{ amount: "", description: "", category: "food", date: "" }]);
    } catch (error) {
      console.error("Error adding multiple expenses:", error);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Add Expense</h2>
        <Link to="/expenses" className="btn btn-ghost btn-sm">
          ← Back to Expenses
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {expenses.map((expense, index) => (
          <div key={index} className="form-row">
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                value={expense.amount}
                onChange={(e) => handleChange(index, "amount", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={expense.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={expense.category}
                onChange={(e) => handleChange(index, "category", e.target.value)}
              >
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={expense.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        <div className="form-row">
          <button
            type="button"
            onClick={handleAddExpense}
            className="btn btn-secondary btn-sm"
          >
            + Add Another
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Submit
          </button>
        </div>
      </form>

      {success && (
        <div className="alert alert-success">
          ✓ Expenses added successfully!
        </div>
      )}
    </div>
  );
};

export default AddExpense;
