import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function Document() {
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
        Document
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            padding: "16px",
            position: "relative",
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
            <div style={menuItemStyle} onClick={() => navigate("/tenant/overview")}>
              <i className="bi bi-map"></i> Overview
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/complaints")}>
              <i className="bi bi-journal-text"></i> Complaints
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
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

        {/* Main Content */}
        <div style={{ flex: 1, padding: "40px" }}>
          <h3 style={{ marginBottom: "20px", color: "#0b3d02" }}>
            My Documents
          </h3>

          {/* Document Card 1 */}
          <div style={docCardStyle}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={docIconStyle}>
                <i className="bi bi-file-earmark-text"></i>
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>Rent agreement-H001</div>
                <div style={{ fontSize: "13px" }}>
                  Uploaded on: 2025-09-11
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button style={downloadBtnStyle}>
                Download <i className="bi bi-download"></i>
              </button>
              <span style={tagStyle}>rent agreement</span>
            </div>
          </div>

          {/* Document Card 2 */}
          <div style={docCardStyle}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={docIconStyle}>
                <i className="bi bi-file-earmark-text"></i>
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>
                  Invoice Sept 2025-H001
                </div>
                <div style={{ fontSize: "13px" }}>
                  Uploaded on: 2025-09-15 <br />
                  Size: 156 KB
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button style={downloadBtnStyle}>
                Download <i className="bi bi-download"></i>
              </button>
              <span style={tagStyle}>invoice</span>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* Styles */
const docCardStyle = {
  backgroundColor: "#e0e0e0",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const docIconStyle = {
  width: "36px",
  height: "36px",
  backgroundColor: "#0b3d02",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};

const downloadBtnStyle = {
  padding: "6px 14px",
  borderRadius: "8px",
  border: "1px solid #000",
  backgroundColor: "#dcdcdc",
  cursor: "pointer",
};

const tagStyle = {
  backgroundColor: "#000",
  color: "white",
  padding: "4px 10px",
  borderRadius: "8px",
  fontSize: "12px",
};

export default Document;
