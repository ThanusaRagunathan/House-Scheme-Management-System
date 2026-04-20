import { useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import { useMemo } from "react";

function SidebarItem({ icon, label, path, active }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 20px",
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
    { icon: "bi-people", label: "Tenants", path: "/owner/Tenants" },
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
    { icon: "bi-people", label: "Tenants", path: "/treasurer/Tenants" },
    { icon: "bi-cash-stack", label: "Payments", path: "/treasurer/payments" },
    { icon: "bi-tools", label: "Maintenance", path: "/treasurer/maintenance" },
    { icon: "bi-chat-dots", label: "Complaints", path: "/treasurer/complaints" },
    { icon: "bi-file-earmark-text", label: "Documents", path: "/treasurer/documents" },
    { icon: "bi-bell", label: "Notifications", path: "/treasurer/notifications" },
    { icon: "bi-graph-up", label: "Financial Reports", path: "/treasurer/reports" },
  ],
  tenant: [
    { icon: "bi-grid-1x2", label: "Overview", path: "/Tenant/overview" },
    { icon: "bi-cash-stack", label: "Payments", path: "/Tenant/payments" },
    { icon: "bi-tools", label: "Maintenance", path: "/Tenant/maintenance" },
    { icon: "bi-chat-dots", label: "Complaints", path: "/Tenant/complaints" },
    { icon: "bi-file-earmark-text", label: "Documents", path: "/Tenant/documents" },
    { icon: "bi-bell", label: "Notifications", path: "/Tenant/notification" },
  ]
};

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useMemo(() => getUserFromToken() || {}, []);
  const items = SIDEBAR_CONFIG[role.toLowerCase()] || [];

  const initials = user.initials || (user.username ? user.username.split(/[._\s]/).map(n => n[0]).join('').toUpperCase().substring(0, 2) : "U");
  const displayRoleLabel = (role ? role.charAt(0).toUpperCase() + role.slice(1) : "Member") + " Portal";

  return (
    <aside style={{ width: "280px", backgroundColor: "white", borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 100 }}>
      <div
        onClick={() => navigate(`/${role.toLowerCase()}/profile`)}
        style={{ padding: "20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
      >
        <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px" }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.username || "User"}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "capitalize" }}>{displayRoleLabel}</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "10px 15px", display: "flex", flexDirection: "column", gap: "2px" }}>
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
