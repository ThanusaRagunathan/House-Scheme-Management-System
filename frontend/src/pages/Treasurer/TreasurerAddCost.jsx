import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card, Select } from "../../components/FormElements";
import { createMaintenance } from "../../services/api";

function TreasurerAddCost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    facility: "",
    description: "",
    cost: "",
    date: new Date().toISOString().split('T')[0],
    status: "Completed",
    category: "Utility Bill"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createMaintenance({
        ...formData,
        cost: parseFloat(formData.cost)
      });
      navigate("/treasurer/maintenance");
    } catch (err) {
      setError(err.message || "Failed to record expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="treasurer" title="Record Household Cost">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card 
          title="Expense Entry" 
          subtitle="Record utility bills, maintenance costs, and service expenses paid by the treasury."
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Facility / Item"
                placeholder="e.g. Community Gate"
                value={formData.facility}
                onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                required
              />
              <Input
                label="Amount (Rs.)"
                type="number"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Date of Payment"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Select
                label="Category Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { label: "Completed", value: "Completed" },
                  { label: "Pending", value: "Pending" },
                  { label: "Planned", value: "Planned" }
                ]}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Select
                label="Expense Type"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { label: "Utility Bill", value: "Utility Bill" },
                  { label: "Maintenance", value: "Maintenance" },
                  { label: "Service Expense", value: "Service Expense" },
                  { label: "Other", value: "Other" }
                ]}
              />
              <div /> {/* Spacer */}
            </div>

            <Input
              label="Detailed Description"
              placeholder="Provide more context about this expense..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <Button variant="secondary" onClick={() => navigate("/treasurer/maintenance")} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Save Expense
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerAddCost;
