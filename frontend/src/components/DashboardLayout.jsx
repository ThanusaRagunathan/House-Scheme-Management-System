import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, role, title, userName, userInitials, userRoleLabel }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f0f2f5" }}>
      <Sidebar role={role} />
      
      <main style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ height: "80px", backgroundColor: "white", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", position: "sticky", top: 0, zIndex: 90 }}>
          <h2 style={{ fontSize: "22px" }}>{title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
             <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>{userName}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{userRoleLabel}</div>
             </div>
             <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
               {userInitials}
             </div>
          </div>
        </header>

        <div style={{ padding: "40px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
