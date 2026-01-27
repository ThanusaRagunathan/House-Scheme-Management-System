import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerNotification() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
  };

  const card = {
    backgroundColor: "#ccffcc",
    borderRadius: "16px",
    padding: "16px",
    width: "220px",
    border: "1px solid #6aa84f",
    fontWeight: 600,
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
          fontSize: "42px",
          fontWeight: 600,
        }}
      >
        Notification
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "240px",
            backgroundColor: "#d6d6d6",
            padding: "16px",
          }}
        >
          {/* Sidebar header */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
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
              $
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Financial manager</div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                Treasurer Portal
              </div>
            </div>
          </div>

          {/* Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/overview")}>
              <i className="bi bi-map"></i> Overview
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/houses")}>
              <i className="bi bi-house"></i> Houses
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/tenants")}>
              <i className="bi bi-people"></i> Tenants
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>
            <div
              style={menuItemStyle} onClick={() => navigate("/treasurer/maintenance")}
            >
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/complaints")}>
              <i className="bi bi-journal-text"></i> Complaints
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/documents")}>
              <i className="bi bi-file-earmark-text"></i> Document
            </div>

            <div style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }} onClick={() => navigate("/treasurer/notifications")}>
              <i className="bi bi-bell"></i> Notification
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/reports")}>
              <i className="bi bi-bar-chart"></i> Report
            </div>
          </div>

          {/* User */}
          <div style={{ marginTop: "40px", display: "flex", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>Mike Devis</div>
              <div style={{ fontSize: "12px" }}>Treasurer</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Action cards */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={card}>Facility closure<br /><span style={{ fontWeight: 400 }}>Notify about closures</span></div>
            <div style={card}>Payment reminder<br /><span style={{ fontWeight: 400 }}>Send rent reminders</span></div>
            <div style={card}>Maintenance update<br /><span style={{ fontWeight: 400 }}>Notify about maintenance</span></div>
            <div style={card}>General notice<br /><span style={{ fontWeight: 400 }}>Send announcements</span></div>
          </div>

          {/* Table */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
            Recent notifications
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: "#ddd" }}>
                <td>Rent payment due</td>
                <td>Your rent payment for November 2025 is due on November 1st.</td>
                <td>2025-09-11</td>
                <td><span style={{ background: "black", color: "white", padding: "4px 8px", borderRadius: "6px" }}>new</span></td>
                <td><button>Mark as read</button></td>
              </tr>

              <tr style={{ backgroundColor: "#ddd" }}>
                <td>Pool temporary closure</td>
                <td>The swimming pool will be closed for maintenance from Oct 22–24.</td>
                <td>2025-09-15</td>
                <td><span style={{ background: "black", color: "white", padding: "4px 8px", borderRadius: "6px" }}>new</span></td>
                <td><button>Mark as read</button></td>
              </tr>

              <tr style={{ backgroundColor: "#ddd" }}>
                <td>Complaint update</td>
                <td>Your complaint about the leaking faucet has been updated.</td>
                <td>2025-09-26</td>
                <td><span style={{ background: "#ccc", padding: "4px 8px", borderRadius: "6px" }}>read</span></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default TreasurerNotification;
