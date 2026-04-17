import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Input, Button, TextArea, Select } from "../../components/FormElements";
import { getMaintenances, updateMaintenance } from "../../services/api";

function OwnerEditMaintenance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    houseId: "",
    description: "",
    scheduledDate: "",
    cost: "0",
    taskStatus: "Pending"
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await getMaintenances();
        const task = tasks.find(t => String(t.id) === String(id));
        if (task) {
          setFormData({
            houseId: task.house_id || task.houseId || "",
            description: task.description || task.desc || "",
            scheduledDate: task.scheduled_date ? task.scheduled_date.split('T')[0] : (task.scheduledDate ? task.scheduledDate.split('T')[0] : ""),
            cost: task.cost || "0",
            taskStatus: task.task_status || task.taskStatus || task.status || "Pending"
          });
        } else {
          setError("Maintenance task not found.");
        }
      } catch (err) {
        setError("Failed to load task details.");
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateMaintenance(id, {
        description: formData.description,
        scheduledDate: formData.scheduledDate || null,
        cost: parseFloat(formData.cost) || 0,
        taskStatus: formData.taskStatus
      });
      navigate("/owner/maintenance");
    } catch (err) {
      setError(err.message || "Failed to update maintenance task.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout role="owner" title="Edit Maintenance"><p>Loading details...</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title="Edit Maintenance Task"
      
      
      
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
            <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
                {error}
            </div>
        )}

        <Card 
          title="Update Scheduling" 
          subtitle={`Editing maintenance record M-${String(id).padStart(3, '0')}`}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => navigate("/owner/maintenance")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Save Task Changes</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <TextArea 
              label="Work Description" 
              placeholder="Describe the maintenance requirements in detail..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input 
                label="Scheduled Date" 
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
              />
              
              <Input 
                label="Cost (Rs.)" 
                type="number"
                placeholder="0" 
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
              />
            </div>

            <Select 
              label="Current Status"
              value={formData.taskStatus}
              onChange={(e) => setFormData({...formData, taskStatus: e.target.value})}
              options={[
                { label: "Pending", value: "Pending" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "Paid", value: "Paid" }
              ]}
            />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerEditMaintenance;
