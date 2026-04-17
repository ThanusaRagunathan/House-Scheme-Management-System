import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card } from "../../components/FormElements";
import { getMaintenances, getTenantProfile } from "../../services/api";

function SummaryCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-dark)" }}>{value}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{subtitle}</div>
      </div>
      <div style={{ width: "45px", height: "45px", backgroundColor: `${color}1A`, color: color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function TenantMaintenance() {
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintenanceData, profileData] = await Promise.all([
          getMaintenances(),
          getTenantProfile()
        ]);
        setMaintenance(maintenanceData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch maintenance tasks:", error);
        // Fallback for demo
        setMaintenance([
          { maintenance_id: 1, facility: "Swimming Pool", description: "Water filtration system repair", date: "2025-11-15", status: "Scheduled", cost: 0 },
          { maintenance_id: 2, facility: "Elevator B", description: "Monthly safety inspection", date: "2025-10-20", status: "Completed", cost: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completed = maintenance.filter(m => m.status === 'Completed').length;
  const scheduled = maintenance.filter(m => m.status === 'Scheduled').length;
  const pending = maintenance.length - completed - scheduled;

  return (
    <DashboardLayout
      role="Tenant"
      title="Maintenance Schedule"
      userName={profile?.username || "Tenant"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "35px" }}>
        <SummaryCard title="In Progress" value={pending} subtitle="Active work" icon="bi-tools" color="var(--primary)" />
        <SummaryCard title="Scheduled" value={scheduled} subtitle="Upcoming tasks" icon="bi-calendar-event" color="#3498db" />
        <SummaryCard title="Completed" value={completed} subtitle="Last 30 days" icon="bi-check2-square" color="#1a4d2e" />
      </div>

      <Card title="Community Maintenance Updates" subtitle="View scheduled maintenance and facility improvements in the housing scheme.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading schedule...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Facility / Area</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Description</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((m, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "15px 10px", fontSize: "14px", fontWeight: "600" }}>{m.facility}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px", color: "#555" }}>{m.description}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px" }}>{new Date(m.date).toLocaleDateString()}</td>
                    <td style={{ padding: "15px 10px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                        backgroundColor: m.status === 'Completed' ? "#e2f2e5" : (m.status === 'Scheduled' ? "#e3f2fd" : "#fff8e1"),
                        color: m.status === 'Completed' ? "#1a4d2e" : (m.status === 'Scheduled' ? "#1976d2" : "#f57c00"),
                        textTransform: "uppercase"
                      }}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {maintenance.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No maintenance tasks recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div style={{ marginTop: "30px", backgroundColor: "white", padding: "20px", borderRadius: "12px", border: "1px dashed #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#fcf0f0", color: "#e03131", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700" }}>Notice an issue within your unit?</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Individual house maintenance should be requested via the Complaints portal.</div>
          </div>
          <button
            onClick={() => navigate('/Tenant/addcomplaint')}
            style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", background: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            Go to Complaints
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TenantMaintenance;
