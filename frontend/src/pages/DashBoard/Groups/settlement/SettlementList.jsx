import SettlementCard from "./SettlementCard";
import "./settlement.css";

export default function SettlementList({ settlements,onSettle }) {
  const owes = settlements.filter(s => s.type === "owe");
  const owed = settlements.filter(s => s.type === "owed");

  return (
    <div>

      {/* You Owe */}
      <div className="settlement-section">
        <h3 className="settlement-title owe">You Owe</h3>
        {owes.map((s, i) => (
        <SettlementCard key={i} {...s} onSettle={onSettle} />
        ))}
      </div>

      {/* You Are Owed */}
      <div className="settlement-section">
        <h3 className="settlement-title owed">You Are Owed</h3>
        {owed.map((s, i) => (
          <SettlementCard key={i} {...s} />
        ))}
      </div>

    </div>
  );
}
