import { useNavigate, useLocation } from "react-router-dom";

function SidebarItem({ icon, label, path, active }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "var(--transition)",
        backgroundColor: active ? "rgba(26, 77, 46, 0.1)" : "transparent",
        color: active ? "var(--primary)" : "var(--text-muted)",
        fontWeight: active ? "600" : "400",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: "18px" }}></i>
      <span style={{ fontSize: "15px" }}>{label}</span>
    </div>
  );
}

const SIDEBAR_CONFIG = {
  owner: [
    { icon: "bi-grid-1x2", label: "Overview", path: "/owner/overview" },
    { icon: "bi-house", label: "Houses", path: "/owner/houses" },
    { icon: "bi-people", label: "Tenants", path: "/owner/tenants" },
    { icon: "bi-cash-stack", label: "Payments", path: "/owner/payments" },
    { icon: "bi-tools", label: "Maintenance", path: "/owner/maintenance" },
    { icon: "bi-chat-dots", label: "Complaints", path: "/owner/complaints" },
    { icon: "bi-file-earmark-text", label: "Documents", path: "/owner/documents" },
    { icon: "bi-bell", label: "Notifications", path: "/owner/notification" },
    { icon: "bi-graph-up", label: "Reports", path: "/owner/report" },
  ],
  treasurer: [
    { icon: "bi-grid-1x2", label: "Overview", path: "/treasurer/overview" },
    { icon: "bi-house", label: "Houses", path: "/treasurer/houses" },
    { icon: "bi-people", label: "Tenants", path: "/treasurer/tenants" },
    { icon: "bi-cash-stack", label: "Payments", path: "/treasurer/payments" },
    { icon: "bi-tools", label: "Maintenance", path: "/treasurer/maintenance" },
    { icon: "bi-chat-dots", label: "Complaints", path: "/treasurer/complaints" },
    { icon: "bi-file-earmark-text", label: "Documents", path: "/treasurer/documents" },
    { icon: "bi-bell", label: "Notifications", path: "/treasurer/notifications" },
    { icon: "bi-graph-up", label: "Financial Reports", path: "/treasurer/reports" },
  ],
  tenant: [
    { icon: "bi-grid-1x2", label: "Overview", path: "/tenant/overview" },
    { icon: "bi-cash-stack", label: "Payments", path: "/tenant/payments" },
    { icon: "bi-tools", label: "Maintenance", path: "/tenant/maintenance" },
    { icon: "bi-chat-dots", label: "Complaints", path: "/tenant/complaints" },
    { icon: "bi-file-earmark-text", label: "Documents", path: "/tenant/documents" },
    { icon: "bi-bell", label: "Notifications", path: "/tenant/notification" },
  ]
};

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = SIDEBAR_CONFIG[role.toLowerCase()] || [];

  return (
    <aside style={{ width: "280px", backgroundColor: "white", borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 100 }}>
      <div style={{ padding: "30px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <h1 style={{ color: "var(--primary)", fontSize: "24px", cursor: "pointer" }} onClick={() => navigate('/')}>HSMS</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "capitalize" }}>{role} Portal</p>
      </div>

      <nav style={{ flex: 1, padding: "20px 15px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {items.map((item) => (
          <SidebarItem 
            key={item.path}
            icon={item.icon} 
            label={item.label} 
            path={item.path} 
            active={location.pathname === item.path} 
          />
        ))}
      </nav>

      <div style={{ padding: "20px", borderTop: "1px solid #f0f0f0" }}>
        <button 
          onClick={() => {
            localStorage.removeItem("token");
            navigate('/login');
          }}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "#fff5f5", color: "#e03131", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", border: "none", cursor: "pointer" }}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </aside>
  );
}
