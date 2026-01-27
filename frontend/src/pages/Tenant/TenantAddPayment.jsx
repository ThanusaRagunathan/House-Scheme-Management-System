import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantAddPayment() {
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
        Add payments
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

        {/* Main Content */}
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
              borderRadius: "20px",
              width: "520px",
              border: "1px solid #6aa84f",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label>Name</label>
                <input style={inputStyle} />
              </div>

              <div>
                <label>House Address</label>
                <input style={inputStyle} />
              </div>

              <div style={{ gridColumn: "1 / 3" }}>
                <label>Amount</label>
                <input style={{ ...inputStyle, width: "120px" }} />
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <span
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                Only online payments
              </span>
              <div style={{ marginTop: "6px", fontSize: "13px" }}>
                for offline payments contact the treasurer
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button style={cancelBtn} onClick={()=>navigate("/tenant/payments")}>Cancel</button>
              <button style={saveBtn}>Continue</button>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "6px",
  marginTop: "4px",
  backgroundColor: "#e0e0e0",
  border: "1px solid #999",
};

const cancelBtn = {
  padding: "6px 16px",
  borderRadius: "8px",
  border: "1px solid #000",
  backgroundColor: "white",
  cursor: "pointer",
};

const saveBtn = {
  padding: "6px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0b3d02",
  color: "white",
  cursor: "pointer",
};

export default TenantAddPayment;
