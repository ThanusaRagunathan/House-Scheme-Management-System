import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getDocuments, deleteDocument } from "../../services/api";

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

  const agreementCount = documents.filter(d => d.document_type === 'Agreement').length;
  const invoiceCount = documents.filter(d => d.document_type === 'Invoice').length;

  return (
    <DashboardLayout
      role="treasurer"
      title="Financial Archive"
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
        <Button variant="primary" onClick={() => navigate("/treasurer/uploaddocument")} disabled={actionLoading}>
          <i className="bi bi-cloud-upload"></i> Upload Document
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
        <SummaryCard title="Total Files" value={loading ? "..." : documents.length} icon="bi-files" color="var(--primary)" />
        <SummaryCard title="Agreements" value={loading ? "..." : agreementCount} icon="bi-file-earmark-check" color="#3498db" />
        <SummaryCard title="Invoices" value={loading ? "..." : invoiceCount} icon="bi-receipt" color="#e67e22" />
        <SummaryCard title="Reports" value={loading ? "..." : (documents.length - agreementCount - invoiceCount)} icon="bi-bar-chart" color="#1a4d2e" />
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
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Type</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Uploaded By</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Size</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{d.document_name}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{d.document_type}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{d.uploadedBy || 'System'}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{new Date(d.upload_date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{d.size || 'N/A'}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                       <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => alert("Downloading " + d.document_name)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}
                            title="Download"
                          >
                            <i className="bi bi-download"></i>
                          </button>
                          <button 
                            onClick={() => handleDelete(d.id)}
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
