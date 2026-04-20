import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Input, Button, TextArea } from "../../components/FormElements";
import { createDocument, getHouses } from "../../services/api";

const DOC_TYPES = [
  { label: "Maintenance Bill",  value: "Maintenance Bill",  icon: "bi-tools",               color: "#6a1b9a" },
  { label: "Utility Bill",      value: "Utility Bill",      icon: "bi-lightning-charge",    color: "#e65100" },
  { label: "Invoice",           value: "Invoice",           icon: "bi-receipt",             color: "#c62828" },
  { label: "Payment Receipt",   value: "Receipt",           icon: "bi-file-earmark-ruled",  color: "#2e7d32" },
  { label: "Bank Statement",    value: "Bank Statement",    icon: "bi-bank",                color: "#1565c0" },
  { label: "Tax Document",      value: "Tax Document",      icon: "bi-file-earmark-text",   color: "#795548" },
  { label: "Inspection Report", value: "Inspection Report", icon: "bi-clipboard-check",    color: "#37474f" },
  { label: "Other",             value: "Other",             icon: "bi-file-earmark",        color: "#888" },
];

function TreasurerUploadDocuments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [houses, setHouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "Maintenance Bill",
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
      setError("File size exceeds 10MB limit.");
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
    if (!formData.houseId) { setError("Please select the associated house or facility."); return; }
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
      navigate("/treasurer/documents");
    } catch (err) {
      setError(err.message || "Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeType = DOC_TYPES.find(t => t.value === formData.type) || DOC_TYPES[0];

  return (
    <DashboardLayout role="treasurer" title="Upload Financial Document">
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "14px 18px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #ffc9c9", display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="bi bi-exclamation-circle-fill"></i> {error}
          </div>
        )}

        <Card title="Document Upload" subtitle="Attach bills, invoices, and receipts as evidence for maintenance costs and treasury expenses.">
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Document type tile picker */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "10px" }}>
                  Document Type <span style={{ color: "#e03131" }}>*</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {DOC_TYPES.map(t => {
                    const active = formData.type === t.value;
                    return (
                      <button key={t.value} type="button"
                        onClick={() => setFormData({ ...formData, type: t.value })}
                        style={{
                          padding: "12px 8px", borderRadius: "10px", cursor: "pointer",
                          border: `2px solid ${active ? t.color : "#eee"}`,
                          backgroundColor: active ? `${t.color}12` : "white",
                          display: "flex", alignItems: "center", gap: "8px", transition: "all 0.15s",
                          textAlign: "left"
                        }}>
                        <i className={`bi ${t.icon}`} style={{ color: t.color, fontSize: "15px", flexShrink: 0 }}></i>
                        <span style={{ fontSize: "11px", fontWeight: active ? "700" : "500", color: active ? t.color : "#666", lineHeight: "1.2" }}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Input
                  label="Document Name"
                  placeholder={`e.g. ${activeType.label} - March 2025`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)", marginBottom: "8px" }}>
                    Associated House / Unit <span style={{ color: "#e03131" }}>*</span>
                  </div>
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
                onClick={() => document.getElementById("financial-upload").click()}
                style={{
                  padding: "36px 24px",
                  border: selectedFile ? "2px solid #51cf66" : dragging ? `2px dashed ${activeType.color}` : "2px dashed #ddd",
                  borderRadius: "14px",
                  textAlign: "center",
                  backgroundColor: selectedFile ? "#f4fce3" : dragging ? "#f9f8ff" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <i
                  className={`bi ${selectedFile ? "bi-check-circle-fill" : activeType.icon}`}
                  style={{ fontSize: "38px", color: selectedFile ? "#51cf66" : activeType.color, display: "block", marginBottom: "10px" }}
                ></i>
                <div style={{ fontSize: "15px", fontWeight: "700", color: selectedFile ? "#2e7d32" : "#333" }}>
                  {selectedFile ? selectedFile.name : "Click to select or drag & drop the bill / document"}
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
                    ✕ Remove file
                  </button>
                )}
                <input type="file" id="financial-upload" style={{ display: "none" }} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              <TextArea
                label="Additional Notes (Optional)"
                placeholder="e.g. Pool pump repair invoice from vendor ABC, covering parts and labour…"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "20px", borderTop: "1px solid #f0f0f0" }}>
                <Button variant="secondary" type="button" onClick={() => navigate("/treasurer/documents")} disabled={loading}>Cancel</Button>
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

export default TreasurerUploadDocuments;
