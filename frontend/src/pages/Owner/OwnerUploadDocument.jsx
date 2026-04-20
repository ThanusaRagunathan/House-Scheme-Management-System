import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Input, Button, Select, TextArea } from "../../components/FormElements";
import { createDocument, getHouses } from "../../services/api";

const DOC_TYPES = [
  { label: "Rental Agreement", value: "Rental Agreement" },
  { label: "Lease Extension", value: "Lease Extension" },
  { label: "Utility Bill", value: "Utility Bill" },
  { label: "Maintenance Bill", value: "Maintenance Bill" },
  { label: "Invoice", value: "Invoice" },
  { label: "Payment Receipt", value: "Receipt" },
  { label: "Notice / Letter", value: "Notice" },
  { label: "Inspection Report", value: "Inspection Report" },
  { label: "Other", value: "Other" },
];

const TYPE_ICONS = {
  "Rental Agreement": { icon: "bi-file-earmark-person", color: "#1a4d2e" },
  "Lease Extension":  { icon: "bi-file-earmark-check", color: "#1565c0" },
  "Utility Bill":     { icon: "bi-lightning-charge",   color: "#e65100" },
  "Maintenance Bill": { icon: "bi-tools",              color: "#6a1b9a" },
  "Invoice":          { icon: "bi-receipt",            color: "#c62828" },
  "Receipt":          { icon: "bi-file-earmark-ruled", color: "#2e7d32" },
  "Notice":           { icon: "bi-megaphone",          color: "#1565c0" },
  "Inspection Report":{ icon: "bi-clipboard-check",   color: "#6a1b9a" },
  "Other":            { icon: "bi-file-earmark",       color: "#888" },
};

function OwnerUploadDocument() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [houses, setHouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Rental Agreement",
    description: "",
    houseId: "",
  });

  useEffect(() => {
    getHouses()
      .then(setHouses)
      .catch(() => setHouses([]));
  }, []);

  const validateFile = (file) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please select a smaller file.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (validateFile(file)) { setSelectedFile(file); setError(""); }
    else { setSelectedFile(null); e.target.value = null; }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (validateFile(file)) { setSelectedFile(file); setError(""); }
    else setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) { setError("Please select a file to upload."); return; }
    if (!formData.houseId) { setError("Please select the associated house/unit."); return; }
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("documentName", formData.name || selectedFile.name);
      data.append("documentType", formData.type);
      data.append("description", formData.description);
      data.append("houseId", formData.houseId);
      await createDocument(data);
      navigate("/owner/documents");
    } catch (err) {
      setError(err.message || "Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const typeStyle = TYPE_ICONS[formData.type] || TYPE_ICONS["Other"];

  return (
    <DashboardLayout role="owner" title="Upload Document">
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "14px 18px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #ffc9c9", display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="bi bi-exclamation-circle-fill"></i> {error}
          </div>
        )}

        <Card title="Document Details" subtitle="Upload rental agreements, bills, receipts, and other scheme documents.">
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Document type selector with icon preview */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "8px" }}>Document Category <span style={{ color: "#e03131" }}>*</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {DOC_TYPES.map(t => {
                    const s = TYPE_ICONS[t.value] || TYPE_ICONS["Other"];
                    const active = formData.type === t.value;
                    return (
                      <button key={t.value} type="button"
                        onClick={() => setFormData({ ...formData, type: t.value })}
                        style={{
                          padding: "12px 10px", borderRadius: "10px", border: `2px solid ${active ? s.color : "#eee"}`,
                          backgroundColor: active ? `${s.color}12` : "white", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "8px", transition: "all 0.15s"
                        }}>
                        <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: "16px" }}></i>
                        <span style={{ fontSize: "12px", fontWeight: active ? "700" : "500", color: active ? s.color : "#555", textAlign: "left", lineHeight: "1.2" }}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Input
                  label="Document Name"
                  placeholder={`e.g. ${formData.type} - H-001`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "8px" }}>House / Unit <span style={{ color: "#e03131" }}>*</span></div>
                  <select
                    value={formData.houseId}
                    onChange={e => setFormData({ ...formData, houseId: e.target.value })}
                    required
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e0e0e0", fontSize: "14px", color: formData.houseId ? "#333" : "#999", outline: "none" }}
                  >
                    <option value="">Select a house…</option>
                    {houses.map(h => (
                      <option key={h.house_id || h.id} value={h.house_id || h.id}>
                        {h.reference_code || h.houseCode || h.referenceCode} — {h.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag-and-drop upload zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
                style={{
                  padding: "36px 24px",
                  border: selectedFile ? "2px solid #51cf66" : dragging ? `2px dashed ${typeStyle.color}` : "2px dashed #ddd",
                  borderRadius: "14px",
                  textAlign: "center",
                  backgroundColor: selectedFile ? "#f4fce3" : dragging ? "#f0f8ff" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <i className={`bi ${selectedFile ? "bi-check-circle-fill" : "bi-cloud-arrow-up-fill"}`}
                  style={{ fontSize: "38px", color: selectedFile ? "#51cf66" : typeStyle.color, display: "block", marginBottom: "10px" }}></i>
                <div style={{ fontSize: "15px", fontWeight: "700", color: selectedFile ? "#2e7d32" : "#333" }}>
                  {selectedFile ? selectedFile.name : "Click to select or drag & drop your file here"}
                </div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · ${selectedFile.type}`
                    : "PDF, PNG, JPG · Max 10MB"}
                </div>
                {selectedFile && (
                  <button type="button"
                    onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                    style={{ marginTop: "10px", background: "none", border: "none", color: "#e03131", cursor: "pointer", fontSize: "12px" }}>
                    ✕ Remove
                  </button>
                )}
                <input type="file" id="file-upload" style={{ display: "none" }} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              <TextArea
                label="Notes (Optional)"
                placeholder="Add any additional context about this document…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #f0f0f0" }}>
                <Button variant="secondary" type="button" onClick={() => navigate("/owner/documents")} disabled={loading}>Cancel</Button>
                <Button variant="primary" type="submit" loading={loading}>
                  <i className="bi bi-cloud-upload"></i> Upload Document
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
