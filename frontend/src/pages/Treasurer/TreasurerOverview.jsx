import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerOverview() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };

  const cardStyle = {
    backgroundColor: "#0b3d02",
    color: "white",
    borderRadius: "20px",
    padding: "24px",
    width: "340px",
    height: "120px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const numberStyle = {
    fontSize: "48px",
    fontWeight: "700",
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
        Overview
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
              <i className="bi bi-currency-dollar"></i>
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
            <div style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }}>
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
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/reports")}>
              <i className="bi bi-bar-chart"></i> Report
            </div>
          </div>

          
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: "60px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "40px",
          }}
        >
          <div style={cardStyle}>
            <div>
              <h3>Total Houses</h3>
              <p>3 occupied, 1 vacant</p>
            </div>
            <div style={numberStyle}>4</div>
          </div>

          <div style={cardStyle}>
            <div>
              <h3>Total Tenants</h3>
            </div>
            <div style={numberStyle}>3</div>
          </div>

          <div style={cardStyle}>
            <div>
              <h3>Open Issues</h3>
              <p>3 complaints, 2 maintenance</p>
            </div>
            <div style={numberStyle}>3</div>
          </div>

          <div style={cardStyle}>
            <div>
              <h3>Pending payments</h3>
              <p>Requires attention</p>
            </div>
            <div style={numberStyle}>1</div>
          </div>

          <div style={cardStyle}>
            <div>
              <h3>Payments made</h3>
              <p>(this month)</p>
            </div>
            <div style={numberStyle}>2</div>
          </div>

          <div style={cardStyle}>
            <div>
              <h3>Revenue (this month)</h3>
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>
              Rs. 23,000
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default TreasurerOverview;
