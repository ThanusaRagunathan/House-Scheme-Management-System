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
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    type: "Complaint",
    category: "Maintenance",
    title: "",
    description: "",
    attachment: null
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
    
    if (!formData.title.trim()) errors.title = "Subject is required";
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      errors.description = `Description is too long (${formData.description.length}/1000 characters)`;
    }

    if (formData.attachment) {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(formData.attachment.type)) {
        errors.attachment = "Only JPG and PNG images are allowed";
      } else if (formData.attachment.size > maxSize) {
        errors.attachment = "Image size must be less than 5MB";
      }
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
      setError("Please fix the errors below before submitting.");
      setLoading(false);
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

    try {
      const payload = new FormData();
      const finalTitle = `[${formData.type} - ${formData.category}] ${formData.title}`;
      payload.append("title", finalTitle);
      payload.append("description", formData.description);
      payload.append("house_id", profile?.house_id);
      if (formData.attachment) {
        payload.append("image", formData.attachment);
      }

      await createComplaint(payload);
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
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9", fontWeight: "600" }}>
            <i className="bi bi-exclamation-circle-fill" style={{ marginRight: "10px" }}></i> {error}
          </div>
        )}

        <Card
          title="Submit a Request or Feedback"
          subtitle="Please provide clear details about your issue or experience so we can act accordingly."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
              <Button variant="secondary" onClick={() => navigate("/Tenant/complaints")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Submit Ticket</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "var(--text-muted)", marginBottom: "8px" }}>Submission Type</label>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", height: "45px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="Complaint" 
                      checked={formData.type === "Complaint"} 
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    /> Complaint / Issue
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "15px" }}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="Feedback" 
                      checked={formData.type === "Feedback"} 
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    /> General Feedback
                  </label>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "var(--text-muted)", marginBottom: "8px" }}>Category Topic</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "15px", backgroundColor: "white"
                  }}
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Facilities">Facilities</option>
                  <option value="General">General Administration</option>
                </select>
              </div>
            </div>

            <Input
              label="Subject / Topic"
              placeholder="e.g. Broken water pipe, The gym looks great!"
              value={formData.title}
              error={fieldErrors.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              disabled={loading}
            />

            <div style={{ position: "relative" }}>
              <TextArea
                label="Detailed Description"
                placeholder="Explain the problem, when it started, and its exact location."
                value={formData.description}
                error={fieldErrors.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={6}
                disabled={loading}
              />
              <div style={{ 
                position: "absolute", 
                right: "10px", 
                bottom: fieldErrors.description ? "35px" : "10px", 
                fontSize: "11px", 
                color: formData.description.length > 1000 ? "#e03131" : "var(--text-muted)",
                backgroundColor: "rgba(255,255,255,0.8)",
                padding: "2px 5px",
                borderRadius: "4px"
              }}>
                {formData.description.length} / 1000
              </div>
            </div>

            <Input
              label="Attach Image (Optional)"
              type="file"
              accept="image/jpeg,image/png"
              error={fieldErrors.attachment}
              onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
              disabled={loading}
            />
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "-15px" }}>
              Help us identify the issue. Upload a JPG or PNG image (Max 5MB).
            </p>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TenantAddComplaints;
