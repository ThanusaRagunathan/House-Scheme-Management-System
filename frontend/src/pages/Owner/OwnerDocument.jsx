import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getDocuments, deleteDocument, downloadDocument } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL;

const TYPE_ICONS = {
  "Rental Agreement":  { icon: "bi-file-earmark-person",  color: "#1a4d2e" },
  "Lease Extension":   { icon: "bi-file-earmark-check",   color: "#1565c0" },
  "Utility Bill":      { icon: "bi-lightning-charge",      color: "#e65100" },
  "Maintenance Bill":  { icon: "bi-tools",                color: "#6a1b9a" },
  "Invoice":           { icon: "bi-receipt",              color: "#c62828" },
  "Receipt":           { icon: "bi-file-earmark-ruled",   color: "#2e7d32" },
  "Notice":            { icon: "bi-megaphone",            color: "#1565c0" },
  "Inspection Report": { icon: "bi-clipboard-check",      color: "#6a1b9a" },
  "Agreement":         { icon: "bi-file-earmark-person",  color: "#1a4d2e" },
  "Other":             { icon: "bi-file-earmark",         color: "#888" },
};

function OwnerDocuments() {
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
        { id: 1, document_name: "Rent Agreement - H001", document_type: "Agreement", upload_date: "2025-09-11" },
        { id: 2, document_name: "Invoice Sept 2025", document_type: "Invoice", upload_date: "2025-09-15" },
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
        setDocuments(documents.filter(d => (d.document_id || d.id) !== id));
    } catch (error) {
        console.error("Failed to delete document:", error);
        alert("Action failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const agreementCount = documents.filter(d => ['Agreement','Rental Agreement','Lease Extension'].includes(d.document_type)).length;
  const invoiceCount = documents.filter(d => ['Invoice','Receipt'].includes(d.document_type)).length;
  const billCount = documents.filter(d => ['Utility Bill','Maintenance Bill'].includes(d.document_type)).length;

  return (
    <DashboardLayout
      role="owner"
      title={`Document Repository ${!loading ? `(${documents.length})` : ''}`}
      headerAction={
        <Button variant="primary" onClick={() => navigate("/owner/uploaddocument")} disabled={actionLoading}>
          <i className="bi bi-cloud-upload"></i> Upload Document
        </Button>
      }
    >

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
        <div className="glass-card" style={{ padding: "15px", backgroundColor: "white", textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Total Files</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>{documents.length}</div>
        </div>
        <div className="glass-card" style={{ padding: "15px", backgroundColor: "white", textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Agreements</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#3498db" }}>{agreementCount}</div>
        </div>
        <div className="glass-card" style={{ padding: "15px", backgroundColor: "white", textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Invoices</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#e67e22" }}>{invoiceCount}</div>
        </div>
        <div className="glass-card" style={{ padding: "15px", backgroundColor: "white", textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Bills</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#e65100" }}>{billCount}</div>
        </div>
      </div>

      <Card title="All System Documents" subtitle="Secure storage for agreements, receipts, and maintenance records.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading repository...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Name</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House / Facility</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Type</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {(() => {
                        const s = TYPE_ICONS[d.document_type] || TYPE_ICONS["Other"];
                        return <><i className={`bi ${s.icon}`} style={{ marginRight: "8px", color: s.color }}></i>{d.document_name}</>;
                      })()}
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500", color: "var(--primary)" }}>{d.house_code ? d.house_code : (d.facility || 'General')}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{d.document_type}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{new Date(d.upload_date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
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
                          onClick={() => handleDelete(d.id || d.document_id)}
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
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No documents found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default OwnerDocuments;
