import {Link } from "react-router-dom";
import "../../styles/DashBoard/DashBoard.css";
function WelcomeCard() {
  return (
    <div className="welcome-card">

      <div className="Text">
        <h2>Hello there, Welcome back!</h2>
        <p>
          Keep track of shared expenses and settle your 
          balances easily.
        </p>

        <button > <Link to="/groups"className="Groups-btn"> Groups</Link></button>
      </div>

      {/* Image (optional) */}
      <div className="illustration"></div>

    </div>
  );
}

export default WelcomeCard;