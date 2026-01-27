import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerReport() {
  const navigate = useNavigate();

  const summaryCards = [
    {
      title: "Total revenue",
      value: "Rs. 23,000",
      icon: "bi-currency-dollar",
    },
    {
      title: "Total expenses",
      value: "Rs. 3,200",
      icon: "bi-cash-stack",
    },
    {
      title: "Net income",
      value: "Rs. 19,800",
      icon: "bi-graph-up-arrow",
    },
    {
      title: "Occupancy rate",
      value: "75%",
      sub: "3 out of 4",
      icon: "bi-bar-chart",
    },
  ];

  const maintenance = [
    {
      no: "M001",
      facility: "Pool",
      desc: "Chemical balance check",
      date: "2025-09-11",
      amount: "Rs. 500",
      status: "paid",
    },
    {
      no: "M002",
      facility: "Gym",
      desc: "Equipment maintenance",
      date: "2025-09-15",
      amount: "Rs. 1,700",
      status: "pending",
    },
    {
      no: "M003",
      facility: "Park",
      desc: "Usual cleaning",
      date: "2025-09-26",
      amount: "Rs. 200",
      status: "pending",
    },
    {
      no: "M004",
      facility: "Pool",
      desc: "Regular cleaning",
      date: "2025-09-28",
      amount: "Rs. 800",
      status: "paid",
    },
  ];

  const payments = [
    {
      invoice: "INV-2025-001",
      name: "Tom John",
      house: "H001",
      date: "2025-09-01",
      amount: "Rs. 10,000",
      status: "paid",
      method: "Online",
    },
    {
      invoice: "INV-2025-002",
      name: "Jack Brown",
      house: "H002",
      date: "-",
      amount: "Rs. 17,000",
      status: "pending",
      method: "-",
    },
    {
      invoice: "INV-2025-003",
      name: "Patrick Tompson",
      house: "H004",
      date: "2025-09-25",
      amount: "Rs. 13,000",
      status: "paid",
      method: "Offline",
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

  const statusBadge = (status) => ({
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    backgroundColor: status === "paid" ? "#000" : "red",
    color: "white",
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
          fontSize: "40px",
          fontWeight: 600,
        }}
      >
        Report
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

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={menuItemStyle} onClick={() => navigate("/owner/overview")}>
              <i className="bi bi-map"></i>Overview
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/owner/houses")}>
              <i className="bi bi-house"></i>Houses
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/owner/tenants")}>
              <i className="bi bi-people"></i>Tenants
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/owner/payments")}>
              <i className="bi bi-currency-dollar"></i>Payments
            </div>
            <div
              style={menuItemStyle}
              onClick={() => navigate("/owner/maintenance")}
            >
              <i className="bi bi-wrench-adjustable"></i>Maintenance
            </div>
            <div
              style={menuItemStyle}
              onClick={() => navigate("/owner/complaints")}
            >
              <i className="bi bi-journal-text"></i>Complaints
            </div>
            <div
              style={menuItemStyle}
              onClick={() => navigate("/owner/documents")}
            >
              <i className="bi bi-file-earmark-text"></i>Document
            </div>
            <div
              style={menuItemStyle}
              onClick={() => navigate("/owner/notification")}
            >
              <i className="bi bi-bell"></i>Notification
            </div>
            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-bar-chart"></i>Report
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "40px" }}>
          {/* Export */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-download"></i> Export as PDF
            </button>
          </div>

          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              margin: "30px 0",
            }}
          >
            {summaryCards.map((c, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ccffcc",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "1px solid #6aa84f",
                }}
              >
                <i className={`bi ${c.icon}`}></i>
                <div style={{ fontWeight: 600 }}>{c.title}</div>
                <div>{c.value}</div>
                {c.sub && (
                  <div style={{ fontSize: "12px", color: "#444" }}>
                    {c.sub}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Maintenance + Payments tables */}
          {[maintenance, payments].map((list, idx) => (
            <table
              key={idx}
              style={{
                width: "100%",
                marginBottom: "30px",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
              }}
            >
              <tbody>
                {list.map((r, i) => (
                  <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                    {Object.values(r).map((v, j) => (
                      <td key={j} style={{ padding: "10px" }}>
                        {v === "paid" || v === "pending" ? (
                          <span style={statusBadge(v)}>{v}</span>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                    <td>
                      <button
                        style={{
                          borderRadius: "16px",
                          border: "none",
                          padding: "6px 14px",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default OwnerReport;
