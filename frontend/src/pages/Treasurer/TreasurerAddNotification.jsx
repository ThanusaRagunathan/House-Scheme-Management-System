import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerAddNotification() {
  const navigate = useNavigate();

  const menuItem = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "14px",
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
        Notification
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
            <div style={menuItem} onClick={() => navigate("/treasurer/overview")}>
              Overview
            </div>
            <div style={menuItem}>Houses</div>
            <div style={menuItem}>Tenants</div>
            <div style={menuItem}>Payments</div>
            <div style={menuItem}>Maintenance</div>
            <div style={menuItem}>Complaints</div>
            <div style={menuItem}>Document</div>

            <div
              style={{
                ...menuItem,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
              Notification
            </div>

            <div style={menuItem}>Report</div>
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
          <div
            style={{
              backgroundColor: "#ccffcc",
              padding: "30px",
              borderRadius: "18px",
              width: "520px",
              border: "1px solid #6aa84f",
            }}
          >
            <label style={label}>Title</label>
            <input style={inputSmall} />

            <label style={label}>Message</label>
            <textarea style={textarea} />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button style={cancelBtn} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button style={saveBtn}>Save</button>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* styles */

const label = {
  display: "block",
  fontWeight: 600,
  marginBottom: "6px",
  marginTop: "14px",
};

const inputSmall = {
  width: "120px",
  padding: "6px",
  border: "1px solid #000",
  backgroundColor: "#e0e0e0",
  display: "block",
};

const textarea = {
  width: "100%",
  height: "90px",
  padding: "6px",
  border: "1px solid #000",
  backgroundColor: "#e0e0e0",
  resize: "none",
};

const cancelBtn = {
  padding: "6px 16px",
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

export default TreasurerAddNotification;
