import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantOverview() {
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
        Overview
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
          {/* Sidebar header */}
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
            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
              <i className="bi bi-map"></i> Overview
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>

            <div
              style={menuItemStyle}
              onClick={() => navigate("/tenant/maintenance")}
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

        {/* Main content */}
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Top cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            <StatCard title="Rent" value="Rs. 10,000/mo" />

            <StatCard
              title="Next payment"
              value="Rs. 10,000"
              sub="Due: 2025-10-01"
            />

            <StatCard
              title="Payment made"
              value="1 successfully paid"
            />
          </div>

          {/* Notice */}
          <div
            style={{
              marginTop: "30px",
              backgroundColor: "#ccffcc",
              padding: "18px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid #6aa84f",
            }}
          >
            <i className="bi bi-exclamation-circle"></i>
            <strong>
              The swimming pool will be closed for maintenance from Oct 22–24.
            </strong>
          </div>

          {/* Content grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "24px",
              marginTop: "30px",
            }}
          >
            {/* Complaints */}
            <div>
              <h3 style={{ marginBottom: "12px" }}>All complaints</h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th>Complaint No.</th>
                    <th>Title</th>
                    <th>Submitted date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr style={{ backgroundColor: "#e0e0e0" }}>
                    <td style={td}>C003</td>
                    <td style={td}>Roof broken</td>
                    <td style={td}>2025-09-21</td>
                    <td style={td}>
                      <span
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                      >
                        resolved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Family members */}
            <div>
              <h3 style={{ marginBottom: "12px" }}>Your Family Members</h3>

              <div
                style={{
                  backgroundColor: "#ccffcc",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #6aa84f",
                }}
              >
                <strong>Karthik (Tenant)</strong>
                <div>Software engineer</div>
                <div>200165894231</div>
                <div>2001-02-28</div>
                <div>karthik@gmail.com</div>
                <div>077 123 4567</div>

                <hr />

                <strong>Sarah John (Spouse)</strong>
                <div>Doctor</div>
                <div>200354326811</div>
                <div>2003-06-17</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* ---------- components ---------- */

function StatCard({ title, value, sub }) {
  return (
    <div
      style={{
        backgroundColor: "#0b3d02",
        color: "white",
        padding: "18px",
        borderRadius: "16px",
      }}
    >
      <h3>{title}</h3>
      {sub && <div style={{ fontSize: "14px" }}>{sub}</div>}
      <div style={{ marginTop: "8px", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const td = { padding: "10px" };

export default TenantOverview;
