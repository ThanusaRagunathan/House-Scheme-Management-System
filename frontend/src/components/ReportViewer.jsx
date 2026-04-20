import React, { useState, useEffect } from "react";
import { getReportData } from "../services/api";
import { Card, Button } from "./FormElements";
import { formatDate } from "../utils/formatters";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ReportViewer = ({ type, title, subtitle }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getReportData(type);
      setData(response.data || []);
    } catch (err) {
      console.error(`Failed to load ${type} report:`, err);
      setError(err.message || "Failed to generate report data.");
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const formatHeader = (key) => {
    return key.replace(/_/g, " ").toUpperCase();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${type}_report_${new Date().getTime()}.xlsx`);
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${type}_report_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const headers = getColumns().map(formatHeader);
    const body = data.map(item => Object.values(item));

    doc.autoTable({
      head: [headers],
      body: body,
      startY: 28,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 77, 46] }
    });

    doc.save(`${type}_report_${new Date().getTime()}.pdf`);
    setShowExportMenu(false);
  };

  return (
    <Card 
      title={title} 
      subtitle={subtitle || "Detailed system data and analysis."}
      headerAction={
        <div style={{ position: "relative" }}>
          <Button variant="primary" onClick={() => setShowExportMenu(!showExportMenu)}>
            <i className="bi bi-download"></i> Export Report
          </Button>
          
          {showExportMenu && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "white",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "10px",
              zIndex: 100,
              minWidth: "150px",
              border: "1px solid #eee",
              marginTop: "5px"
            }}>
              <div 
                style={{ padding: "8px 12px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "5px" }}
                onClick={exportToPDF}
                onMouseOver={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <i className="bi bi-file-earmark-pdf" style={{ color: "#e03131" }}></i> PDF Document
              </div>
              <div 
                style={{ padding: "8px 12px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "5px" }}
                onClick={exportToExcel}
                onMouseOver={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <i className="bi bi-file-earmark-spreadsheet" style={{ color: "#1a4d2e" }}></i> Excel File
              </div>
              <div 
                style={{ padding: "8px 12px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "5px" }}
                onClick={exportToCSV}
                onMouseOver={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <i className="bi bi-file-earmark-text" style={{ color: "#3498db" }}></i> CSV Format
              </div>
            </div>
          )}
        </div>
      }
    >
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <div className="spinner" style={{ marginBottom: "15px" }}></div>
          Generating report data...
        </div>
      ) : error ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#e03131" }}>{error}</div>
      ) : data.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No data found for this report.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: "11px", borderBottom: "2px solid #f0f0f0" }}>
                {getColumns().map(col => (
                  <th key={col} style={{ padding: "12px 10px" }}>{formatHeader(col)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  {Object.entries(row).map(([key, value], j) => (
                    <td key={j} style={{ padding: "12px 10px", fontSize: "13px" }}>
                      {(() => {
                        const lowerKey = key.toLowerCase();
                        
                        // Handle Dates
                        if (lowerKey.includes("date") || lowerKey.includes("timestamp") || lowerKey.includes("_at") || lowerKey === "time") {
                          return formatDate(value);
                        }

                        // Handle Potential JSON (for Audit trails/Metadata)
                        if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
                          try {
                            const parsed = JSON.parse(value);
                            return (
                              <div style={{ fontSize: "11px", backgroundColor: "#f8f9fa", padding: "8px", borderRadius: "6px", border: "1px solid #eee" }}>
                                {Object.entries(parsed).map(([k, v]) => (
                                  <div key={k} style={{ marginBottom: "2px" }}>
                                    <strong style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, ' $1').trim()}:</strong> {v?.toString()}
                                  </div>
                                ))}
                              </div>
                            );
                          } catch (e) {
                            return value;
                          }
                        }
                        
                        // Handle Objects directly
                        if (typeof value === "object" && value !== null) {
                           return (
                              <div style={{ fontSize: "11px", backgroundColor: "#f8f9fa", padding: "8px", borderRadius: "6px" }}>
                                {Object.entries(value).map(([k, v]) => (
                                  <div key={k} style={{ marginBottom: "2px" }}>
                                    <strong style={{ color: "var(--text-muted)" }}>{k}:</strong> {v?.toString()}
                                  </div>
                                ))}
                              </div>
                            );
                        }

                        return value?.toString() || "-";
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ReportViewer;
