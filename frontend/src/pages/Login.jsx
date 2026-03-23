import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../services/api.js";
import Background from "../assets/bgimg.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAPI(username, password);
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role.toLowerCase();

      if (role === "owner") {
        navigate("/owner/overview");
      } else if (role === "treasurer") {
        navigate("/treasurer/overview");
      } else if (role === "tenant") {
        navigate("/tenant/overview");
      } else {
        setError("Unknown user role");
      }
    } catch (err) {
      setError(err.message || "Login failed");
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
          <h2 style={{ fontSize: "28px", color: "var(--primary)" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-muted)" }}>Please enter your details to sign in</p>
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

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--primary)" }}>Username</label>
            <input
              type="text"
              placeholder="e.g. suresh.owner"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "var(--primary)" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div style={{ textAlign: "right", marginBottom: "25px" }}>
            <span
              onClick={() => navigate('/forgot-password')}
              style={{ fontSize: "14px", color: "var(--primary)", fontWeight: "500", cursor: "pointer" }}
            >
              Forgot password?
            </span>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
          Don't have an account? <a href="#" style={{ color: "var(--primary)", fontWeight: "600" }}>Contact Admin</a>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "30px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
        © 2026 House Scheme Management System
      </div>
    </div>
  );
}

export default Login;

