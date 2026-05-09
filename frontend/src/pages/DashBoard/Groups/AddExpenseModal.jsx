import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function AddExpenseModal({ group, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState(group.members[0]?._id);
  const [splitBetween, setSplitBetween] = useState([]);
  const [category, setCategory] = useState("Food");

  const token = sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!amount || !description) {
      toast.error("Please fill all fields ⚠️");
      return;
    }

    if (!token) {
      toast.error("User not logged in ❌");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/v1/expense/add",
        {
          amount: Number(amount),
          description,
          category,
          groupId: group._id,
          paidBy: paidBy,
          splitBetween:
            splitBetween.length > 0
              ? splitBetween
              : group.members.map((m) => m._id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess();
      toast.success("Expense added successfully 💰");
      onClose();

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add expense ❌");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="expense-modal">

        <div className="modal-header">
          <h2>Add Expense</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form className="expense-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="₹ Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Dinner, Hotel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
            </select>
          </div>

          <div className="form-group">
            <label>Paid by</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {group.members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Split between</label>

            <div className="split-members">
              {group.members.map((m) => (
                <label key={m._id} className="split-chip">
                  <input
                    type="checkbox"
                    onChange={() => {
                      setSplitBetween((prev) =>
                        prev.includes(m._id)
                          ? prev.filter((id) => id !== m._id)
                          : [...prev, m._id]
                      );
                    }}
                  />
                  {m.username}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              Add Expense
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;