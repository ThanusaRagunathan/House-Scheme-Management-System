import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerReports() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };


  const statCard = {
    backgroundColor: "#ccffcc",
    borderRadius: "16px",
    padding: "16px",
    minWidth: "190px",
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
        Report
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
            <div style={menuItemStyle} >
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
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/maintenance")}>
              <i className="bi bi-wrench-adjustable" ></i> Maintenance
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
            <div style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }}onClick={() => navigate("/treasurer/reports")}>
              <i className="bi bi-bar-chart"></i> Report
            </div>
          </div>

          
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Export button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                padding: "8px 18px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              Export as PDF
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <div style={statCard}>Total revenue<br />Rs. 23,000</div>
            <div style={statCard}>Total expenses<br />Rs. 3,200</div>
            <div style={statCard}>Net income<br />Rs. 19,800</div>
            <div style={statCard}>Occupancy rate<br />75%<br />3 out of 4</div>
          </div>

          {/* Maintenance table */}
          <table style={{ width: "100%", marginTop: "30px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th>Tasks No.</th>
                <th>Facility</th>
                <th>Description</th>
                <th>Paid date</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["M001", "Pool", "Chemical balance check", "2025-09-11", "Rs. 500", "paid"],
                ["M002", "Gym", "Equipment maintenance", "2025-09-15", "Rs. 1,700", "pending"],
                ["M003", "Park", "Usual cleaning", "2025-09-26", "Rs. 200", "pending"],
                ["M004", "Pool", "Regular cleaning", "2025-09-28", "Rs. 800", "paid"],
              ].map((row, i) => (
                <tr key={i} style={{ backgroundColor: "#ddd" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "6px" }}>{cell}</td>
                  ))}
                  <td><button>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice table */}
          <table style={{ width: "100%", marginTop: "24px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th>Invoice No.</th>
                <th>Name</th>
                <th>House</th>
                <th>Paid date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["INV-2025-001", "Karthik", "H001", "2025-09-01", "Rs. 10,000", "paid", "Online"],
                ["INV-2025-002", "Jack Brown", "H002", "-", "Rs. 17,000", "pending", "-"],
                ["INV-2025-003", "Patrick Tompson", "H004", "2025-09-25", "Rs. 13,000", "paid", "Offline"],
              ].map((row, i) => (
                <tr key={i} style={{ backgroundColor: "#ddd" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "6px" }}>{cell}</td>
                  ))}
                  <td><button>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default TreasurerReports;
