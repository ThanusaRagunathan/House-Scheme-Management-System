import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerComplaints() {
  const navigate = useNavigate();

  // Summary cards
  const summary = [
    {
      title: "Open complaints",
      value: "1",
      note: "Requires attention",
      icon: "bi-exclamation-circle",
    },
    {
      title: "In progress",
      value: "1",
      note: "Being addressed",
      icon: "bi-hourglass-split",
    },
    {
      title: "Resolved",
      value: "1",
      note: "Successfully resolved",
      icon: "bi-check2-circle",
    },
  ];

  // Complaints data
  const complaints = [
    {
      no: "C001",
      house: "H002",
      title: "Leaking faucet",
      date: "2025-09-05",
      status: "in progress",
    },
    {
      no: "C002",
      house: "H004",
      title: "Loud neighbors",
      date: "2025-09-13",
      status: "open",
    },
    {
      no: "C003",
      house: "H001",
      title: "Roof broken",
      date: "2025-09-21",
      status: "resolved",
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

  const statusStyle = (status) => ({
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    color: "white",
    backgroundColor:
      status === "resolved"
        ? "red"
        : status === "open"
        ? "red"
        : "black",
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
        Complaints
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
              style={menuItemStyle}
              onClick={() => navigate("/owner/maintenance")}
            >
              <i className="bi bi-wrench-adjustable"></i>
              Maintenance
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
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
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "30px",
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

          {/* Complaints table */}
          <h3 style={{ color: "#0b3d02" }}>All complaints</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <thead>
              <tr>
                <th>Complaint No.</th>
                <th>House</th>
                <th>Title</th>
                <th>Submitted date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{c.no}</td>
                  <td style={{ padding: "10px" }}>{c.house}</td>
                  <td style={{ padding: "10px" }}>{c.title}</td>
                  <td style={{ padding: "10px" }}>{c.date}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={statusStyle(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      style={{
                        backgroundColor: "#ccc",
                        border: "none",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
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

export default OwnerComplaints;
