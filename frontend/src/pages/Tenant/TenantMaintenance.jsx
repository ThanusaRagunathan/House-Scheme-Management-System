import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantMaintenance() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };

  const tasks = [
    {
      facility: "Pool",
      description: "Chemical balance check",
      date: "2025-09-11",
      status: "completed",
    },
    {
      facility: "Gym",
      description: "Equipment maintenance",
      date: "2025-09-15",
      status: "pending",
    },
    {
      facility: "Park",
      description: "Usual cleaning",
      date: "2025-09-26",
      status: "pending",
    },
    {
      facility: "Pool",
      description: "Regular cleaning",
      date: "2025-09-28",
      status: "completed",
    },
  ];

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
        Maintenance
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            padding: "16px",
            position: "relative",
          }}
        >
          {/* Sidebar Header */}
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

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>

            <div
              style={menuItemStyle}
              onClick={() => navigate("/tenant/complaints")}
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

        {/* Main Content */}
        <div style={{ flex: 1, padding: "40px" }}>
          {/* Stat cards */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "30px" }}>
            <StatCard title="In progress" value="-" subtitle="Being worked on" />
            <StatCard title="Pending" value="2" subtitle="Awaiting start" />
            <StatCard title="Completed" value="2" subtitle="Maintenance tasks" />
          </div>

          <h3 style={{ color: "#0b3d02", marginBottom: "16px" }}>
            All maintenance tasks
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Facility</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{t.facility}</td>
                  <td style={{ padding: "10px" }}>{t.description}</td>
                  <td style={{ padding: "10px" }}>{t.date}</td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        backgroundColor:
                          t.status === "completed" ? "#000" : "red",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
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

/* Reusable stat card */
function StatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        backgroundColor: "#ccffcc",
        padding: "18px",
        borderRadius: "16px",
        minWidth: "220px",
        border: "1px solid #6aa84f",
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: "22px", margin: "6px 0" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#333" }}>{subtitle}</div>
    </div>
  );
}

export default TenantMaintenance;
