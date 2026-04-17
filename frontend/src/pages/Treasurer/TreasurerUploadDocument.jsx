import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Input, Button, Select, TextArea } from "../../components/FormElements";
import { createDocument } from "../../services/api";

function TreasurerUploadDocuments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "Invoice",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createDocument({
        documentName: formData.name,
        documentType: formData.type,
        description: formData.description,
        uploadDate: new Date().toISOString().split('T')[0]
      });

      alert("Financial document saved successfully!");
      navigate("/treasurer/documents");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to save document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="treasurer"
      title="Upload Financial Document"
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
          title="Document Upload" 
          subtitle="Upload financial records, invoices, or payment receipts to the system."
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Input
                label="Document Name"
                placeholder="e.g. Maintenance Invoice - March 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Select
                label="Document Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { label: "Invoice", value: "Invoice" },
                  { label: "Receipt", value: "Receipt" },
                  { label: "Bank Statement", value: "Bank Statement" },
                  { label: "Tax Document", value: "Tax Document" },
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
                <i className="bi bi-file-earmark-arrow-up" style={{ fontSize: "40px", color: "var(--primary)", display: "block", marginBottom: "10px" }}></i>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>Select financial record for upload</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>PDF, PNG, JPG (Max 10MB)</div>
                <input type="file" style={{ display: "none" }} id="financial-upload" />
              </div>

              <TextArea
                label="Additional Notes"
                placeholder="Enter any relevant financial details or descriptions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />

              <div style={{ 
                display: "flex", justifyContent: "flex-end", gap: "10px", 
                marginTop: "10px", paddingTop: "20px", borderTop: "1px solid #f0f0f0" 
              }}>
                <Button variant="secondary" type="button" onClick={() => navigate("/treasurer/documents")} disabled={loading}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={loading}>
                  Save Record
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerUploadDocuments;
