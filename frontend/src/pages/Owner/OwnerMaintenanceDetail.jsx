import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getMaintenances } from "../../services/api";

function OwnerMaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const tasks = await getMaintenances();
        const found = tasks.find(t => String(t.id) === String(id));
        if (found) {
          setTask(found);
        } else {
          // Fallback demo data
          setTask({
            id: id,
            facility: "Elevator A",
            description: "Monthly safety inspection and lubrication of gear system.",
            date: "2025-09-15",
            cost: 1200,
            status: "Completed",
            assignedVendor: "Vertical Pro Elevators",
            priority: "Medium",
            performanceNote: "Efficient service, no issues found."
          });
        }
      } catch (error) {
        console.error("Failed to fetch maintenance details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <DashboardLayout role="owner" title="Maintenance Detail"><p>Loading...</p></DashboardLayout>;
  if (!task) return <DashboardLayout role="owner" title="Maintenance Detail"><p>Task not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title={`Maintenance Record - #${String(task.id).padStart(3, '0')}`}
      
      
      
    >
      <div style={{ marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/owner/maintenance")}>
          <i className="bi bi-arrow-left"></i> Back to History
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title={task.facility} subtitle={`Date of Service: ${new Date(task.date).toLocaleDateString()}`}>
             <div style={{ marginBottom: "20px" }}>
                <span style={{ 
                  padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                  backgroundColor: task.status === "Completed" || task.status === "Paid" ? "#e2f2e5" : "#fff8e1",
                  color: task.status === "Completed" || task.status === "Paid" ? "#1a4d2e" : "#f57c00",
                  textTransform: "uppercase",
                  marginRight: "10px"
                }}>
                  {task.status}
                </span>
             </div>

             <div style={{ marginBottom: "25px" }}>
                <div style={{ fontWeight: "700", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Work Summary</div>
                <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "#444" }}>{task.description || task.desc}</p>
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "12px" }}>
                <div>
                   <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Vendor / Staff</div>
                   <div style={{ fontWeight: "600" }}>{task.assignedVendor || "General Staff"}</div>
                </div>
                <div>
                   <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Service Cost</div>
                   <div style={{ fontWeight: "700", color: "var(--primary)" }}>Rs. {parseFloat(task.cost).toLocaleString()}</div>
                </div>
             </div>
          </Card>

          <Card title="Notes & Feedback">
             <div style={{ backgroundColor: "rgba(26, 77, 46, 0.05)", padding: "15px", borderRadius: "10px", borderLeft: "4px solid var(--primary)" }}>
                <div style={{ fontWeight: "700", fontSize: "12px", color: "var(--primary)", textTransform: "uppercase", marginBottom: "5px" }}>Manager's Note</div>
                <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>{task.performanceNote || "The task was completed according to safety standards. No major repairs required this month."}</p>
             </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Quick Info">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Priority:</span>
                    <span style={{ fontWeight: "600" }}>{task.priority || "Medium"}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Frequency:</span>
                    <span style={{ fontWeight: "600" }}>{task.frequency || "Monthly"}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Reference:</span>
                    <span style={{ fontWeight: "600" }}>MNT-{task.id}</span>
                 </div>
              </div>
           </Card>

           <Card title="Management">
              <Button variant="secondary" style={{ width: "100%", marginBottom: "10px" }} onClick={() => navigate('/owner/createtask?edit=' + id)}>
                 Edit Record
              </Button>
              <Button variant="secondary" style={{ width: "100%", color: "#e03131" }} onClick={() => alert("Maintenance deleted")}>
                 Delete Record
              </Button>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OwnerMaintenanceDetail;
