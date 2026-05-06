import { useState } from "react";
import { useAuth } from "../context/authContext";
import { addExpense } from "../service/api";
import { Link } from "react-router-dom";

const AddExpense = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense({ amount, description, category, date });
      setSuccess(true);
      setAmount("");
      setDescription("");
      setCategory("food");
      setDate("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Add Expense</h2>
        <Link to="/get-expenses" className="btn btn-ghost btn-sm">← Back to Expenses</Link>
      </div>

      <div className="card">
        <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
          Welcome, <strong>{user?.username || "Guest"}</strong>! Record a new expense below.
        </p>

        {success && <div className="alert alert-success">✓ Expense added successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            + Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
