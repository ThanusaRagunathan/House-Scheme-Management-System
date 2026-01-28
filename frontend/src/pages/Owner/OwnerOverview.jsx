import Background from "../../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function StatCard({ title, subtitle, value }) {
  return (
    <div
      style={{
        backgroundColor: "#0b3d02",
        color: "white",
        borderRadius: "16px",
        padding: "20px",
        minHeight: "90px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left text */}
      <div>
        <div style={{ fontSize: "18px", fontWeight: 600 }}>
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "13px",
              opacity: 0.9,
              marginTop: "4px",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Right value */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function OwnerOverview() {
    const navigate = useNavigate();
  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#111",
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
          fontSize: "40px",
          fontWeight: 600,
        }}
      >
        Overview
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#d6d6d6",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sidebar Header */}
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
            {/* Active */}
            <div
              style={{
                ...menuItemStyle,
                color: "#1d4ed8",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-map"></i>
              Overview
            </div>

            <div style={menuItemStyle} onClick={()=>navigate("/owner/houses")}>
              <i className="bi bi-house"></i>
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

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
    padding: "20px",
  }}
>
  <StatCard
    title="Total Houses"
    subtitle="3 occupied, 1 vacant"
    value="4"
  />

  <StatCard
    title="Total Tenants"
    value="3"
  />

  <StatCard
    title="Open Issues"
    subtitle="3 complaints, 2 maintenance"
    value="3"
  />

  <StatCard
    title="Pending payments"
    subtitle="Requires attention"
    value="1"
  />

  <StatCard
    title="Payments made (this month)"
    value="2"
  />

  <StatCard
    title="Revenue (this month)"
    value="Rs. 23,000"
  />
</div>

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

export default OwnerOverview;
