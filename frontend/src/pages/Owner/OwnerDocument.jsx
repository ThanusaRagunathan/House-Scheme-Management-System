import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerDocuments() {
  const navigate = useNavigate();

  const summary = [
    { title: "Total documents", value: "4" },
    { title: "Agreements", value: "2" },
    { title: "Invoices", value: "1" },
    { title: "Reports", value: "1" },
  ];

  const documents = [
    {
      name: "Rent agreement-H001",
      type: "rent agreement",
      uploadedBy: "John Smith",
      date: "2025-09-11",
      size: "2.3 MB",
    },
    {
      name: "Invoice sept 2025-H001",
      type: "invoice",
      uploadedBy: "System",
      date: "2025-09-15",
      size: "156 KB",
    },
    {
      name: "Pool maintenance report sept",
      type: "maintenance",
      uploadedBy: "Mike Devis",
      date: "2025-09-26",
      size: "890 KB",
    },
    {
      name: "Rent agreement-H002",
      type: "rent agreement",
      uploadedBy: "John Smith",
      date: "2025-09-28",
      size: "2.1 MB",
    },
  ];

  const recentUploads = documents.slice(0, 3);

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
        Documents
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
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
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
          {/* Upload button */}
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
              onClick={()=>navigate("/owner/uploaddocument")}
            >
              + Upload document
            </button>
          </div>

          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
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
                <strong>{s.title}</strong>
                <div style={{ marginTop: "8px", fontSize: "18px", fontWeight: 600 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Documents table */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
            All documents
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
                <th>Document name</th>
                <th>Type</th>
                <th>Uploaded by</th>
                <th>Uploaded date</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((d, i) => (
                <tr key={i} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{d.name}</td>
                  <td style={{ padding: "10px" }}>{d.type}</td>
                  <td style={{ padding: "10px" }}>{d.uploadedBy}</td>
                  <td style={{ padding: "10px" }}>{d.date}</td>
                  <td style={{ padding: "10px" }}>{d.size}</td>
                  <td style={{ padding: "10px" }}>
                    <i
                      className="bi bi-pencil-square"
                      style={{ marginRight: "10px", cursor: "pointer" }}
                    ></i>
                    <i
                      className="bi bi-trash"
                      style={{ color: "red", cursor: "pointer" }}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent uploads */}
          <h3 style={{ marginTop: "30px", color: "#0b3d02" }}>
            Recent uploads
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {recentUploads.map((r, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ccffcc",
                  borderRadius: "14px",
                  padding: "12px 16px",
                  border: "1px solid #6aa84f",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{r.name}</strong>
                  <div style={{ fontSize: "12px", color: "#444" }}>
                    {r.date}
                  </div>
                </div>
                <i
                  className="bi bi-download"
                  style={{ fontSize: "18px", cursor: "pointer" }}
                ></i>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default OwnerDocuments;
