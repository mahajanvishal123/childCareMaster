import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get token from URL query
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, [location]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!token) {
      alert("Invalid or missing token");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/password/reset-password`, {
        token,
        newPassword,
        confirmPassword,
      });

      alert(response.data.message || "Password reset successfully!");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/"); // redirect to login page after success
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 shadow-lg" style={{ maxWidth: "600px", width: "90%" }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        <div className="mb-3">
          <label className="form-label"><strong>New Password:</strong></label>
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label"><strong>Confirm Password:</strong></label>
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="btn btn-info w-100 text-white fw-semibold btn-lg"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
