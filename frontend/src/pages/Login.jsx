import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../assets/bgimg.jpg";

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 15px 0",
  borderRadius: "6px",
  border: "1px solid black",
};

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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      // Redirect to owner overview
      navigate("/owner/overview");
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        
      }}
    >
      <header style={{ padding: "70px", backgroundColor: "#0b3d02" }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "30px",
            width: "350px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px white",
            border: "1px solid black",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Login
          </h2>
          {error && (
            <div style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <label>Enter Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
            <label>Enter Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <div style={{ textAlign: "right", marginBottom: "15px" }}>
              <a href="#" style={{ fontSize: "14px", color: "gray" }}>
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default Login;
