import { QRCodeCanvas } from "qrcode.react";
import "./qrmodal.css";

export default function QRCodeModal({ upiId, name, amount, onClose }) {
  const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Splitwise Payment`;

  return (
    <div className="qr-overlay">

      <div className="qr-modal">

        <h3 className="qr-title">Scan & Pay</h3>

        <div className="qr-container">
          <QRCodeCanvas value={link} size={160} />
        </div>

        <div className="qr-info">
          <p className="qr-name">{name}</p>
          <p className="qr-upi">{upiId}</p>
          <p className="qr-amount">₹ {amount}</p>
        </div>
     
        <button className="qr-btn" onClick={onClose}>
          Done
        </button>

      </div>

    </div>
  );
}