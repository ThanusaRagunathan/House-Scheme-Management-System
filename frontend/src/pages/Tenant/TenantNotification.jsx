import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantNotification() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
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
      {/* Header */}
      <header
        style={{
          backgroundColor: "#0b3d02",
          color: "white",
          padding: "30px 40px",
          fontSize: "40px",
          fontWeight: 600,
        }}
      >
        Notification
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            padding: "16px",
            position: "relative", // FIXED
          }}
        >
          {/* Sidebar Top */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#0b3d02",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <i className="bi bi-person"></i>
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>H001</div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                Tenant Portal
              </div>
            </div>
          </div>

          {/* Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={menuItemStyle} onClick={() => navigate("/tenant/overview")}>
              <i className="bi bi-map"></i> Overview
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/complaints")}>
              <i className="bi bi-journal-text"></i> Complaints
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/documents")}>
              <i className="bi bi-file-earmark-text"></i> Document
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
              <i className="bi bi-bell"></i> Notification
            </div>
          </div>

          
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "40px" }}>
          <h3 style={{ marginBottom: "20px", color: "#0b3d02" }}>
            All notifications
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="cell">Rent payment due</td>
                <td className="cell">
                  Your rent payment for November 2025 is due on November 1st.
                </td>
                <td className="cell">2025-09-11</td>
                <td>
                  <span className="status new">new</span>
                </td>
                <td className="cell">
                  <button className="action-btn">Mark as read</button>
                </td>
              </tr>

              <tr>
                <td className="cell">Pool temporary closure</td>
                <td className="cell">
                  The swimming pool will be closed for maintenance from Oct 22–24.
                </td>
                <td className="cell">2025-09-15</td>
                <td>
                  <span className="status new">new</span>
                </td>
                <td className="cell">
                  <button className="action-btn">Mark as read</button>
                </td>
              </tr>

              <tr>
                <td className="cell">Complaint update</td>
                <td className="cell">
                  Your complaint about the leaking faucet has been updated.
                </td>
                <td className="cell">2025-09-26</td>
                <td>
                  <span className="status read">read</span>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />

      {/* Inline styles */}
      <style>{`
        .cell {
          background: #e0e0e0;
          padding: 8px;
        }
        .status {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .status.new {
          background: black;
          color: white;
        }
        .status.read {
          background: #d1d1d1;
        }
        .action-btn {
          font-size: 12px;
          cursor: pointer;
          padding: 4px 8px;
        }
      `}</style>
    </div>
  );
}

export default TenantNotification;
