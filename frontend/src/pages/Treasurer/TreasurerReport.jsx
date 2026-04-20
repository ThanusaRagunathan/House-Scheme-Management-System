import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import ReportViewer from "../../components/ReportViewer";
import FinancialReport from "../../components/FinancialReport";
import { Button } from "../../components/FormElements";

function TreasurerReports() {
  const navigate = useNavigate();
  const [activeReport, setActiveReport] = useState("finance");

  const reportTypes = [
    { id: "tenants", label: "Tenant List", icon: "bi-people", subtitle: "Comprehensive list of all tenants and lease terms." },
    { id: "occupancy", label: "Occupancy", icon: "bi-house-heart", subtitle: "Real-time property status and vacancy tracking." },
    { id: "finance", label: "Financials", icon: "bi-currency-exchange", subtitle: "Consolidated view of revenue vs maintenance costs." },
    { id: "maintenance", label: "Maintenance", icon: "bi-tools", subtitle: "Tracking progress and expenses of maintenance tasks." },
    { id: "complaints", label: "Complaints", icon: "bi-chat-dots", subtitle: "Analysis of tenant issues and resolution status." },
    { id: "audit", label: "Security Audit", icon: "bi-shield-lock", subtitle: "Detailed log of user actions and record changes." },
    { id: "notifications", label: "Broadcasts", icon: "bi-megaphone", subtitle: "Log of all sent notifications and announcements." },
    { id: "documents", label: "Compliance", icon: "bi-file-earmark-check", subtitle: "Audit trail of all system document uploads." }
  ];

  return (
    <DashboardLayout 
      role="treasurer" 
      title="Treasury Reporting Hub"
      headerAction={<Button variant="secondary" onClick={() => navigate("/treasurer/calendar")}><i className="bi bi-calendar3"></i> View Calendar</Button>}
    >
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
        {reportTypes.map((rpt) => (
          <button
            key={rpt.id}
            onClick={() => setActiveReport(rpt.id)}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: activeReport === rpt.id ? "var(--primary)" : "#eee",
              backgroundColor: activeReport === rpt.id ? "var(--primary)" : "white",
              color: activeReport === rpt.id ? "white" : "var(--text-dark)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              boxShadow: activeReport === rpt.id ? "0 4px 12px rgba(26,77,46,0.2)" : "none"
            }}
          >
            <i className={`bi ${rpt.icon}`}></i>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>{rpt.label}</span>
          </button>
        ))}
      </div>

      {activeReport === "finance" ? (
        <FinancialReport />
      ) : (
        <ReportViewer
          type={activeReport}
          title={reportTypes.find(r => r.id === activeReport).label + " Report"}
          subtitle={reportTypes.find(r => r.id === activeReport).subtitle}
        />
      )}
    </DashboardLayout>
  );
}

export default TreasurerReports;
