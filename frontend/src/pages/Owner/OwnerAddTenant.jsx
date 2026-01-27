import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerAddTenant() {
  const navigate = useNavigate();

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #000",
    backgroundColor: "#e0e0e0",
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
        Add tenants
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

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={menuItemStyle} onClick={()=>navigate("/owner/overview")}>
              <i className="bi bi-map"></i>
              Overview
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/houses")}>
              <i className="bi bi-house"></i>
              Houses
            </div>

            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-people"></i>
              Tenants
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/payments")}>
              <i className="bi bi-currency-dollar"></i>
              Payments
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/maintenance")}>
              <i className="bi bi-wrench-adjustable"></i>
              Maintenance
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/complaints")}>
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

        {/* Main */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Form Card */}
          <div
            style={{
              backgroundColor: "#ccffcc",
              padding: "30px",
              borderRadius: "18px",
              width: "600px",
              border: "1px solid #6aa84f",
            }}
          >
            <div style={{ marginBottom: "14px" }}>
              <label>Full name</label>
              <input style={inputStyle} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label>Occupation</label>
                <input style={inputStyle} />
              </div>
              <div>
                <label>NIC</label>
                <input style={inputStyle} />
              </div>
              <div>
                <label>Phone Number</label>
                <input style={inputStyle} />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label>House Allocated</label>
                <input style={inputStyle} />
              </div>
              <div>
                <label>Date of birth</label>
                <input type="date" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Email address</label>
              <input style={inputStyle} />
            </div>

            {/* Family members */}
            <div style={{ marginBottom: "14px", fontWeight: 600 }}>
              Family Members
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <input placeholder="Name" style={inputStyle} />
              <input placeholder="Occupation" style={inputStyle} />
              <input placeholder="NIC" style={inputStyle} />
              <input type="date" style={inputStyle} />
            </div>

            <div
              style={{
                fontSize: "14px",
                marginBottom: "20px",
                cursor: "pointer",
              }}
            >
              + Add family member
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
                  padding: "8px 16px",
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
                  padding: "8px 20px",
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

export default OwnerAddTenant;
