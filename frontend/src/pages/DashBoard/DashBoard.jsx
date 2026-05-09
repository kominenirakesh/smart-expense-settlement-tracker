import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import WelcomeCard from "./WelcomeCard";
import EmptyState from "./EmptyState";
import "../../styles/DashBoard/DashBoard.css";
function DashBoard()
{
  return (
    <div className="dashboard">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="main">
        <Topbar />
        <WelcomeCard />
        <EmptyState />
      </div>

    </div>
  );
}
export default DashBoard;


