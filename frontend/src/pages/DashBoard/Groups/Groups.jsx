import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import CreateGroupCard from "./CreateGroupCard";
import GroupsCard from "./GroupsCard.jsx";
import "../../../styles/DashBoard/groups.css";
import { useNavigate } from "react-router-dom";
import api from "../../../services/GobalApi.js"
function Groups() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get(
        "/groups/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGroups(res.data?.data || []);

    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar />

        <h1 className="title">Your Groups</h1>

        <GroupsCard groups={groups} />

        <CreateGroupCard onGroupCreated={fetchGroups} />
      </div>
    </div>
  );
}

export default Groups;