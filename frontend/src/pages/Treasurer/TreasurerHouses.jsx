import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function TreasurerHouses() {
    const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#000",
  };
  const navigate = useNavigate();

  const houses = [
    {
      id: "H001",
      status: "Occupied",
      address: "123, Oak Street",
      rooms: 2,
      rent: "Rs. 10,000/mo",
      tenants: ["Tom John (Tenant)", "Sarah John (Spouse)"],
    },
    {
      id: "H002",
      status: "Occupied",
      address: "124, Oak Street",
      rooms: 3,
      rent: "Rs. 17,000/mo",
      tenants: [
        "Jack Brown (Tenant)",
        "Emma Brown (Spouse)",
        "Emma Brown (Spouse)",
      ],
    },
    {
      id: "H003",
      status: "Vacant",
      address: "125, Oak Street",
      rooms: 1,
      rent: "Rs. 48,000/yr",
      tenants: [],
    },
    {
      id: "H004",
      status: "Occupied",
      address: "54, Main Street",
      rooms: 2,
      rent: "Rs. 13,000/mo",
      tenants: ["Patrick Tompson (Tenant)"],
    },
  ];

  const menuItem = {
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
        Houses
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
            <div style={menuItem} onClick={() => navigate("/treasurer/overview")}>
              <i className="bi bi-map"></i> Overview
            </div>
            <div style={{ ...menuItem, color: "#1d4ed8", fontWeight: 600 }}>
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
            <div style={menuItemStyle} onClick={() => navigate("/treasurer/documents")}>
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
        <div
          style={{
            flex: 1,
            padding: "50px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
          }}
        >
          {houses.map((h) => (
            <div
              key={h.id}
              style={{
                backgroundColor: "#ccffcc",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid #6aa84f",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{h.id}</strong>
                  <div
                    style={{
                      backgroundColor:
                        h.status === "Occupied" ? "black" : "gray",
                      color: "white",
                      borderRadius: "8px",
                      padding: "2px 8px",
                      fontSize: "12px",
                      display: "inline-block",
                      marginLeft: "8px",
                    }}
                  >
                    {h.status}
                  </div>
                </div>
                <div>
                  <i
                    className="bi bi-pencil-square"
                    style={{ marginRight: "10px", cursor: "pointer" }}
                  ></i>
                  <i
                    className="bi bi-trash"
                    style={{ color: "red", cursor: "pointer" }}
                  ></i>
                </div>
              </div>

              <p>
                <strong>Address</strong>
                <br />
                {h.address}
              </p>

              <p>
                <strong>Rooms</strong> {h.rooms} <br />
                <strong>Rent</strong> {h.rent}
              </p>

              <p>
                <strong>Tenants({h.tenants.length})</strong>
                <br />
                {h.tenants.map((t, i) => (
                  <div key={i}>{t}</div>
                ))}
              </p>

              <button
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "6px",
                  borderRadius: "6px",
                  border: "1px solid #000",
                  backgroundColor: "#e0e0e0",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ height: "30px", backgroundColor: "#0b3d02" }} />
    </div>
  );
}

export default TreasurerHouses;
