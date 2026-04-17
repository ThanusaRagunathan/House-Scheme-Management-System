import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Input, Button, TextArea, Select } from "../../components/FormElements";
import { createMaintenance, getHouses } from "../../services/api";

function OwnerCreateTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingHouses, setLoadingHouses] = useState(true);
  const [error, setError] = useState("");
  const [houses, setHouses] = useState([]);
  const [formData, setFormData] = useState({
    houseId: "",
    description: "",
    scheduledDate: "",
    cost: "0",
    taskStatus: "Pending"
  });

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const allHouses = await getHouses();
        setHouses(allHouses);
      } catch (err) {
        console.error("Failed to load houses:", err);
        // Fallback demo data
        setHouses([
          { id: 1, houseCode: "H-001", address: "123, Oak Street" },
          { id: 2, houseCode: "H-002", address: "124, Oak Street" },
        ]);
      } finally {
        setLoadingHouses(false);
      }
    };
    fetchHouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.houseId) {
      setError("Please select a house for this maintenance task.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please provide a work description.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await createMaintenance({
        houseId: parseInt(formData.houseId),
        description: formData.description,
        scheduledDate: formData.scheduledDate || null,
        cost: parseFloat(formData.cost) || 0,
        taskStatus: formData.taskStatus
      });
      navigate("/owner/maintenance");
    } catch (err) {
      setError(err.message || "Failed to create maintenance task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Create Maintenance Task"
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card
          title="Task Scheduling"
          subtitle="Assign maintenance for communal facilities or specific housing units."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => navigate("/owner/maintenance")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Dispatch Task</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <Select
              label="Select House / Unit"
              value={formData.houseId}
              onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
              required
              options={[
                { label: loadingHouses ? "Loading houses..." : "Select a house...", value: "" },
                ...houses.map(h => ({
                  label: `${h.houseCode || h.referenceCode} — ${h.address || ""}`,
                  value: h.id || h.house_id
                }))
              ]}
            />

            <TextArea
              label="Work Description"
              placeholder="Describe the maintenance requirements in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Scheduled Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />

              <Input
                label="Estimated Cost (Rs.)"
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>

            <Select
              label="Initial Status"
              value={formData.taskStatus}
              onChange={(e) => setFormData({ ...formData, taskStatus: e.target.value })}
              options={[
                { label: "Pending", value: "Pending" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ]}
            />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerCreateTask;
