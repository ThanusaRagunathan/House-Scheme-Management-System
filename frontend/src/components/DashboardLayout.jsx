import Sidebar from "./Sidebar";
import { getUserFromToken } from "../utils/auth";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children, role, title, userName, userInitials, userRoleLabel, headerAction }) {
  const navigate = useNavigate();
  const user = useMemo(() => getUserFromToken() || {}, []);

  const displayUserName = userName || user.username || "User";
  const displayInitials = userInitials || user.initials || "U";
  const displayRoleLabel = userRoleLabel || (role ? role.charAt(0).toUpperCase() + role.slice(1) : "Member");

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f0f2f5" }}>
      <Sidebar role={role} />
      
      <main style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ height: "80px", backgroundColor: "white", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", position: "sticky", top: 0, zIndex: 90 }}>
          <h2 style={{ fontSize: "22px" }}>{title}</h2>
          {headerAction && <div>{headerAction}</div>}
        </header>

        <div style={{ padding: "40px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
