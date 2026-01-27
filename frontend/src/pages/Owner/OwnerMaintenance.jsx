import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerMaintenance() {
  const navigate = useNavigate();

  // Summary cards
  const summary = [
    {
      title: "Total tasks",
      value: "4",
      note: "2 pending",
      icon: "bi-wrench",
    },
    {
      title: "Total cost",
      value: "Rs. 3,200",
      note: "All maintenance costs",
      icon: "bi-currency-dollar",
    },
    {
      title: "Completed",
      value: "2",
      note: "Tasks completed",
      icon: "bi-check2-square",
    },
  ];

  // Maintenance tasks
  const tasks = [
    {
      no: "M001",
      facility: "Pool",
      description: "Chemical balance check",
      date: "2025-09-11",
      cost: "Rs. 500",
      status: "paid",
    },
    {
      no: "M002",
      facility: "Gym",
      description: "Equipment maintenance",
      date: "2025-09-15",
      cost: "Rs. 1,700",
      status: "pending",
    },
    {
      no: "M003",
      facility: "Park",
      description: "Usual cleaning",
      date: "2025-09-26",
      cost: "Rs. 200",
      status: "pending",
    },
    {
      no: "M004",
      facility: "Pool",
      description: "Regular cleaning",
      date: "2025-09-28",
      cost: "Rs. 800",
      status: "paid",
    },
  ];

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
        Maintenance
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            padding: "16px",
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
              <i className="bi bi-buildings"></i>
            </div>

            <div>
              <div style={{ fontWeight: 600 }}>Property Manager</div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                Owner Portal
              </div>
            </div>
          </div>

          {/* Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={menuItemStyle} onClick={() => navigate("/owner/overview")}>
              <i className="bi bi-map"></i>
              Overview
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/owner/houses")}>
              <i className="bi bi-house"></i>
              Houses
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/owner/tenants")}>
              <i className="bi bi-people"></i>
              Tenants
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/owner/payments")}>
              <i className="bi bi-currency-dollar"></i>
              Payments
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-wrench-adjustable" onClick={()=>navigate("/owner/maintenance")}></i>
              Maintenance
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/complaints")}>
              <i className="bi bi-journal-text"></i>
              Complaints
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/documents")}>
              <i className="bi bi-file-earmark-text"></i>
              Document
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/notification")}>
              <i className="bi bi-bell"></i>
              Notification
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/report")}>
              <i className="bi bi-bar-chart"></i>
              Report
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "40px" }}>
          {/* Create task button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              onClick={()=>navigate("/owner/createtask")}
            >
              + Create task
            </button>
          </div>

          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {summary.map((s, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ccffcc",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "1px solid #6aa84f",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#0b3d02",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <strong>{s.title}</strong>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "13px", color: "#444" }}>
                  {s.note}
                </div>
              </div>
            ))}
          </div>

          {/* Tasks table */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
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
              <tr>
                <th>Tasks No.</th>
                <th>Facility</th>
                <th>Description</th>
                <th>Date</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{t.no}</td>
                  <td style={{ padding: "10px" }}>{t.facility}</td>
                  <td style={{ padding: "10px" }}>{t.description}</td>
                  <td style={{ padding: "10px" }}>{t.date}</td>
                  <td style={{ padding: "10px" }}>{t.cost}</td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "10px",
                        backgroundColor:
                          t.status === "paid" ? "#000" : "red",
                        color: "white",
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

      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default OwnerMaintenance;
