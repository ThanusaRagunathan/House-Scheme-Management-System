import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantComplaints() {
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
        Complaints
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            padding: "16px",
          }}
        >
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

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
              <i className="bi bi-journal-text"></i> Complaints
            </div>

            <div
              style={menuItemStyle}
              onClick={() => navigate("/tenant/documents")}
            >
              <i className="bi bi-file-earmark-text"></i> Document
            </div>

            <div
              style={menuItemStyle}
              onClick={() => navigate("/tenant/notification")}
            >
              <i className="bi bi-bell"></i> Notification
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "40px" }}>
          {/* Top actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "30px",
            }}
          >
            <button
              style={{
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 18px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={()=>navigate("/tenant/addcomplaint")}
            >
              + Add Complaints
            </button>
          </div>

          {/* Summary cards */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "30px" }}>
            <SummaryCard title="Complaints submitted" value="1" />
            <SummaryCard title="Resolved complaints" value="1" />
            <SummaryCard title="Pending complaints" value="-" />
          </div>

          {/* Complaints list */}
          <h3 style={{ marginBottom: "14px" }}>My complaints</h3>

          <div
            style={{
              backgroundColor: "#e0e0e0",
              padding: "20px",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Roof broken</div>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  backgroundColor: "black",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
                Resolved
              </span>

              <div style={{ marginTop: "10px", fontSize: "14px" }}>
                Owner response: Broken roof was repaired
              </div>
              <div style={{ fontSize: "13px", marginTop: "4px" }}>
                Resolved on: 2025-09-25
              </div>
            </div>

            <div style={{ fontSize: "14px" }}>
              Submitted on
              <br />
              2025-09-21
            </div>
          </div>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: "#ccffcc",
        padding: "18px",
        borderRadius: "16px",
        width: "220px",
        border: "1px solid #6aa84f",
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ marginTop: "8px", fontSize: "18px" }}>{value}</div>
    </div>
  );
}

export default TenantComplaints;
