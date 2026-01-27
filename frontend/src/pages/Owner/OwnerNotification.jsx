import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerNotification() {
  const navigate = useNavigate();

  // Quick actions (cards)
  const actions = [
    {
      title: "Facility closure",
      subtitle: "Notify about closures",
      icon: "bi-exclamation-circle",
    },
    {
      title: "Payment reminder",
      subtitle: "Send rent reminders",
      icon: "bi-currency-dollar",
    },
    {
      title: "Maintenance update",
      subtitle: "Notify about maintenance",
      icon: "bi-wrench",
    },
    {
      title: "General notice",
      subtitle: "Send announcements",
      icon: "bi-bell",
    },
  ];

  // Notifications table
  const notifications = [
    {
      title: "Rent payment due",
      description:
        "Your rent payment for November 2025 is due on November 1st.",
      date: "2025-09-11",
      status: "new",
    },
    {
      title: "Pool temporary closure",
      description:
        "The swimming pool will be closed for maintenance from Oct 22–24.",
      date: "2025-09-15",
      status: "new",
    },
    {
      title: "Complaint update",
      description:
        "Your complaint about the leaking faucet has been updated.",
      date: "2025-09-26",
      status: "read",
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
    backgroundColor: status === "new" ? "#000" : "#ccc",
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
        Notification
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
              style={menuItemStyle}
              onClick={() => navigate("/owner/complaints")}
            >
              <i className="bi bi-journal-text"></i>
              Complaints
            </div>

            <div
              style={menuItemStyle}
              onClick={() => navigate("/owner/documents")}
            >
              <i className="bi bi-file-earmark-text"></i>
              Document
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
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
          {/* Action cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {actions.map((a, i) => (
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
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#0b3d02",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginBottom: "10px",
                  }}
                >
                  <i className={`bi ${a.icon}`}></i>
                </div>

                <strong>{a.title}</strong>
                <div style={{ fontSize: "13px", color: "#444" }}>
                  {a.subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Notifications table */}
          <h3 style={{ color: "#0b3d02" }}>Recent notifications</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {notifications.map((n, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{n.title}</td>
                  <td style={{ padding: "10px" }}>{n.description}</td>
                  <td style={{ padding: "10px" }}>{n.date}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={statusStyle(n.status)}>{n.status}</span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    {n.status === "new" && (
                      <button
                        style={{
                          backgroundColor: "#000",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          padding: "6px 14px",
                          cursor: "pointer",
                        }}
                      >
                        Mark as read
                      </button>
                    )}
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

export default OwnerNotification;
