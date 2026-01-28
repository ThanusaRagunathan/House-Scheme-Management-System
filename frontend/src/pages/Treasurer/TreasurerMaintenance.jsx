import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerMaintenance() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
  };

  const tasks = [
    {
      no: "M001",
      facility: "Pool",
      desc: "Chemical balance check",
      date: "2025-09-11",
      cost: "Rs. 500",
      status: "paid",
    },
    {
      no: "M002",
      facility: "Gym",
      desc: "Equipment maintenance",
      date: "2025-09-15",
      cost: "Rs. 1,700",
      status: "pending",
    },
    {
      no: "M003",
      facility: "Park",
      desc: "Usual cleaning",
      date: "2025-09-26",
      cost: "Rs. 200",
      status: "pending",
    },
    {
      no: "M004",
      facility: "Pool",
      desc: "Regular cleaning",
      date: "2025-09-28",
      cost: "Rs. 800",
      status: "paid",
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
          fontSize: "42px",
          fontWeight: 600,
        }}
      >
        Maintenance
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
              style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }}
            >
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
          {/* Top button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "10px 18px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={()=>navigate("/treasurer/addcost")}
            >
              + Add Cost
            </button>
          </div>

          {/* Summary cards */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "30px",
            }}
          >
            <SummaryCard title="Total tasks" value="4" sub="2 pending" />
            <SummaryCard title="Total cost" value="Rs. 3,200" sub="All maintenance costs" />
            <SummaryCard title="Completed" value="2" sub="Tasks completed" />
          </div>

          {/* Table */}
          <h3 style={{ marginTop: "40px", color: "#0b3d02" }}>
            All maintenance tasks
          </h3>

          <table
            style={{
              width: "100%",
              marginTop: "16px",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Tasks No.</th>
                <th>Facility</th>
                <th>Description</th>
                <th>Date</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.no} style={{ backgroundColor: "#e0e0e0" }}>
                  <td>{t.no}</td>
                  <td>{t.facility}</td>
                  <td>{t.desc}</td>
                  <td>{t.date}</td>
                  <td>{t.cost}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor:
                          t.status === "paid" ? "black" : "red",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "6px",
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

/* ---------- Small components ---------- */

function SummaryCard({ title, value, sub }) {
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
      <div style={{ fontSize: "22px", marginTop: "6px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#333" }}>{sub}</div>
    </div>
  );
}

export default TreasurerMaintenance;
