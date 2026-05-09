import "../../styles/Homepage/navbar.css";
import {Link} from "react-router-dom"
import { HashLink } from 'react-router-hash-link';

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo-section">
        <img src="/logo.svg" alt="SmartSplit Logo" />
        <span>SmartSplit</span>
      </div>

      <div className="nav-links">
        <HashLink smooth to="#Features" className="Login-btn">Features</HashLink>
        <Link to = "/login">Login</Link>
<Link to="/register"> <button className="get-started">Get Started</button></Link>
      </div>

    </nav>
  );
}

export default Navbar;



