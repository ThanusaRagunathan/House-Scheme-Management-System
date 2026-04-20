import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import CalendarModule from "../../components/CalendarModule";

function TenantCalendar() {
  return (
    <DashboardLayout role="Tenant" title="Calendar & Schedule">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          View your upcoming rent due dates and any scheduled maintenance or facility closures affecting your unit.
        </p>
      </div>
      <CalendarModule role="tenant" />
    </DashboardLayout>
  );
}

export default TenantCalendar;
