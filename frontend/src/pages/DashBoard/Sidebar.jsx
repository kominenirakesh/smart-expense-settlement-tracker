import {Link} from "react-router-dom";
import "../../styles/DashBoard/DashBoard.css"

function Sidebar() {
  const user = JSON.parse(sessionStorage.getItem("user"));
      
  return (
    
    <div className="sidebar">

      {/* Logo */}
         
         <div className="logo-section">
        <img src="/coin.svg" alt="SmartSplit Logo" />
      </div>

      {/* Profile */
       
      }
     
      <Link to = "/userprofile" className="Groups-btn">
      <div className="profile">
        
        <div className="avatar"></div>
        <div>
          <h4>{user.username}</h4>
        </div>
      </div>
      </Link>

      {/* Menu */}
         <ul className="menu">
        <li className="active"><Link to ="/dashboard "className="Groups-btn">DashBoard</Link></li>
        <li className="active"><Link to="/groups"className="Groups-btn">Groups</Link></li>
        <li className="active"><Link to="/creategroup"className="Groups-btn">Create Group</Link></li>
        <li>About</li>
      </ul>

    </div>
  );
}

export default Sidebar;