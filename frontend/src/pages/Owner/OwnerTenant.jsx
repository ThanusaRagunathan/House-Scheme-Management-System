import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function OwnerTenant() {
    const navigate = useNavigate();
  const tenants = [
    {
      name: "Tom John",
      email: "tomjohn@gmail.com",
      phone: "077 123 4567",
      house: "H001",
    },
    {
      name: "Jack Brown",
      email: "jack123@gmail.com",
      phone: "077 548 5503",
      house: "H002",
    },
    {
      name: "Patrick Tompson",
      email: "pato@gmail.com",
      phone: "075 472 3652",
      house: "H004",
    },
  ];

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
      {/* Top Header */}
      <header
        style={{
          backgroundColor: "#0b3d02",
          color: "white",
          padding: "30px 40px",
          fontSize: "40px",
          fontWeight: 600,
        }}
      >
        Tenants
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

        {/* Main Content */}
        <div style={{ flex: 1, padding: "40px" }}>
          {/* Add tenants button */}
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
              onClick={()=>navigate("/owner/addtenant")}
            >
              + Add tenants
            </button>
          </div>

          {/* Table */}
          <table
            style={{
              width: "100%",
              marginTop: "30px",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>House</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tenants.map((t, index) => (
                <tr key={index} style={{ backgroundColor: "#e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{t.name}</td>
                  <td style={{ padding: "10px" }}>{t.email}</td>
                  <td style={{ padding: "10px" }}>{t.phone}</td>
                  <td style={{ padding: "10px" }}>{t.house}</td>
                  <td style={{ padding: "10px" }}>
                    <button
                      style={{
                        backgroundColor: "#ccc",
                        border: "none",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>

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
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          height: "30px",
          backgroundColor: "#0b3d02",
        }}
      />
    </div>
  );
}

export default OwnerTenant;
