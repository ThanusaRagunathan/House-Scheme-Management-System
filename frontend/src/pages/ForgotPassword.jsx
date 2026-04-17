import { useNavigate } from "react-router-dom";
import Background from "../assets/bgimg.jpg";

function ForgotPassword() {
  const navigate = useNavigate();

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
          maxWidth: "450px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          textAlign: "center"
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <div style={{ 
            fontSize: "50px", 
            marginBottom: "20px",
            color: "var(--primary)" 
          }}>
            <i className="fas fa-user-shield"></i>
          </div>
          <h2 style={{ fontSize: "28px", color: "var(--primary)", marginBottom: "15px" }}>Forgot Password?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.6" }}>
            For security reasons, password resets are handled by the system administrator.
          </p>
        </div>

        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "25px", 
          borderRadius: "15px",
          marginBottom: "30px",
          border: "1px solid #eee"
        }}>
          <p style={{ fontWeight: "600", color: "var(--primary)", marginBottom: "10px" }}>
            Please contact the Admin
          </p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Visit the main office or contact your supervisor to initiate a password reset request.
          </p>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="btn-primary"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Back to Login
        </button>
      </div>

      <div style={{ position: "absolute", bottom: "30px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
        © 2026 House Scheme Management System
      </div>
    </div>
  );
}

export default ForgotPassword;

