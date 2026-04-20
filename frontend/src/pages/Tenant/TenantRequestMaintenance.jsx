import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button, TextArea, Select } from "../../components/FormElements";
import { createMaintenance, getTenantProfile } from "../../services/api";

function TenantRequestMaintenance() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    category: "Plumbing",
    description: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTenantProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.description.trim()) {
      errors.description = "Please describe the issue in detail";
    } else if (formData.description.length < 10) {
      errors.description = "Description is too short. Please provide more detail.";
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
      setLoading(false);
      return;
    }

    try {
      // We combine category and description for the backend
      const fullDescription = `[${formData.category}] ${formData.description}`;
      
      await createMaintenance({
        description: fullDescription,
        taskStatus: "Requested"
      });
      
      navigate("/Tenant/maintenance");
    } catch (err) {
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="Tenant"
      title="Request Maintenance"
      userName={profile?.username || "Tenant"}
      userInitials={profile?.username?.charAt(0) || "T"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9", fontWeight: "600" }}>
            <i className="bi bi-exclamation-circle-fill" style={{ marginRight: "10px" }}></i> {error}
          </div>
        )}

        <Card
          title="Maintenance Service Request"
          subtitle="Report an issue in your housing unit. Our team will review and schedule a repair."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
              <Button variant="secondary" onClick={() => navigate("/Tenant/maintenance")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Submit Request</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <Select
              label="Issue Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { label: "Plumbing (Leaks, Taps, Toilets)", value: "Plumbing" },
                { label: "Electrical (Lights, Switches, Wiring)", value: "Electrical" },
                { label: "Carpentry (Doors, Windows, Furniture)", value: "Carpentry" },
                { label: "Painting / Walls", value: "Painting" },
                { label: "Appliance Repair", value: "Appliance" },
                { label: "Other", value: "Other" },
              ]}
              required
            />

            <TextArea
              label="Problem Description"
              placeholder="Please explain exactly what's broken and where it is located..."
              value={formData.description}
              error={fieldErrors.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              disabled={loading}
            />

            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px", border: "1px solid #eee", marginTop: "10px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <i className="bi bi-info-circle" style={{ color: "var(--primary)", marginTop: "2px" }}></i>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  <strong>Next Steps:</strong> Once submitted, the management will review your request and set a scheduled date. You can track the status of your request on the Maintenance Schedule page.
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TenantRequestMaintenance;
