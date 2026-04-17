import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Input, Button, Select, TextArea } from "../../components/FormElements";
import { createDocument } from "../../services/api";

function OwnerUploadDocument() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "Agreement",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app, we would use FormData for actual file uploads
      // For this system, we'll send the metadata to the createDocument API
      await createDocument({
        documentName: formData.name,
        documentType: formData.type,
        description: formData.description,
        uploadDate: new Date().toISOString().split('T')[0]
      });

      alert("Document information saved successfully!");
      navigate("/owner/documents");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to save document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Upload Document"
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
          <div style={{ 
            backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", 
            borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" 
          }}>
            <i className="bi bi-exclamation-circle-fill" style={{ marginRight: "10px" }}></i>
            {error}
          </div>
        )}

        <Card 
          title="Document Details" 
          subtitle="Provide document information and metadata for secure storage."
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Input
                label="Document Name"
                placeholder="e.g. Rent Agreement - H-001"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Select
                label="Document Category"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { label: "Agreement", value: "Agreement" },
                  { label: "Invoice", value: "Invoice" },
                  { label: "Receipt", value: "Receipt" },
                  { label: "Maintenance Record", value: "Maintenance Record" },
                  { label: "Other", value: "Other" },
                ]}
                required
              />

              <div style={{
                padding: "30px",
                border: "2px dashed #ddd",
                borderRadius: "12px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                cursor: "pointer"
              }}>
                <i className="bi bi-cloud-arrow-up" style={{ fontSize: "40px", color: "var(--primary)", display: "block", marginBottom: "10px" }}></i>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>Click to select a file or drag and drop</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>PDF, PNG, JPG (Max 5MB)</div>
                <input type="file" style={{ display: "none" }} id="file-upload" />
              </div>

              <TextArea
                label="Description (Optional)"
                placeholder="Add any notes about this document..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />

              <div style={{ 
                display: "flex", justifyContent: "flex-end", gap: "10px", 
                marginTop: "10px", paddingTop: "20px", borderTop: "1px solid #f0f0f0" 
              }}>
                <Button variant="secondary" type="button" onClick={() => navigate("/owner/documents")} disabled={loading}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={loading}>
                  Save Document
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerUploadDocument;
