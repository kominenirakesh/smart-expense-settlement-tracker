import "./settlement.css";
import {formatCurrency} from "../../../../utils/formatCurrency.jsx";
import { useState } from "react";
import QRCodeModal from "./QRCodeModal.jsx";
export default function SettlementCard({ id, type, person, amount, upiId, onSettle }) {
  
const [showQR, setShowQR] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

const handleSettle = () => {
  setShowConfirm(true);
};

const handlePay = () => {
  const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(person)}&am=${amount}&cu=INR&tn=Splitwise Payment`;

  // Try opening UPI
  window.location.href = link;

  // Fallback to QR after delay
  setTimeout(() => {
    setShowQR(true);
  }, 800);
};
        
  return (
<div className={`settlement-card ${type}`}>
  
  <div className="settlement-row">
    <div>
      <p className="settlement-label">
        {type === "owe" ? "You owe" : "Owes you"}
      </p>
      <p className="settlement-name">{person}</p>
    </div>

    <div className="right-section">
      <span className="settlement-amount">
        ₹{formatCurrency(amount)}
      </span>

        {type === "owe" && (
          <div className="action-buttons">
            <button className="pay-btn" onClick={handlePay}>
              Pay
            </button>

            <button className="settle-btn" onClick={handleSettle}>
              Mark Paid
            </button>
          </div>
        )}
    </div>
  </div>

  {showQR && (
    <QRCodeModal
      upiId={upiId}
      name={person}
      amount={amount}
      onClose={() => setShowQR(false)}
    />
  )}
  {showConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-box">
      <h3>Confirm Payment</h3>
      <p>
        Mark <b>₹{formatCurrency(amount)}</b> paid to <b>{person}</b>?
      </p>

      <div className="confirm-actions">
        <button
          className="confirm-btn"
          onClick={() => {
            onSettle(id);
            setShowConfirm(false);
          }}
        >
          Yes, Mark Paid
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

</div>
  );
}