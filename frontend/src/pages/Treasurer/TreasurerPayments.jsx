import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerPayments() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
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
        Payments
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
            <div style={menuItemStyle} onClick={()=> navigate("/treasurer/tenants")}>
              <i className="bi bi-people"></i> Tenants
            </div>
            <div
              style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }}
            >
              <i className="bi bi-currency-dollar"></i> Payments
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/maintenance")}>
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

          {/* User */}
          <div style={{ marginTop: "40px", display: "flex", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>Mike Devis</div>
              <div style={{ fontSize: "12px" }}>Treasurer</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "40px" }}>
          {/* Top actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button style={actionBtn} onClick={() => navigate("/treasurer/addpayment")}>+ Add payment</button>
            <button style={actionBtn} onClick={() => navigate("/treasurer/generateinvoice")}> Generate invoice</button>
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
            <SummaryCard title="Total collected" value="Rs. 23,000" subtitle="2 payments" />
            <SummaryCard title="Pending payments" value="Rs. 17,000" subtitle="1 payments" />
            <SummaryCard title="Overdue" value="-" subtitle="0 payments" />
          </div>

          {/* Tables */}
          <h3 style={sectionTitle}>All payments</h3>
          <PaymentsTable />

          <h3 style={sectionTitle}>Pending payments</h3>
          <PendingTable />
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* ---------- Components ---------- */

function SummaryCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        backgroundColor: "#ccffcc",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #6aa84f",
      }}
    >
      <strong>{title}</strong>
      <div style={{ fontSize: "20px", marginTop: "6px" }}>{value}</div>
      <div style={{ fontSize: "13px" }}>{subtitle}</div>
    </div>
  );
}

function PaymentsTable() {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Invoice No.</th>
          <th>Name</th>
          <th>House</th>
          <th>Paid date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Method</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>INV-2025-001</td>
          <td>Tom John</td>
          <td>H001</td>
          <td>2025-09-01</td>
          <td>Rs. 10,000</td>
          <td><span className="paid">paid</span></td>
          <td>Online</td>
        </tr>
        <tr>
          <td>INV-2025-002</td>
          <td>Jack Brown</td>
          <td>H002</td>
          <td>-</td>
          <td>Rs. 17,000</td>
          <td><span className="pending">pending</span></td>
          <td>-</td>
        </tr>
        <tr>
          <td>INV-2025-003</td>
          <td>Patrick Tompson</td>
          <td>H004</td>
          <td>2025-09-25</td>
          <td>Rs. 13,000</td>
          <td><span className="paid">paid</span></td>
          <td>Offline</td>
        </tr>
      </tbody>
    </table>
  );
}

function PendingTable() {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Invoice No.</th>
          <th>Name</th>
          <th>House</th>
          <th>Due date</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>INV-2025-002</td>
          <td>Jack Brown</td>
          <td>H002</td>
          <td>2025-09-30</td>
          <td>Rs. 17,000</td>
          <td>
            <button style={reminderBtn}>Send reminder</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/* ---------- Styles ---------- */

const actionBtn = {
  backgroundColor: "#0b3d02",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
};

const sectionTitle = {
  marginTop: "30px",
  marginBottom: "10px",
  color: "#0b3d02",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
};

const reminderBtn = {
  backgroundColor: "black",
  color: "white",
  borderRadius: "10px",
  border: "none",
  padding: "6px 14px",
  cursor: "pointer",
};

export default TreasurerPayments;
