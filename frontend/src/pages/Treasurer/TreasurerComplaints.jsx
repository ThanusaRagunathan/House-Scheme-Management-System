import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getComplaints, updateComplaint, deleteComplaint } from "../../services/api";

function SummaryCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-dark)" }}>{value}</div>
        {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "12px", backgroundColor: color ? `${color}1A` : "rgba(26, 77, 46, 0.1)", borderRadius: "10px", color: color || "var(--primary)", fontSize: "20px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function TreasurerComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      // Fallback for demo
      setComplaints([
        { id: 1, complaint_id: 1, title: "Leaking faucet", houseAddress: "H002", submitted_date: "2025-09-05", status: "In Progress" },
        { id: 2, complaint_id: 2, title: "Loud neighbors", houseAddress: "H004", submitted_date: "2025-09-13", status: "Open" },
        { id: 3, complaint_id: 3, title: "Roof broken", houseAddress: "H001", submitted_date: "2025-09-21", status: "Resolved" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await updateComplaint(id, { status: newStatus });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Action failed: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setActionLoading(true);
    try {
      await deleteComplaint(id);
      setComplaints(complaints.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete record:", error);
      alert("Action failed: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openCount = complaints.filter(c => c.status === 'Open' || c.status === 'open').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'in progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'resolved').length;

  return (
    <DashboardLayout
      role="treasurer"
      title="Complaints Management"



    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "40px" }}>
        <SummaryCard title="Open Complaints" value={loading ? "..." : openCount} subtitle="Requires attention" icon="bi-exclamation-circle" color="#e03131" />
        <SummaryCard title="In Progress" value={loading ? "..." : inProgressCount} subtitle="Being addressed" icon="bi-hourglass-split" color="#e67e22" />
        <SummaryCard title="Resolved" value={loading ? "..." : resolvedCount} subtitle="Successfully resolved" icon="bi-check2-circle" color="#1a4d2e" />
      </div>

      <Card title="All Tenant Complaints" subtitle="Monitoring and addressing issues reported by Tenants.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>ID</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Title</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>C{String(c.id || i + 1).padStart(3, '0')}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{c.houseAddress || 'N/A'}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{c.title}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{new Date(c.submitted_date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                        backgroundColor: (c.status === "Resolved" || c.status === "resolved") ? "#e2f2e5" : (c.status === "Open" || c.status === "open" ? "#fff5f5" : "#fff8e1"),
                        color: (c.status === "Resolved" || c.status === "resolved") ? "#1a4d2e" : (c.status === "Open" || c.status === "open" ? "#e03131" : "#f57c00"),
                        textTransform: "uppercase"
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        {c.status !== "Resolved" && c.status !== "resolved" && (
                          <button
                            onClick={() => handleStatusChange(c.id, "Resolved")}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#1a4d2e" }}
                            title="Resolve"
                            disabled={actionLoading}
                          >
                            <i className="bi bi-check-circle-fill"></i>
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/treasurer/complaints/${c.id}`)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          title="View"
                        >
                          <i className="bi bi-eye-fill"></i>
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
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No complaints found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TreasurerComplaints;
