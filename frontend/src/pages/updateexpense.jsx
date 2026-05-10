import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import { getExpenseById, updateExpense } from "../service/Api";
import { useParams, Link } from "react-router-dom";

const UpdateExpense = () => {
  const { id: expenseId } = useParams();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const expense = await getExpenseById(expenseId, user.token);
        console.log("Fetched expense:", expense);
        setAmount(expense.amount);
        setDescription(expense.description);
        setCategory(expense.category);
        setDate(expense.date ? expense.date.split("T")[0] : "");
      } catch (error) {
        console.error("Error fetching expense:", error);
      }
    };

    if (user?.token) {
      fetchExpense();
    }
  }, [user, expenseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(user.token, expenseId, { amount, description, category, date });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Update Expense</h2>
        {/* FIXED: route now points to /expenses */}
        <Link to="/expenses" className="btn btn-ghost btn-sm">← Back to Expenses</Link>
      </div>

      <div className="card">
        {success && <div className="alert alert-success">✓ Expense updated successfully!</div>}

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
              placeholder="Enter description"
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
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;
