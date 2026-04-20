import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getDocuments, deleteDocument, downloadDocument } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL;

const TYPE_ICONS = {
  "Maintenance Bill":  { icon: "bi-tools",               color: "#6a1b9a" },
  "Utility Bill":      { icon: "bi-lightning-charge",    color: "#e65100" },
  "Invoice":           { icon: "bi-receipt",             color: "#c62828" },
  "Receipt":           { icon: "bi-file-earmark-ruled",  color: "#2e7d32" },
  "Bank Statement":    { icon: "bi-bank",                color: "#1565c0" },
  "Tax Document":      { icon: "bi-file-earmark-text",   color: "#795548" },
  "Inspection Report": { icon: "bi-clipboard-check",    color: "#37474f" },
  "Agreement":         { icon: "bi-file-earmark-person", color: "#1a4d2e" },
  "Rental Agreement":  { icon: "bi-file-earmark-person", color: "#1a4d2e" },
  "Other":             { icon: "bi-file-earmark",        color: "#888" },
};

function SummaryCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: "700", color: color || "var(--primary)" }}>{value}</div>
        {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "12px", backgroundColor: color ? `${color}1A` : "rgba(26, 77, 46, 0.1)", borderRadius: "10px", color: color || "var(--primary)", fontSize: "20px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function TreasurerDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      // Fallback for demo
      setDocuments([
        { id: 1, document_name: "Rent Agreement-H001", document_type: "Agreement", uploadedBy: "John Smith", upload_date: "2025-09-11", size: "2.3 MB" },
        { id: 2, document_name: "Invoice Sept 2025-H001", document_type: "Invoice", uploadedBy: "System", upload_date: "2025-09-15", size: "156 KB" },
        { id: 3, document_name: "Pool maintenance report sept", document_type: "Maintenance", uploadedBy: "Mike Devis", upload_date: "2025-09-26", size: "890 KB" },
        { id: 4, document_name: "Rent Agreement-H002", document_type: "Agreement", uploadedBy: "John Smith", upload_date: "2025-09-28", size: "2.1 MB" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    setActionLoading(true);
    try {
        await deleteDocument(id);
        setDocuments(documents.filter(d => d.id !== id));
        alert("Document deleted successfully");
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Delete failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const agreementCount = documents.filter(d => ['Agreement','Rental Agreement','Lease Extension'].includes(d.document_type)).length;
  const invoiceCount = documents.filter(d => ['Invoice','Receipt'].includes(d.document_type)).length;
  const billCount = documents.filter(d => ['Utility Bill','Maintenance Bill'].includes(d.document_type)).length;

  return (
    <DashboardLayout
      role="treasurer"
      title={`Document Management ${!loading ? `(${documents.length})` : ''}`}
      headerAction={
        <Button variant="primary" onClick={() => navigate("/treasurer/uploaddocument")} disabled={actionLoading}>
          <i className="bi bi-plus-circle"></i> Add Document
        </Button>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
        <SummaryCard title="Total Files" value={loading ? "..." : documents.length} icon="bi-files" color="var(--primary)" />
        <SummaryCard title="Agreements" value={loading ? "..." : agreementCount} icon="bi-file-earmark-check" color="#3498db" />
        <SummaryCard title="Invoices / Receipts" value={loading ? "..." : invoiceCount} icon="bi-receipt" color="#e67e22" />
        <SummaryCard title="Bills" value={loading ? "..." : billCount} icon="bi-lightning-charge" color="#e65100" />
      </div>

      <Card title="All Repository Documents" subtitle="Secure management of agreements, invoices, and system reports.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Name</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House / Facility</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Type</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Uploaded By</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>

                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500", color: "#1a4d2e" }}>
                      {(() => {
                        const s = TYPE_ICONS[d.document_type] || TYPE_ICONS["Other"];
                        return <><i className={`bi ${s.icon}`} style={{ marginRight: "8px", color: s.color }}></i>{d.document_name}</>;
                      })()}
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500", color: "var(--primary)" }}>{d.house_code ? d.house_code : (d.facility || 'General')}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{d.document_type}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{d.uploadedBy || 'System'}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{new Date(d.upload_date).toLocaleDateString()}</td>

                    <td style={{ padding: "12px", textAlign: "right" }}>
                       <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button 
                            onClick={async () => {
                              try { await downloadDocument(d.document_id || d.id); }
                              catch(e) { alert("Download failed: " + e.message); }
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}
                            title="Download"
                          >
                            <i className="bi bi-download"></i>
                          </button>
                          <button 
                            onClick={() => handleDelete(d.document_id || d.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }}
                            title="Delete"
                            disabled={actionLoading}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No documents found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TreasurerDocuments;
