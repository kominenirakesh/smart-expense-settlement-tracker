import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./GroupDetails.css";
import AddExpenseModal from "./AddExpenseModal.jsx";
import SettlementList from "./settlement/SettlementList.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.jsx";
import Chart from "./charts/Chart.jsx";
import api from "../../../services/GobalApi.js";

function GroupDetails() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  // ===================== INITIAL LOAD =====================
  useEffect(() => {
    if (!id) return;

    fetchGroup();
    fetchExpenses();
    fetchBalances(); // 🔥 SINGLE SOURCE OF TRUTH

  }, [id]);

  // ===================== FETCH GROUP =====================
  const fetchGroup = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await api.get(
        `/groups/get/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGroup(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===================== FETCH EXPENSES =====================
  const fetchExpenses = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await api.get(
        `/expense/group/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExpenses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===================== FETCH BALANCES (MAIN API) =====================
const fetchBalances = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await api.get(
      `/expense/balance/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBalances(res.data.balances);
    setTransactions(res.data.transactions);

    // ✅ WAIT for backend to finish writing
    await fetchSettlements();

  } catch (err) {
    console.log(err);
  }
};

  // ===================== FETCH SETTLEMENTS =====================
  const fetchSettlements = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await api.get(
        `/groups/settlements/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
       console.log( res.data);
      setSettlements(Array.isArray(res.data.data) ? res.data.data : []);

    } catch (err) {
      console.error("Error fetching settlements", err);
    }
  };


  // ===================== DERIVED VALUES =====================
  const { youOwe, youAreOwed } = useMemo(() => {
    let owe = 0;
    let owed = 0;

    Object.entries(balances || {}).forEach(([userId, amount]) => {
      if (userId === currentUser?._id) {
        if (amount < 0) owe = Math.abs(amount);
        else owed = amount;
      }
    });

    return { youOwe: owe, youAreOwed: owed };
  }, [balances, currentUser]);

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // ===================== FORMAT SETTLEMENTS =====================
const pendingSettlements = settlements.filter(
  (s) => s.status === "pending"
);

const formattedSettlements = pendingSettlements.map((t) => {
  if (!t.from || !t.to) return null;

  if (t.from._id === currentUser._id) {
    return {
      id: t._id,
      type: "owe",
      person: t.to.username,
      upiId: t.to.upiId,
      amount: t.amount
    };
  } 
  else if (t.to._id === currentUser._id) {
    return {
      id: t._id,
      type: "owed",
      person: t.from.username,
      upiId: t.from.upiId,
      amount: t.amount
    };
  } 

  return null;
}).filter(Boolean);

  // ===================== MARK AS PAID =====================
  const handleRemoveSettlement = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      
       // ⚡ Instant UI feel (optional but nice)
       setSettlements(prev => prev.filter(s => s._id !== id));

      await api.patch(
        `/groups/settlement/pay/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

       toast.success("Payment successful 💸");

      // 🔥 ONLY ONE CALL NEEDED
      await fetchBalances();

    } catch (err) {
      console.error("Error marking as paid", err);
      // ❌ ERROR TOAST
       toast.error("Payment failed ❌");
    }
  };

  const handleUpdateGroup = async () => {
  try {
    const token = sessionStorage.getItem("token");

    await api.put(
      `/groups/update/${group._id}`,
      {
        name: editName,
        members: editMembers.map(m => m._id),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Group updated");

    setShowEditModal(false);
    fetchGroup(); // refresh UI

  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
};

const handleSearch = async (query) => {
  setSearchQuery(query);
 
  if (!query) {
    setSearchResults([]);
    return;
  }

  try {
    const token = sessionStorage.getItem("token");

    const res = await api.get(
      `/users/search?query=${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    setSearchResults(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMembers, setEditMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState([]);
  if (!group) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="group-details">

          {/* HEADER */}
          
          <div className="gd-header">
            <div>
              <h2>{group.name}</h2>
              <p>Created by {group.CreatedBy?.username}</p>
   
              <div className="gd-members">
                {group.members?.slice(0, 4).map((member) => {
                  const isYou = member._id === currentUser?._id;

                  return (
                    <span
                      key={member._id}
                      className={`member-chip ${isYou ? "you" : ""}`}
                    >
                      {isYou ? "You" : member.username}
                    </span>
                  );
                })}

                   
                  <button className="add-expense-btn"  onClick={() => {
                  setEditName(group.name);
                  setEditMembers(group.members);
                  setShowEditModal(true);
                }}>
                  ✏️ Edit Group
                </button>    

              </div>
            </div>

            <button
              className="add-expense-btn"
              onClick={() => setShowModal(true)}
            >
              + Add Expense
            </button>
            
          </div>
     


          {/* STATS */}
          <div className="gd-stats">
            <div className="stat-card blue">
              <p>Total expense</p>
              <h3>₹ {totalExpense}</h3>
            </div>

            <div className="stat-card green">
              <p>You are owed</p>
              <h3>₹ {formatCurrency(youAreOwed)}</h3>
            </div>

            <div className="stat-card red">
              <p>You owe</p>
              <h3>₹ {formatCurrency(youOwe)}</h3>
            </div>
          </div>

          {/* SETTLEMENTS */}
          <div className="gd-settlements">
            <div className="gd-settlements-header">
              <h3>Settlements</h3>
            </div>

            {formattedSettlements.length === 0 ? (
              <div className="settled-empty">
                <div className="emoji">🎉</div>
                <p>All settled!</p>
                <span>No pending payments in this group</span>
              </div>
            ) : (
              <SettlementList
                settlements={formattedSettlements}
                onSettle={handleRemoveSettlement}
              />
            )}
          </div>

          {/* EXPENSES */}
          <div className="gd-content">
           <div className="expenses">
              <h3>Group Expenses</h3>

              <div className="expense-scroll">
                {expenses.map((exp) => (
                  <div className="expense-card" key={exp._id}>
                    <div className="date">
                      {new Date(exp.createdAt).toDateString().slice(4, 10)}
                    </div>

                    <div className="details">
                      <h4>{exp.description}</h4>
                      <p>Total: ₹{exp.amount}</p>
                      <p>Paid by: {exp.PaidBy?.username}</p>
                    </div>

                    <div className="per-person">
                      ₹
                      {exp.splitBetween?.length
                        ? Math.floor(exp.amount / exp.splitBetween.length)
                        : exp.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Chart expenses={expenses} />
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <AddExpenseModal
            group={group}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              fetchExpenses();
              fetchBalances(); // 🔥 ONLY THIS NEEDED
            }}
          />
        )}
      {showEditModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Group</h3>

            {/* GROUP NAME */}
            <input
              className="input-field"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Group name"
            />

            {/* 🔍 SEARCH USERS */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* DROPDOWN */}
              {searchResults && searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="search-item"
                      onClick={() => {
                        // prevent self + duplicates
                        if (
                          user._id === currentUser._id ||
                          editMembers.find((m) => m._id === user._id)
                        ) return;

                        setEditMembers([...editMembers, user]);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <strong>{user.username}</strong>
                      <p>{user.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 👥 MEMBERS */}
            <div className="member-list">
              {editMembers.map((m) => (
                <div key={m._id} className="member-item">
                  <span>{m.username}</span>

                  <button
                    onClick={() =>
                      setEditMembers(
                        editMembers.filter((x) => x._id !== m._id)
                      )
                    }
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="modal-actions">
              <button className="confirm" onClick={handleUpdateGroup}>
                Save
              </button>

              <button
                className="cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      </div>
    </div>
  );
}

export default GroupDetails;