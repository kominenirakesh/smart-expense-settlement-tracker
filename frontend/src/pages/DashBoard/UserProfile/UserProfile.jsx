import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import ProfileCard from "./ProfileCard";
import "./userProfile.css";

function UserProfile() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">
        <Topbar />

        <h1 className="title">User Profile</h1>

        <ProfileCard />
      </div>

    </div>
  );
}

export default UserProfile;