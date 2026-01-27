import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantPayments() {
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
        Payments
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

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
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

        {/* Main */}
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Add payment */}
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
              onClick={()=>navigate("/tenant/addpayment")}
            >
              + Add payment
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              marginTop: "20px",
            }}
          >
            <StatCard
              title="Total paid"
              value="Rs. 10,000"
              sub="1 payments"
            />
            <StatCard
              title="Pending payments"
              value="-"
              sub="0 payments"
            />
            <StatCard
              title="Payment history"
              value="1"
              sub="1 payments"
            />
          </div>

          {/* Table */}
          <h3 style={{ marginTop: "30px" }}>All payments</h3>

          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Invoice No.</th>
                <th>Name</th>
                <th>House</th>
                <th>Paid date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <td style={td}>INV-2025-001</td>
                <td style={td}>Tom John</td>
                <td style={td}>H001</td>
                <td style={td}>2025-09-01</td>
                <td style={td}>Rs. 10,000</td>
                <td style={td}>
                  <span
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    paid
                  </span>
                </td>
                <td style={td}>Online</td>
                <td style={td}>
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
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div
      style={{
        backgroundColor: "#ccffcc",
        padding: "18px",
        borderRadius: "16px",
        border: "1px solid #6aa84f",
      }}
    >
      <strong>{title}</strong>
      <div style={{ fontSize: "18px", marginTop: "6px" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#333" }}>{sub}</div>
    </div>
  );
}

const td = { padding: "10px" };

export default TenantPayments;
