import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerComplaints() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };

  const summaryCard = {
    backgroundColor: "#ccffcc",
    borderRadius: "16px",
    padding: "16px",
    width: "220px",
    border: "1px solid #6aa84f",
  };

  const statusBadge = (text, bg) => ({
    backgroundColor: bg,
    color: "white",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    display: "inline-block",
  });

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
        Complaints
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
            <div style={menuItemStyle} onClick={()=> navigate("/treasurer/tenants")}>
              <i className="bi bi-people"></i> Tenants
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>
            <div style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }} onClick={() => navigate("/treasurer/complaints")}>
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

        {/* Main content */}
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Summary cards */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={summaryCard}>
              <strong>Open complaints</strong>
              <div style={{ fontSize: "26px", fontWeight: 700 }}>1</div>
              <div style={{ fontSize: "13px" }}>Requires attention</div>
            </div>

            <div style={summaryCard}>
              <strong>In progress</strong>
              <div style={{ fontSize: "26px", fontWeight: 700 }}>1</div>
              <div style={{ fontSize: "13px" }}>Being addressed</div>
            </div>

            <div style={summaryCard}>
              <strong>Resolved</strong>
              <div style={{ fontSize: "26px", fontWeight: 700 }}>1</div>
              <div style={{ fontSize: "13px" }}>Successfully resolved</div>
            </div>
          </div>

          {/* Table */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
            All complaints
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th>Complaint No.</th>
                <th>House</th>
                <th>Title</th>
                <th>Submitted date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr style={{ backgroundColor: "#ddd" }}>
                <td>CO01</td>
                <td>H002</td>
                <td>Leaking faucet</td>
                <td>2025-09-05</td>
                <td><span style={statusBadge("in progress", "black")}>in progress</span></td>
                <td><button>View</button></td>
              </tr>

              <tr style={{ backgroundColor: "#ddd" }}>
                <td>CO02</td>
                <td>H004</td>
                <td>Loud neighbors</td>
                <td>2025-09-13</td>
                <td><span style={statusBadge("open", "red")}>open</span></td>
                <td><button>View</button></td>
              </tr>

              <tr style={{ backgroundColor: "#ddd" }}>
                <td>CO03</td>
                <td>H001</td>
                <td>Roof broken</td>
                <td>2025-09-21</td>
                <td><span style={statusBadge("resolved", "red")}>resolved</span></td>
                <td><button>View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default TreasurerComplaints;
