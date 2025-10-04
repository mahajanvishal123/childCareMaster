import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/password/forgot-password`, { email });
      alert(response.data.message || "Password reset link sent to your email!");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-5 shadow-lg"
        style={{
          maxWidth: "600px",
          width: "90%",
          minHeight: "400px"
        }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        <p className="text-center mb-4">
          Enter your registered email to receive a password reset link.
        </p>
        <div className="mb-3">
          <label className="form-label"><strong>Email:</strong></label>
          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="btn btn-info w-100 text-white fw-semibold btn-lg mb-3"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link to="/" className="text-info fw-semibold">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
