import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./createNewGroup.css";
import Groups from "../Groups/Groups";
import api from "../../../services/GobalApi";

function CreateNewGroup() {
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  // Add member
  const addMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput]);
      setMemberInput("");
    }
  };

  // Remove member
  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // Submit group to backend
const handleSubmit = async () => {
  const data = {
    name: groupName,
    members: members, // emails
  };

  try {
    const token = sessionStorage.getItem("token");

    const res = await api.post(
      "/groups/create",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);

    // 🔥 SUCCESS → REDIRECT
    navigate("/Groups");

  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};



  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Topbar />
        <h1 className="title">Create New Group</h1>

        <div className="form-container">
          {/* GROUP NAME */}
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          {/* MEMBERS */}
          <div className="members-box">
            <label>Group Members</label>
            <div className="member-input">
              <input
                type="text"
                placeholder="Enter member email"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
              />
              <button onClick={addMember}>Add</button>
            </div>

            {/* MEMBERS LIST */}
            <div className="members-list">
              {members.map((m, i) => (
                <div key={i} className="member-chip">
                  {m}
                  <span onClick={() => removeMember(i)}>×</span>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button className="submit-btn" onClick={handleSubmit}>
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewGroup;
