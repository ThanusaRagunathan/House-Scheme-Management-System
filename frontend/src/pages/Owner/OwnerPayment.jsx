import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerPayment() {
  const navigate = useNavigate();

  // Summary cards data
  const summary = [
    {
      title: "Total collected",
      amount: "Rs. 23,000",
      note: "2 payments",
      icon: "bi-currency-dollar",
    },
    {
      title: "Pending payments",
      amount: "Rs. 17,000",
      note: "1 payments",
      icon: "bi-clock",
    },
    {
      title: "Overdue",
      amount: "-",
      note: "0 payments",
      icon: "bi-exclamation-circle",
    },
  ];

  // Payments table
  const allPayments = [
    {
      invoice: "INV-2025-001",
      name: "Karthik",
      house: "H001",
      paidDate: "2025-09-01",
      amount: "Rs. 10,000",
      status: "paid",
      method: "Online",
    },
    {
      invoice: "INV-2025-002",
      name: "Jack Brown",
      house: "H002",
      paidDate: "-",
      amount: "Rs. 17,000",
      status: "pending",
      method: "-",
    },
    {
      invoice: "INV-2025-003",
      name: "Patrick Tompson",
      house: "H004",
      paidDate: "2025-09-25",
      amount: "Rs. 13,000",
      status: "paid",
      method: "Offline",
    },
  ];

  const pendingPayments = [
    {
      invoice: "INV-2025-002",
      name: "Jack Brown",
      house: "H002",
      dueDate: "2025-09-30",
      amount: "Rs. 17,000",
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
        Payments
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

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-currency-dollar"></i>
              Payments
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/owner/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i>
              Maintenance
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/owner/complaints")}>
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
          {/* Generate invoice */}
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
            >
              <i className="bi bi-receipt" style={{ marginRight: "8px" }}></i>
              Generate invoice
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
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

                <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: 600 }}>
                  {s.amount}
                </div>
                <div style={{ fontSize: "13px", color: "#444" }}>{s.note}</div>
              </div>
            ))}
          </div>

          {/* All payments */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>All payments</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
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
              {allPayments.map((p, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{p.invoice}</td>
                  <td style={{ padding: "10px" }}>{p.name}</td>
                  <td style={{ padding: "10px" }}>{p.house}</td>
                  <td style={{ padding: "10px" }}>{p.paidDate}</td>
                  <td style={{ padding: "10px" }}>{p.amount}</td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "10px",
                        backgroundColor:
                          p.status === "paid" ? "#000" : "red",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>{p.method}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pending payments */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
            Pending payments
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
                <th>Invoice No.</th>
                <th>Name</th>
                <th>House</th>
                <th>Due date</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {pendingPayments.map((p, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{p.invoice}</td>
                  <td style={{ padding: "10px" }}>{p.name}</td>
                  <td style={{ padding: "10px" }}>{p.house}</td>
                  <td style={{ padding: "10px" }}>{p.dueDate}</td>
                  <td style={{ padding: "10px" }}>{p.amount}</td>
                  <td style={{ padding: "10px" }}>
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
                      <i className="bi bi-send"></i> Send reminder
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

export default OwnerPayment;
