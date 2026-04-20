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
    taskStatus: "Pending",
    type: "House", // "House" or "Facility"
    facility: "",
    category: "Maintenance"
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (formData.type === "House" && !formData.houseId) errors.houseId = "Please select a house / unit";
    if (formData.type === "Facility" && !formData.facility) errors.facility = "Please select a facility";
    if (!formData.description.trim()) errors.description = "Work description is required";
    
    if (formData.scheduledDate) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.scheduledDate < today) {
        errors.scheduledDate = "Scheduled date cannot be in the past";
      }
    }

    const costNum = parseFloat(formData.cost);
    if (isNaN(costNum) || costNum < 0) {
      errors.cost = "Estimated cost must be a positive number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please fix the validation errors below.");
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('[aria-invalid="true"]');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setLoading(true);

    try {
      await createMaintenance({
        houseId: formData.type === "House" ? parseInt(formData.houseId) : null,
        facility: formData.type === "Facility" ? formData.facility : null,
        description: formData.description,
        scheduledDate: formData.scheduledDate || null,
        cost: parseFloat(formData.cost) || 0,
        taskStatus: formData.taskStatus,
        category: formData.category
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
            {/* Type Toggle */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "25px", backgroundColor: "#f8f9fa", padding: "5px", borderRadius: "10px" }}>
              {["House", "Facility"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer",
                    fontSize: "14px", fontWeight: "600",
                    backgroundColor: formData.type === t ? "white" : "transparent",
                    color: formData.type === t ? "var(--primary)" : "var(--text-muted)",
                    boxShadow: formData.type === t ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {t === "House" ? <><i className="bi bi-house-door" style={{ marginRight: "5px" }}></i> Housing Unit</> : <><i className="bi bi-water" style={{ marginRight: "5px" }}></i> Shared Facility</>}
                </button>
              ))}
            </div>

            {formData.type === "House" ? (
              <Select
                label="Select House / Unit"
                value={formData.houseId}
                error={fieldErrors.houseId}
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
            ) : (
              <Select
                label="Select Facility"
                value={formData.facility}
                error={fieldErrors.facility}
                onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                required
                options={[
                  { label: "Select a facility...", value: "" },
                  { label: "Swimming Pool", value: "Swimming Pool" },
                  { label: "Fitness Gym", value: "Gym" },
                  { label: "Garden / Landscape", value: "Garden" },
                  { label: "Community Center", value: "Community Center" },
                  { label: "Kids Playground", value: "Playground" },
                  { label: "Security Gate", value: "Security Gate" },
                  { label: "Other / Common Area", value: "Other" },
                ]}
              />
            )}

            <TextArea
              label="Work Description"
              placeholder="Describe the maintenance requirements in detail..."
              value={formData.description}
              error={fieldErrors.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Scheduled Date"
                type="date"
                value={formData.scheduledDate}
                error={fieldErrors.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />

              <Input
                label="Estimated Cost (Rs.)"
                type="number"
                placeholder="0"
                value={formData.cost}
                error={fieldErrors.cost}
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

          <Select
            label="Expense Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

export default OwnerCreateTask;
