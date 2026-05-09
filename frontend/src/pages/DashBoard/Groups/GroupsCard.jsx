import "./groups.css";
import { useNavigate } from "react-router-dom";

function GroupsCard({ groups }) {
  const navigate = useNavigate();

  return (
    <div className="groups-container">
      {groups && groups.length > 0 ? (
        groups.map((group) => (
          <div key={group._id} className="group-card">

            {/* HEADER */}
            <div className="group-header">
              <h2>{group.name}</h2>
            </div>

            {/* BODY */}
            <div
              className="group-body"
              onClick={() => navigate(`/group/${group._id}`)}
            >

              {/* STATUS */}
              <div className="status">
                {group.balance === 0 ? (
                  <span className="settled">Settled</span>
                ) : group.balance > 0 ? (
                  <span className="owed">
                    You are owed ₹{Math.abs(group.balance).toFixed(2)}
                  </span>
                ) : (
                  <span className="owe">
                    You owe ₹{Math.abs(group.balance).toFixed(2)}
                  </span>
                )}
              </div>

              {/* BOTTOM */}
              <div className="bottom">
                <div className="category">Expenses</div>

                <div className="avatars">
                  {group.members?.slice(0, 2).map((m) => (
                    <div key={m._id} className="avatar">
                      {m.username[0].toUpperCase()}
                    </div>
                  ))}

                  {group.members?.length > 2 && (
                    <div className="avatar extra">
                      +{group.members.length - 2}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))
      ) : (
        <p style={{ padding: "20px" }}>No groups found</p>
      )}
    </div>
  );
}

export default GroupsCard;