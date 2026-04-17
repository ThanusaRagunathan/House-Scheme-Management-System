import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getMaintenances, deleteMaintenance, updateMaintenance } from "../../services/api";

function StatCard({ title, subtitle, value, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: "700", color: color || "var(--primary)" }}>{value}</div>
        {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "12px", backgroundColor: color ? `${color}1A` : "rgba(26, 77, 46, 0.1)", borderRadius: "10px", color: color || "var(--primary)", fontSize: "20px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function OwnerMaintenance() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getMaintenances();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load maintenance tasks:", error);
      // Fallback for demo
      setTasks([
        { id: 1, facility: "Pool", description: "Chemical balance check", date: "2025-09-11", cost: 500, status: "Paid" },
        { id: 2, facility: "Gym", description: "Equipment maintenance", date: "2025-09-15", cost: 1700, status: "Pending" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    setActionLoading(true);
    try {
        await deleteMaintenance(id);
        setTasks(tasks.filter(t => (t.task_id || t.id) !== id));
        alert("Task deleted successfully");
    } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
        await updateMaintenance(id, { taskStatus: newStatus });
        setTasks(tasks.map(t => (t.task_id || t.id) === id ? { ...t, task_status: newStatus } : t));
    } catch (error) {
        console.error("Failed to update status:", error);
        alert("Failed to update status: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const totalCost = tasks.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
  const pendingCount = tasks.filter(t => (t.task_status || t.status) !== 'Paid').length;

  return (
    <DashboardLayout
      role="owner"
      title={`Maintenance ${!loading ? `(${tasks.length})` : ''}`}
      headerAction={
        <Button variant="primary" onClick={() => navigate("/owner/createtask")} disabled={actionLoading}>
          <i className="bi bi-plus-circle"></i> Create Task
        </Button>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "40px" }}>
        <StatCard title="Total Tasks" value={loading ? "..." : tasks.length} subtitle={`${pendingCount} pending`} icon="bi-wrench" color="#1a4d2e" />
        <StatCard title="Total Expenditure" value={loading ? "..." : `Rs. ${totalCost.toLocaleString()}`} subtitle="All time" icon="bi-currency-dollar" color="#e67e22" />
        <StatCard title="Uptime" value="98%" subtitle="Facility availability" icon="bi-check2-square" color="#3498db" />
      </div>

      <Card title="All Maintenance Records" subtitle="Tracking repairs and facility upkeep costs.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>ID</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Facility</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Description</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Cost</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>M{String(t.task_id || t.id || t.maintenance_id || '').padStart(3, '0')}</td>
                     <td style={{ padding: "12px", fontSize: "14px" }}>{t.house_code ? t.house_code : (t.house_id ? `House #${t.house_id}` : (t.facility || 'N/A'))}</td>
                     <td style={{ padding: "12px", fontSize: "14px" }}>{t.description}</td>
                     <td style={{ padding: "12px", fontSize: "14px" }}>{t.scheduled_date ? new Date(t.scheduled_date).toLocaleDateString() : (t.date ? new Date(t.date).toLocaleDateString() : 'N/A')}</td>
                     <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>Rs. {parseFloat(t.cost || 0).toLocaleString()}</td>
                     <td style={{ padding: "12px" }}>
                       <span style={{ 
                         padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                         backgroundColor: (t.task_status || t.status) === "Paid" ? "#e2f2e5" : "#fff5f5",
                         color: (t.task_status || t.status) === "Paid" ? "#1a4d2e" : "#e03131",
                         textTransform: "uppercase"
                       }}>
                         {t.task_status || t.status}
                       </span>
                     </td>
                     <td style={{ padding: "12px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                           {(t.task_status || t.status) === "Pending" && (
                            <button 
                              onClick={() => handleStatusChange(t.task_id || t.id, "Paid")}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#1a4d2e" }}
                              title="Mark as Paid"
                            >
                              <i className="bi bi-check-circle-fill"></i>
                            </button>
                          )}
                          <button 
                            onClick={() => navigate(`/owner/maintenance/${t.task_id || t.id}`)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                            title="View"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button 
                            onClick={() => navigate(`/owner/maintenance/edit/${t.task_id || t.id}`)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(t.task_id || t.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No maintenance tasks found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default OwnerMaintenance;
