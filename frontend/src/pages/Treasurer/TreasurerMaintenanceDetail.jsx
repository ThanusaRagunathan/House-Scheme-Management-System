import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getMaintenances, updateMaintenance } from "../../services/api";

function TreasurerMaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
            facility: "Swimming Pool",
            description: "Quarterly chemical balance check and filter cleaning.",
            date: "2025-09-11",
            cost: 500,
            status: "Pending",
            assignedVendor: "PureWater Solutions",
            priority: "High",
            frequency: "Quarterly"
          });
        }
      } catch (error) {
        console.error("Failed to fetch maintenance task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateMaintenance(id, { status: newStatus });
      setTask({ ...task, status: newStatus });
      alert("Status updated to " + newStatus);
    } catch (error) {
      alert("Failed to update status: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <DashboardLayout role="treasurer" title="Maintenance Detail"><p>Loading...</p></DashboardLayout>;
  if (!task) return <DashboardLayout role="treasurer" title="Maintenance Detail"><p>Task not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="treasurer"
      title={`Maintenance Detail - M-${String(task.id).padStart(3, '0')}`}
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/treasurer/maintenance")}>
          <i className="bi bi-arrow-left"></i> Back to Schedule
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Task Overview" subtitle={`Facility: ${task.facility}`}>
             <div style={{ marginBottom: "20px" }}>
                <span style={{ 
                  padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                  backgroundColor: task.status === "Paid" || task.status === "Completed" ? "#e2f2e5" : "#fff5f5",
                  color: task.status === "Paid" || task.status === "Completed" ? "#1a4d2e" : "#e03131",
                  textTransform: "uppercase",
                  marginRight: "10px"
                }}>
                  {task.status}
                </span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Due: {new Date(task.date).toLocaleDateString()}</span>
             </div>

             <div style={{ marginBottom: "25px" }}>
                <div style={{ fontWeight: "700", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Work Description</div>
                <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "#444" }}>{task.description || task.desc}</p>
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "12px" }}>
                <div>
                   <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Assigned Vendor</div>
                   <div style={{ fontWeight: "600" }}>{task.assignedVendor || "General Staff"}</div>
                </div>
                <div>
                   <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Cost</div>
                   <div style={{ fontWeight: "700", color: "var(--primary)" }}>Rs. {parseFloat(task.cost).toLocaleString()}</div>
                </div>
                <div>
                   <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Priority</div>
                   <div style={{ fontWeight: "600", color: task.priority === 'High' ? '#e03131' : 'inherit' }}>{task.priority || "Medium"}</div>
                </div>
                <div>
                   <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Frequency</div>
                   <div style={{ fontWeight: "600" }}>{task.frequency || "One-time"}</div>
                </div>
             </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Financial Actions">
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                 Verify the work completion before marking as fulfilled or releasing payments.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                 <Button variant="primary" onClick={() => handleStatusUpdate("Paid")} disabled={updating || task.status === "Paid"}>
                    <i className="bi bi-check-circle"></i> Mark as Paid
                 </Button>
                 <Button variant="secondary" onClick={() => navigate(`/treasurer/addcost?edit=${id}`)}>
                    <i className="bi bi-pencil"></i> Edit Details
                 </Button>
              </div>
           </Card>

           <Card title="Report Summary">
              <div style={{ textAlign: "center", padding: "10px" }}>
                 <div style={{ fontSize: "24px", color: "#bbb", marginBottom: "10px" }}><i className="bi bi-file-earmark-bar-graph"></i></div>
                 <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>No technical report has been uploaded for this task yet.</p>
                 <Button variant="secondary" size="sm" style={{ width: "100%" }}>Upload Report</Button>
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerMaintenanceDetail;
