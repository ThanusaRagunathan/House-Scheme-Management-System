import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerAddPayment() {
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
        Add payment
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
            <div style={menuItemStyle}>
              <i className="bi bi-people"></i> Tenants
            </div>
            <div
              style={{ ...menuItemStyle, color: "#1d4ed8", fontWeight: 600 }}
            >
              <i className="bi bi-currency-dollar"></i> Payments
            </div>
            <div style={menuItemStyle}>
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>
            <div style={menuItemStyle}>
              <i className="bi bi-journal-text"></i> Complaints
            </div>
            <div style={menuItemStyle}>
              <i className="bi bi-file-earmark-text"></i> Document
            </div>
            <div style={menuItemStyle}>
              <i className="bi bi-bell"></i> Notification
            </div>
            <div style={menuItemStyle}>
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
              width: "420px",
              border: "1px solid #6aa84f",
            }}
          >
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} />

            <label style={labelStyle}>House Address</label>
            <input style={inputStyle} />

            <label style={labelStyle}>Amount</label>
            <input style={{ ...inputStyle, width: "100px" }} />

            <button
              style={{
                marginTop: "16px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              Offline payment
            </button>

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
                onClick={() => navigate("/treasurer/payments")}
              >
                Cancel
              </button>
              <button style={saveBtn}>Continue</button>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

/* ---------- Styles ---------- */

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginTop: "14px",
  marginBottom: "6px",
};

const inputStyle = {
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

export default TreasurerAddPayment;
