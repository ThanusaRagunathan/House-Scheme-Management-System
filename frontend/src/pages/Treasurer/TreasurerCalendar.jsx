import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import CalendarModule from "../../components/CalendarModule";

function TreasurerCalendar() {
  return (
    <DashboardLayout role="treasurer" title="Financial Calendar">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Monitor system-wide active due dates, paid invoices, and related maintenance tasks locking community resources.
        </p>
      </div>
      <CalendarModule role="treasurer" />
    </DashboardLayout>
  );
}

export default TreasurerCalendar;
