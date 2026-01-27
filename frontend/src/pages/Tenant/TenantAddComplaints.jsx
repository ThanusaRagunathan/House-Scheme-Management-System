import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TenantAddComplaints() {
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
        Add complaints
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

            <div style={menuItemStyle} onClick={() => navigate("/tenant/payments")}>
              <i className="bi bi-currency-dollar"></i> Payments
            </div>

            <div style={menuItemStyle} onClick={() => navigate("/tenant/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i> Maintenance
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 600,
              }}
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
            {/* House */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: 600 }}>House</label>
              <input
                type="text"
                style={inputStyle}
              />
            </div>

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: 600 }}>Title</label>
              <input
                type="text"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontWeight: 600 }}>Description</label>
              <textarea
                rows="5"
                style={{
                  ...inputStyle,
                  resize: "none",
                }}
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  border: "1px solid #000",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                style={{
                  padding: "6px 18px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#0b3d02",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
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
  padding: "8px",
  marginTop: "6px",
  borderRadius: "4px",
  border: "1px solid #777",
};

export default TenantAddComplaints;
