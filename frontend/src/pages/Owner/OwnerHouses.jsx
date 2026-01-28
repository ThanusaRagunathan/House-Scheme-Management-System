import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function HouseCard({ house }) {
  return (
    <div
      style={{
        backgroundColor: "#ccffcc",
        borderRadius: "16px",
        padding: "16px",
        border: "1px solid #6aa84f",
        fontSize: "14px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600 }}>{house.code}</div>

        <div
          style={{
            backgroundColor:
              house.status === "Occupied" ? "#000" : "#444",
            color: "white",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        >
          {house.status}
        </div>
      </div>

      {/* Details */}
      <div style={{ marginTop: "12px", color: "#333" }}>
        <div>
          <strong>Address:</strong> {house.address}
        </div>
        <div>
          <strong>Rooms:</strong> {house.rooms}
        </div>
        <div>
          <strong>Rent:</strong> {house.rent}
        </div>
      </div>

      {/* Tenants */}
      {house.tenants.length > 0 && (
        <div style={{ marginTop: "12px", color: "#333" }}>
          <strong>Tenants:</strong>
          <ul style={{ margin: "4px 0 0 20px" }}>
            {house.tenants.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button
          style={{
            backgroundColor: "#0b3d02",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          View
        </button>

        <i
          className="bi bi-pencil-square"
          style={{ cursor: "pointer", fontSize: "18px" }}
        ></i>

        <i
          className="bi bi-trash"
          style={{ cursor: "pointer", fontSize: "18px", color: "red" }}
        ></i>
      </div>
    </div>
  );
}

function OwnerHouses() {
    const navigate = useNavigate();
    const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#111",
    cursor: "pointer",
    fontSize: "14px",
  };
  const houses = [
    {
      code: "H001",
      status: "Occupied",
      address: "123, Oak Street",
      rooms: 2,
      rent: "Rs. 10,000/mo",
      tenants: ["Tom John (Tenant)", "Sarah John (Spouse)"],
    },
    {
      code: "H002",
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
      code: "H003",
      status: "Vacant",
      address: "125, Oak Street",
      rooms: 1,
      rent: "Rs. 48,000/yr",
      tenants: [],
    },
    {
      code: "H004",
      status: "Occupied",
      address: "54, Main Street",
      rooms: 2,
      rent: "Rs. 13,000/mo",
      tenants: ["Patrick Tompson (Tenant)"],
    },
  ];

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
        >  {/* Top Header */}
      <header
        style={{
          backgroundColor: "#0b3d02",
          color: "white",
          padding: "30px 40px",
          fontSize: "40px",
          fontWeight: 600,
        }}
      >
        Houses
      </header>

      {/* Content Area */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar placeholder */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
            <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "#0b3d02",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
              }}
            >
              <i className="bi bi-buildings"></i>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>
                Property Manager
              </div>
              <div style={{ fontSize: "13px", color: "#555" }}>
                Owner Portal
              </div>
            </div>
          </div>

          {/* Menu */}
          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={menuItemStyle} onClick={()=>navigate("/owner/overview")}>
              <i className="bi bi-house"></i>
              Overview
            </div>

            {/* Active */}
            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-map"></i>
              Houses
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/tenants")}>
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
        <div style={{ flex: 1, padding: "30px" }}>
          {/* Add house button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                backgroundColor: "#0b3d02",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={()=>navigate("/owner/addhouse")}
            >
              + Add house
            </button>
          </div>

          {/* House cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "24px",
              marginTop: "30px",
            }}
          >
            {houses.map((house) => (
              <HouseCard key={house.code} house={house} />
            ))}
          </div>
        </div>
      </div>

      
      <footer
        style={{
          height: "30px",
          backgroundColor: "#0b3d02",
        }}
      />
    </div>
  );
}

export default OwnerHouses;
