import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getDocuments, getTenantProfile, deleteDocument } from "../../services/api";

function TenantDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsData, profileData] = await Promise.all([
        getDocuments(),
        getTenantProfile()
      ]);
      setDocuments(docsData);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      // Fallback for demo
      setDocuments([
        { id: 1, title: "Rent Agreement - H001", type: "Rent Agreement", date: "2025-09-11", size: "1.2 MB" },
        { id: 2, title: "Rules & Regulations", type: "Policy", date: "2025-09-12", size: "450 KB" },
        { id: 3, title: "September Invoice", type: "Invoice", date: "2025-09-15", size: "156 KB" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document reference?")) return;
    setActionLoading(true);
    try {
        await deleteDocument(id);
        setDocuments(documents.filter(d => d.id !== id));
    } catch (error) {
        console.error("Failed to delete document:", error);
        alert("Action failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="tenant"
      title="Personal & Community Documents"
      userName={profile?.username || "Resident"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
        {[
          { title: "Agreements", count: documents.filter(d => d.type === 'Rent Agreement').length, color: "#1a4d2e" },
          { title: "Invoices", count: documents.filter(d => d.type === 'Invoice').length, color: "#e67e22" },
          { title: "Policies", count: documents.filter(d => d.type === 'Policy').length, color: "#3498db" },
          { title: "Others", count: documents.filter(d => !['Rent Agreement', 'Invoice', 'Policy'].includes(d.type)).length, color: "var(--text-muted)" },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: "18px", backgroundColor: "white", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>{stat.title}</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: stat.color }}>{stat.count}</div>
          </div>
        ))}
      </div>

      <Card title="Available Documents" subtitle="Access your legal agreements, monthly invoices, and community guidelines.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading archive...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {documents.map((doc, i) => (
              <div key={i} className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fcfcfc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{ width: "45px", height: "45px", backgroundColor: "#f0f0f0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "var(--primary)" }}>
                    <i className={`bi ${doc.type === 'Invoice' ? 'bi-file-earmark-spreadsheet' : 'bi-file-earmark-text'}`}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>{doc.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {doc.type} • {new Date(doc.date).toLocaleDateString()} • {doc.size}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Button variant="secondary" onClick={() => alert("Downloading " + doc.title)}>
                    <i className="bi bi-download"></i> Download
                  </Button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131", fontSize: "18px" }}
                    title="Delete"
                    disabled={actionLoading}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <i className="bi bi-folder2-open" style={{ fontSize: "40px", color: "#eee", display: "block", marginBottom: "15px" }}></i>
                <div style={{ color: "var(--text-muted)" }}>No documents shared with you yet.</div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TenantDocuments;
