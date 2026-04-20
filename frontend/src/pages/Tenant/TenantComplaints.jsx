import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getComplaints, getTenantProfile, deleteComplaint } from "../../services/api";

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-dark)" }}>{value}</div>
      </div>
      <div style={{ width: "40px", height: "40px", backgroundColor: `${color}1A`, color: color, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function TenantComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [complaintsData, profileData] = await Promise.all([
        getComplaints(),
        getTenantProfile()
      ]);
      setComplaints(complaintsData);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      // Fallback for demo
      setComplaints([
        { id: 1, title: "Roof leakage in bedroom", description: "Water dripping from ceiling during rain.", status: "Resolved", created_at: "2025-09-21", resolved_at: "2025-09-25", resolution_note: "Sealed the external roof crack." },
        { id: 2, title: "Noisy neighbors", description: "Loud music past 11 PM.", status: "In Progress", created_at: "2025-10-10" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setActionLoading(true);
    try {
      await deleteComplaint(id);
      setComplaints(complaints.filter(c => c.id !== id));
      alert("Complaint deleted successfully");
    } catch (error) {
      console.error("Failed to delete complaint:", error);
      alert("Delete failed: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const pending = total - resolved;

  return (
    <DashboardLayout
      role="Tenant"
      title="My Service Requests"
      userName={profile?.username || "Tenant"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
      headerAction={
        <Button variant="primary" onClick={() => navigate("/Tenant/addcomplaint")} disabled={actionLoading}>
          <i className="bi bi-plus-lg"></i> File New Complaint
        </Button>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "35px" }}>
        <SummaryCard title="Total Filed" value={total} icon="bi-journal-text" color="var(--primary)" />
        <SummaryCard title="Resolved" value={resolved} icon="bi-check-circle" color="#1a4d2e" />
        <SummaryCard title="Pending" value={pending} icon="bi-clock-history" color="#e67e22" />
      </div>

      <Card title="Complaint History" subtitle="Track the progress and resolutions of your submitted issues.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {complaints.map((c, i) => (
              <div key={i} className="glass-card" style={{ padding: "20px", backgroundColor: "#fcfcfc", border: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
                      {(() => {
                        const match = c.title?.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) {
                          const tag = match[1];
                          const text = match[2];
                          return (
                            <>
                              <span style={{ 
                                fontSize: "11px", fontWeight: "600", padding: "2px 8px", 
                                backgroundColor: tag.includes("Feedback") ? "#e3f2fd" : "#f1f3f5", 
                                color: tag.includes("Feedback") ? "#1976d2" : "#495057", 
                                borderRadius: "12px", marginRight: "8px", verticalAlign: "middle" 
                              }}>
                                {tag}
                              </span>
                              {text}
                            </>
                          );
                        }
                        return c.title;
                      })()}
                    </h4>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Submitted on {new Date(c.submitted_date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                      backgroundColor: c.status === 'Resolved' ? "#e2f2e5" : "#fff5f5",
                      color: c.status === 'Resolved' ? "#1a4d2e" : "#e03131",
                      textTransform: "uppercase"
                    }}>
                      {c.status}
                    </span>
                    {c.status !== 'Resolved' && (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          onClick={() => navigate(`/Tenant/complaints/edit/${c.id}`)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }}
                          title="Delete"
                          disabled={actionLoading}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.5", marginBottom: "15px" }}>{c.description}</p>

                {c.response && (
                  <div style={{ backgroundColor: "#f0f7f2", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #1a4d2e", marginBottom: "15px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#1a4d2e", marginBottom: "4px" }}>Management Response</div>
                    <div style={{ fontSize: "13px", color: "#444" }}>{c.response}</div>
                    {c.resolved_date && <div style={{ fontSize: "11px", color: "#888", marginTop: "5px" }}>Resolved on {new Date(c.resolved_date).toLocaleDateString()}</div>}
                  </div>
                )}

                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "15px", display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/Tenant/complaints/${c.id}`)}>
                    View Progress History
                  </Button>
                </div>
              </div>
            ))}
            {complaints.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <i className="bi bi-check2-circle" style={{ fontSize: "40px", color: "#eee", display: "block", marginBottom: "10px" }}></i>
                <div style={{ color: "var(--text-muted)" }}>You haven't filed any complaints yet.</div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TenantComplaints;
