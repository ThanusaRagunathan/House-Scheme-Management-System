import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import CalendarModule from "../../components/CalendarModule";

function OwnerCalendar() {
  return (
    <DashboardLayout role="owner" title="Master Schedule">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Track global housing scheme operations, including scheduled maintenance events, facility bookings, and rent collection milestones.
        </p>
      </div>
      <CalendarModule role="owner" />
    </DashboardLayout>
  );
}

export default OwnerCalendar;
