import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerTenants() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "14px",
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
        Tenants
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

            <div style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }}>
              <i className="bi bi-people"></i> Tenants
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/complaints")}>
              <i className="bi bi-journal-text"></i> Complaints
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/documents")}>
              <i className="bi bi-file-earmark-text"></i> Document
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/notifications")}>
              <i className="bi bi-bell"></i> Notification
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/treasurer/reports")}>
              <i className="bi bi-bar-chart"></i> Report
            </div>
          </div>

          
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>House</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr style={{ backgroundColor: "#ddd" }}>
                <td>Karthik</td>
                <td>karthik@gmail.com</td>
                <td>077 123 4567</td>
                <td>H001</td>
                <td>
                  <button style={viewBtn}>View</button>
                  <span style={icon}>✏️</span>
                  <span style={{ ...icon, color: "red" }}>🗑️</span>
                </td>
              </tr>

              <tr style={{ backgroundColor: "#ddd" }}>
                <td>Jack Brown</td>
                <td>jack123@gmail.com</td>
                <td>077 548 5503</td>
                <td>H002</td>
                <td>
                  <button style={viewBtn}>View</button>
                  <span style={icon}>✏️</span>
                  <span style={{ ...icon, color: "red" }}>🗑️</span>
                </td>
              </tr>

              <tr style={{ backgroundColor: "#ddd" }}>
                <td>Patrick Tompson</td>
                <td>pato@gmail.com</td>
                <td>075 472 3652</td>
                <td>H004</td>
                <td>
                  <button style={viewBtn}>View</button>
                  <span style={icon}>✏️</span>
                  <span style={{ ...icon, color: "red" }}>🗑️</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* styles */
const viewBtn = {
  padding: "6px 14px",
  borderRadius: "18px",
  border: "none",
  backgroundColor: "#ccc",
  marginRight: "8px",
  cursor: "pointer",
};

const icon = {
  marginLeft: "8px",
  cursor: "pointer",
};

export default TreasurerTenants;
