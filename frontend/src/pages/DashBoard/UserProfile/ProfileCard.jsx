import { useState, useEffect } from "react";
import "./userProfile.css";

function ProfileCard() {

  // ✅ SAFE user fetch
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const userInfo = JSON.parse(storedUser);

    const Fullname = userInfo?.username?.split(" ") || [];

    setUser({
      firstName: Fullname[0] || "",
      lastName: Fullname[1] || "",
      email: userInfo?.email || "",
    });

  }, []);

  // ✅ DELETE ACCOUNT
  const handleDelete = async () => {
    try {
      await fetch("http://localhost:4000/api/v1/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      sessionStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="profile-container">

      {/* LEFT IMAGE */}
      <div className="profile-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile"
        />
      </div>

      {/* RIGHT DETAILS */}
      <div className="profile-right">

        <div className="row">
          <div className="input-box">
            <label>First Name</label>
            <input type="text" value={user.firstName} readOnly />
          </div>

          <div className="input-box">
            <label>Last Name</label>
            <input type="text" value={user.lastName} readOnly />
          </div>
        </div>

        <div className="input-box full">
          <label>Email Address</label>
          <input type="text" value={user.email} readOnly />
        </div>

        {/* BUTTONS */}
        <div className="actions">
          <button className="delete" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </button>

          <button className="logout" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>

        {/* LOGOUT MODAL */}
        {showLogoutModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              className="modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>

              <div className="modal-actions">
                <button className="confirm" onClick={handleLogout}>
                  Yes, Logout
                </button>

                <button
                  className="cancel"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: "#dc2626" }}>Delete Account</h3>
              <p>This action is permanent. Are you sure?</p>

              <div className="modal-actions">
                <button className="delete-confirm" onClick={handleDelete}>
                  Yes, Delete
                </button>

                <button
                  className="cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfileCard;