import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button, Input, TextArea } from "../../components/FormElements";
import { createComplaint, getTenantProfile } from "../../services/api";

function TenantAddComplaints() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createComplaint({
        ...formData,
        house_id: profile?.house_id, // Assuming profile includes the house_id
      });
      navigate("/Tenant/complaints");
    } catch (err) {
      setError(err.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="Tenant"
      title="File a Service Request"
      userName={profile?.username || "Tenant"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card
          title="Submit New Complaint"
          subtitle="Please provide clear details about the issue so we can resolve it promptly."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => navigate("/Tenant/complaints")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Submit Ticket</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Subject / Topic"
              placeholder="e.g. Broken water pipe, Electrical issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
            />

            <TextArea
              label="Detailed Description"
              placeholder="Explain the problem, when it started, and its exact location."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              disabled={loading}
            />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TenantAddComplaints;
