import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerUploadDocument() {
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
        Create task
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

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Form card */}
          <div
            style={{
              backgroundColor: "#ccffcc",
              padding: "30px",
              borderRadius: "18px",
              width: "520px",
              border: "1px solid #6aa84f",
            }}
          >
            {/* Facility */}
            <label style={label}>Facility</label>
            <input style={{ ...input, width: "140px" }} />

            {/* Description */}
            <label style={label}>Description</label>
            <textarea
              style={{
                ...input,
                height: "90px",
                resize: "none",
              }}
            />

            {/* Date */}
            <label style={label}>Scheduled Date</label>
            <input type="date" style={{ ...input, width: "160px" }} />

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button
                style={cancelBtn}
                onClick={() => navigate("/owner/maintenance")}
              >
                Cancel
              </button>

              <button style={saveBtn}>Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* ---------- styles ---------- */

const label = {
  display: "block",
  fontWeight: 600,
  marginTop: "14px",
  marginBottom: "6px",
};

const input = {
  width: "100%",
  padding: "6px",
  border: "1px solid #000",
  backgroundColor: "#e0e0e0",
};

const cancelBtn = {
  padding: "6px 14px",
  borderRadius: "6px",
  border: "1px solid #000",
  backgroundColor: "white",
  cursor: "pointer",
};

const saveBtn = {
  padding: "6px 18px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#0b3d02",
  color: "white",
  cursor: "pointer",
};

export default OwnerUploadDocument;
