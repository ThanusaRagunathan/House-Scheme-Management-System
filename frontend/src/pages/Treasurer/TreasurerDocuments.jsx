import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerDocuments() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };

  const statCard = {
    backgroundColor: "#ccffcc",
    borderRadius: "16px",
    padding: "16px",
    minWidth: "170px",
    border: "1px solid #6aa84f",
    fontWeight: 600,
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
        Documents
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
              $
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
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/maintenance")}>
              <i className="bi bi-wrench-adjustable" ></i> Maintenance
            </div>
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/complaints")}>
              <i className="bi bi-journal-text"></i> Complaints
            </div>
            <div style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }} onClick={() => navigate("/treasurer/documents")}>
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

        {/* Main content */}
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Upload button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                padding: "8px 18px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onClick={()=> navigate("/treasurer/uploaddocument")}
            >
              + Upload document
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <div style={statCard}>Total documents<br />4</div>
            <div style={statCard}>Agreements<br />2</div>
            <div style={statCard}>Invoices<br />1</div>
            <div style={statCard}>Reports<br />1</div>
          </div>

          {/* All documents */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
            All documents
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#e0e0e0" }}>
                <th>Document name</th>
                <th>Type</th>
                <th>Uploaded by</th>
                <th>Uploaded date</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rent agreement-H001", "rent agreement", "John Smith", "2025-09-11", "2.3 MB"],
                ["Invoice sept 2025-H001", "invoice", "System", "2025-09-15", "156 KB"],
                ["Pool maintenance report sept", "maintenance", "Mike Devis", "2025-09-26", "890 KB"],
                ["Rent agreement-H002", "rent agreement", "John Smith", "2025-09-28", "2.1 MB"],
              ].map((row, i) => (
                <tr key={i} style={{ backgroundColor: "#ddd" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "6px" }}>{cell}</td>
                  ))}
                  <td>✏️ 🗑️</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent uploads */}
          <h3 style={{ marginTop: "24px", color: "#0b3d02" }}>
            Recent uploads
          </h3>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              "Rent agreement-H001",
              "Invoice sept 2025-H001",
              "Pool maintenance report sept",
              "Rent agreement-H002",
            ].map((doc, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ccffcc",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  border: "1px solid #6aa84f",
                }}
              >
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default TreasurerDocuments;
