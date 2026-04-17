import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
      if (!userId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      await resetPassword({ userId, newPassword });
      alert("Password reset successful. Please log in with your new password.");
      navigate("/login");
    } catch {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;