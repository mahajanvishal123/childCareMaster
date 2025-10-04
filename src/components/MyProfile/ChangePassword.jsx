import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not found. Please login again.");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/auth/update-password/${userId}`,
        { oldPassword, newPassword }
      );

      alert(response.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <h2>Change Password</h2>
      <div className="row">
        <div className="col-12">
          <div className="card p-3 shadow-sm">
            <div className="mb-2">
              <label><strong>Old Password:</strong></label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
              />
            </div>
            <div className="mb-2">
              <label><strong>New Password:</strong></label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="mb-2">
              <label><strong>Confirm New Password:</strong></label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <button
              className="btn mt-2 w-100" style={{ backgroundColor: "#2ab7a9", color: "white" }}
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
