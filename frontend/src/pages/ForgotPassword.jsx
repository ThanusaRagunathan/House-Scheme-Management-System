import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/api.js";
import Background from "../assets/bgimg.jpg";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await forgotPassword(phone);
      // Backend might return the OTP for testing purposes
      setMessage(`OTP sent successfully! ${data.otp ? `(Demo OTP: ${data.otp})` : ""}`);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please ensure this number is registered.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await resetPassword(phone, otp, newPassword);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please check your OTP and password format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Outfit', sans-serif",
      }}
    >

      <div className="glass-card"
        style={{
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.9)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", color: "var(--primary)" }}>Reset Password</h2>
          <p style={{ color: "var(--text-muted)" }}>
            {step === 1 ? "Enter your registered phone number" : "Enter OTP and your new password"}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#ffe3e3",
            color: "#d63031",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #fab1a0"
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #c3e6cb"
          }}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--primary)" }}>Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 0771112233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "16px",
                  transition: "var(--transition)"
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                opacity: loading ? 0.7 : 1,
                borderRadius: "10px"
              }}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--primary)" }}>OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "16px",
                  transition: "var(--transition)"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--primary)" }}>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "16px",
                  transition: "var(--transition)"
                }}
                required
              />
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                Must be at least 8 chars, with uppercase, lowercase, numbers & symbols.
              </p>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--primary)" }}>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "16px",
                  transition: "var(--transition)"
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                opacity: loading ? 0.7 : 1,
                borderRadius: "10px"
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "30px", textAlign: "center", fontSize: "14px" }}>
          <span
            onClick={() => navigate('/login')}
            style={{ color: "var(--primary)", fontWeight: "600", cursor: "pointer" }}
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
