import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card } from "../../components/FormElements";

function OwnerDrafts() {
  return (
    <DashboardLayout role="owner" title="Draft Notices">
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Draft Notifications Card */}
        <Card title="Draft Notifications" subtitle="General and urgent announcements pending broadcast.">
          <div style={{ textAlign: "center", padding: "30px", backgroundColor: "#f8f9fa", borderRadius: "8px", color: "var(--text-muted)" }}>
            <i className="bi bi-file-earmark-text" style={{ fontSize: "30px", marginBottom: "10px", display: "inline-block" }}></i>
            <p style={{ margin: 0 }}>No draft notifications found.</p>
          </div>
        </Card>

        {/* Draft Maintenance Logs Card */}
        <Card title="Draft Maintenance Logs" subtitle="Maintenance records waiting to be published.">
          <div style={{ textAlign: "center", padding: "30px", backgroundColor: "#f8f9fa", borderRadius: "8px", color: "var(--text-muted)" }}>
            <i className="bi bi-tools" style={{ fontSize: "30px", marginBottom: "10px", display: "inline-block" }}></i>
            <p style={{ margin: 0 }}>No draft maintenance logs found.</p>
          </div>
        </Card>

        {/* Draft Rent Reminders Card */}
        <Card title="Draft Rent Reminders" subtitle="Scheduled or unsent rent reminders.">
          <div style={{ textAlign: "center", padding: "30px", backgroundColor: "#f8f9fa", borderRadius: "8px", color: "var(--text-muted)" }}>
            <i className="bi bi-currency-dollar" style={{ fontSize: "30px", marginBottom: "10px", display: "inline-block" }}></i>
            <p style={{ margin: 0 }}>No draft rent reminders found.</p>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}

export default OwnerDrafts;
