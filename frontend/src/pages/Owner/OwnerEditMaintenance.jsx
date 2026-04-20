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
    taskStatus: "Pending",
    category: "Maintenance"
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
            taskStatus: task.task_status || task.taskStatus || task.status || "Pending",
            category: task.category || "Maintenance"
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

  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.description.trim()) errors.description = "Description is required";
    
    if (formData.scheduledDate) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.scheduledDate < today && formData.taskStatus === "Pending") {
        errors.scheduledDate = "Scheduled date cannot be in the past for pending tasks";
      }
    }

    const costNum = parseFloat(formData.cost);
    if (isNaN(costNum) || costNum < 0) {
      errors.cost = "Cost must be a positive number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please fix the validation errors below.");
      setLoading(false);
      return;
    }

    try {
      await updateMaintenance(id, {
        description: formData.description,
        scheduledDate: formData.scheduledDate || null,
        cost: parseFloat(formData.cost) || 0,
        taskStatus: formData.taskStatus,
        category: formData.category
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
              error={fieldErrors.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input 
                label="Scheduled Date" 
                type="date"
                value={formData.scheduledDate}
                error={fieldErrors.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
              />
              
              <Input 
                label="Cost (Rs.)" 
                type="number"
                placeholder="0" 
                value={formData.cost}
                error={fieldErrors.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
              />
            </div>

            <Select 
              label="Current Status"
              value={formData.taskStatus}
              onChange={(e) => setFormData({...formData, taskStatus: e.target.value})}
              options={[
                { label: "Requested (by Tenant)", value: "Requested" },
                { label: "Pending (Acknowledged)", value: "Pending" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "Paid", value: "Paid" }
              ]}
            />

            <Select 
              label="Expense Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              options={[
                { label: "Maintenance / Repair", value: "Maintenance" },
                { label: "Utility Bill", value: "Utility Bill" },
                { label: "Service Expense", value: "Service Expense" },
                { label: "Other", value: "Other" }
              ]}
            />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerEditMaintenance;
