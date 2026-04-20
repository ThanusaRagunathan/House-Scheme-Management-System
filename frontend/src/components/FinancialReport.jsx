import React, { useState, useEffect, useCallback } from "react";
import { getReportData } from "../services/api";
import { Card, Button } from "./FormElements";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const fmt = (n) => `Rs. ${parseFloat(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtMon = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  return new Date(y, parseInt(m) - 1).toLocaleString("default", { month: "short", year: "numeric" });
};

function MetricCard({ label, value, sub, icon, accent, dim }) {
  return (
    <div style={{ background: dim ? "#f8f8f8" : "white", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "16px", border: `1px solid ${accent}22` }}>
      <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: accent, flexShrink: 0 }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div style={{ fontSize: "12px", color: "#888", fontWeight: "600", marginBottom: "3px", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: "22px", fontWeight: "800", color: accent }}>{value}</div>
        {sub && <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{sub}</div>}
      </div>
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color }}>{fmt(value)}</span>
      </div>
      <div style={{ background: "#f0f0f0", borderRadius: "6px", height: "10px" }}>
        <div style={{ width: `${pct}%`, background: color, borderRadius: "6px", height: "100%", transition: "width 0.7s ease", minWidth: value > 0 ? 4 : 0 }} />
      </div>
    </div>
  );
}

function MonthlyChart({ monthly }) {
  if (!monthly || monthly.length === 0) return <p style={{ textAlign: "center", padding: "20px", color: "#aaa" }}>No trend data available.</p>;
  const maxVal = Math.max(...monthly.map(m => Math.max(parseFloat(m.income || 0), parseFloat(m.expense || 0))), 1);
  const barH = 100;

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", minWidth: `${monthly.length * 70}px`, padding: "10px 4px 0" }}>
        {monthly.map((m, i) => {
          const inc = parseFloat(m.income || 0);
          const exp = parseFloat(m.expense || 0);
          return (
            <div key={i} style={{ flex: "0 0 56px", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "3px", height: `${barH}px` }}>
                <div title={`Income: ${fmt(inc)}`} style={{ width: "20px", height: `${(inc / maxVal) * barH}px`, background: "#1a4d2e", borderRadius: "4px 4px 0 0", transition: "height 0.7s", minHeight: inc > 0 ? 2 : 0 }} />
                <div title={`Expense: ${fmt(exp)}`} style={{ width: "20px", height: `${(exp / maxVal) * barH}px`, background: "#e67e22", borderRadius: "4px 4px 0 0", transition: "height 0.7s", minHeight: exp > 0 ? 2 : 0 }} />
              </div>
              <div style={{ fontSize: "10px", color: "#999", marginTop: "5px", whiteSpace: "nowrap" }}>{fmtMon(m.mon)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "20px", marginTop: "12px", justifyContent: "center" }}>
        <span style={{ fontSize: "12px", color: "#1a4d2e", fontWeight: "700" }}>■ Income</span>
        <span style={{ fontSize: "12px", color: "#e67e22", fontWeight: "700" }}>■ Expenses</span>
      </div>
    </div>
  );
}

const FinancialReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExport, setShowExport] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (startDate) { params.startDate = startDate; params.endDate = endDate || new Date().toISOString().split("T")[0]; }
      const data = await getReportData("finance", params);
      setReport(data);
    } catch (e) {
      setError(e.message || "Failed to load financial report.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => { load(); }, [load]);

  const exportPDF = () => {
    if (!report) return;
    const { summary, expense_breakdown, outstanding_rents } = report;
    const doc = new jsPDF("landscape");
    doc.setFontSize(16);
    doc.text("Financial Report – Housing Scheme", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleString()}${startDate ? `  |  Period: ${startDate} to ${endDate}` : "  |  All Time"}`, 14, 22);
    doc.setTextColor(0);

    // Summary table
    doc.autoTable({
      head: [["Metric", "Value"]],
      body: [
        ["Total Income (Rent Collected)", fmt(summary.total_income)],
        ["Outstanding Rent (Pending)", fmt(summary.outstanding_rent)],
        ["Overdue Rent", fmt(summary.overdue_rent)],
        ["Total Expenses", fmt(summary.total_expenses)],
        ["Net Balance", fmt(summary.net_balance)],
      ],
      startY: 28, theme: "grid", styles: { fontSize: 9 }, headStyles: { fillColor: [26, 77, 46] }
    });

    // Expense breakdown
    const afterSummary = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(11); doc.text("Expense Breakdown", 14, afterSummary);
    doc.autoTable({
      head: [["Category", "Amount"]],
      body: [
        ["Maintenance / Repair", fmt(expense_breakdown?.maintenance)],
        ["Utility Bills", fmt(expense_breakdown?.utility)],
        ["Service Expenses", fmt(expense_breakdown?.service)],
        ["Other", fmt(expense_breakdown?.other)],
      ],
      startY: afterSummary + 5, theme: "grid", styles: { fontSize: 9 }, headStyles: { fillColor: [230, 126, 34] }
    });

    // Outstanding rents
    if (outstanding_rents?.length > 0) {
      const afterExp = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(11); doc.text("Outstanding Rent Details", 14, afterExp);
      doc.autoTable({
        head: [["Tenant", "House Code", "Address", "Amount Due", "Status", "Due Date"]],
        body: outstanding_rents.map(r => [r.tenant_name, r.house_code, r.address, fmt(r.amount_due), r.status, fmtDate(r.due_date)]),
        startY: afterExp + 5, theme: "grid", styles: { fontSize: 8 }, headStyles: { fillColor: [220, 53, 69] }
      });
    }

    doc.save(`financial_report_${Date.now()}.pdf`);
    setShowExport(false);
  };

  const exportExcel = () => {
    if (!report) return;
    const { summary, expense_breakdown, outstanding_rents, monthly_trend } = report;
    const wb = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([
      { Metric: "Total Income (Rent Collected)", Value: summary.total_income },
      { Metric: "Outstanding Rent (Pending)", Value: summary.outstanding_rent },
      { Metric: "Overdue Rent", Value: summary.overdue_rent },
      { Metric: "Total Expenses", Value: summary.total_expenses },
      { Metric: "Net Balance", Value: summary.net_balance },
      { Metric: "" },
      { Metric: "Maintenance Cost", Value: expense_breakdown?.maintenance },
      { Metric: "Utility Bills", Value: expense_breakdown?.utility },
      { Metric: "Service Expenses", Value: expense_breakdown?.service },
      { Metric: "Other Expenses", Value: expense_breakdown?.other },
    ]);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
    if (outstanding_rents?.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(outstanding_rents), "Outstanding_Rents");
    }
    if (monthly_trend?.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(monthly_trend), "Monthly_Trend");
    }
    XLSX.writeFile(wb, `financial_report_${Date.now()}.xlsx`);
    setShowExport(false);
  };

  return (
    <Card
      title="Financial Report"
      subtitle="Income, outstanding rents, and expense analysis for the housing scheme."
      headerAction={
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              style={{ border: "1px solid #eee", borderRadius: "8px", padding: "7px 12px", fontSize: "13px" }} placeholder="From" />
            <span style={{ fontSize: "13px", color: "#aaa" }}>to</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              style={{ border: "1px solid #eee", borderRadius: "8px", padding: "7px 12px", fontSize: "13px" }} placeholder="To" />
            {startDate && (
              <button onClick={() => { setStartDate(""); setEndDate(""); }}
                style={{ padding: "7px 12px", background: "#fff5f5", color: "#e03131", border: "1px solid #ffc9c9", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                ✕
              </button>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <Button variant="primary" onClick={() => setShowExport(!showExport)}>
              <i className="bi bi-download"></i> Export
            </Button>
            {showExport && (
              <div style={{ position: "absolute", top: "100%", right: 0, background: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", borderRadius: "10px", padding: "8px", zIndex: 100, minWidth: "160px", border: "1px solid #eee", marginTop: "5px" }}>
                {[
                  { label: "PDF Document", icon: "bi-file-earmark-pdf", color: "#e03131", fn: exportPDF },
                  { label: "Excel File", icon: "bi-file-earmark-spreadsheet", color: "#1a4d2e", fn: exportExcel },
                ].map(opt => (
                  <div key={opt.label} onClick={opt.fn} style={{ padding: "9px 14px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "6px" }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}>
                    <i className={`bi ${opt.icon}`} style={{ color: opt.color }}></i> {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
    >
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
          <div className="spinner" style={{ marginBottom: "15px" }}></div>
          Generating financial report...
        </div>
      ) : error ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#e03131" }}>
          <i className="bi bi-exclamation-triangle" style={{ fontSize: "32px", display: "block", marginBottom: "10px" }}></i>
          {error}
          <br />
          <button onClick={load} style={{ marginTop: "14px", padding: "8px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Retry</button>
        </div>
      ) : report ? (() => {
        const { summary, expense_breakdown, outstanding_rents, monthly_trend } = report;
        const netPositive = parseFloat(summary.net_balance) >= 0;
        const totalExp = parseFloat(summary.total_expenses || 0);

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* ── KPI row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <MetricCard label="Total Income" value={fmt(summary.total_income)} sub={`${summary.paid_count} paid payments`} icon="bi-arrow-down-circle-fill" accent="#1a4d2e" />
              <MetricCard label="Outstanding Rent" value={fmt(summary.outstanding_rent)} sub={`${summary.unpaid_count} unpaid invoices`} icon="bi-hourglass-split" accent="#e67e22" />
              <MetricCard label="Overdue Rent" value={fmt(summary.overdue_rent)} sub="Requires follow-up" icon="bi-exclamation-circle-fill" accent="#c0392b" />
              <MetricCard label="Total Expenses" value={fmt(summary.total_expenses)} sub="Maintenance & utility" icon="bi-arrow-up-circle-fill" accent="#8e44ad" />
              <MetricCard label="Net Balance" value={fmt(summary.net_balance)} sub={netPositive ? "Surplus" : "Deficit"} icon={netPositive ? "bi-graph-up-arrow" : "bi-graph-down-arrow"} accent={netPositive ? "#1565c0" : "#c0392b"} />
            </div>

            {/* ── Income vs Expenses bar + Expense breakdown ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

              <div style={{ background: "white", borderRadius: "14px", padding: "22px", border: "1px solid #f0f0f0" }}>
                <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "18px" }}>Expense Breakdown</div>
                {[
                  { label: "Maintenance / Repair", value: expense_breakdown?.maintenance, color: "#1976d2" },
                  { label: "Utility Bills", value: expense_breakdown?.utility, color: "#e67e22" },
                  { label: "Service Expenses", value: expense_breakdown?.service, color: "#8e44ad" },
                  { label: "Other", value: expense_breakdown?.other, color: "#95a5a6" },
                ].map(row => (
                  <MiniBar key={row.label} label={row.label} value={parseFloat(row.value || 0)} max={totalExp || 1} color={row.color} />
                ))}
              </div>

              <div style={{ background: "white", borderRadius: "14px", padding: "22px", border: "1px solid #f0f0f0" }}>
                <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "18px" }}>Income vs Expenses at a Glance</div>
                {[
                  { label: "Income Collected", value: summary.total_income, color: "#1a4d2e", pct: 100 },
                  { label: "Expenses", value: summary.total_expenses, color: "#e67e22", pct: summary.total_income > 0 ? (parseFloat(summary.total_expenses) / parseFloat(summary.total_income)) * 100 : 0 },
                  { label: "Outstanding", value: summary.outstanding_rent, color: "#e67e22aa", pct: summary.total_income > 0 ? (parseFloat(summary.outstanding_rent) / parseFloat(summary.total_income)) * 100 : 0 },
                ].map(row => <MiniBar key={row.label} label={row.label} value={parseFloat(row.value || 0)} max={parseFloat(summary.total_income) || 1} color={row.color} />)}
                <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Net Balance</span>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: netPositive ? "#1a4d2e" : "#c0392b" }}>{fmt(summary.net_balance)}</span>
                </div>
              </div>
            </div>

            {/* ── Monthly trend ── */}
            <div style={{ background: "white", borderRadius: "14px", padding: "22px", border: "1px solid #f0f0f0" }}>
              <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "18px" }}>Monthly Income vs Expense Trend</div>
              <MonthlyChart monthly={monthly_trend} />
              {monthly_trend?.length > 0 && (
                <div style={{ overflowX: "auto", marginTop: "20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                        {["Month", "Income", "Expenses", "Net"].map(h => (
                          <th key={h} style={{ padding: "10px", textAlign: h === "Month" ? "left" : "right", fontSize: "11px", color: "#aaa", fontWeight: "700", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monthly_trend.map((m, i) => {
                        const inc = parseFloat(m.income || 0);
                        const exp = parseFloat(m.expense || 0);
                        const net = inc - exp;
                        return (
                          <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}>
                            <td style={{ padding: "10px", fontWeight: "600" }}>{fmtMon(m.mon)}</td>
                            <td style={{ padding: "10px", textAlign: "right", color: "#1a4d2e", fontWeight: "700" }}>{fmt(inc)}</td>
                            <td style={{ padding: "10px", textAlign: "right", color: "#e67e22", fontWeight: "700" }}>{fmt(exp)}</td>
                            <td style={{ padding: "10px", textAlign: "right", fontWeight: "800", color: net >= 0 ? "#1565c0" : "#c0392b" }}>{fmt(net)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #f0f0f0", backgroundColor: "#f9fdf9" }}>
                        <td style={{ padding: "12px", fontWeight: "700" }}>Total</td>
                        <td style={{ padding: "12px", textAlign: "right", fontWeight: "800", color: "#1a4d2e" }}>{fmt(summary.total_income)}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontWeight: "800", color: "#e67e22" }}>{fmt(summary.total_expenses)}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontWeight: "800", color: netPositive ? "#1565c0" : "#c0392b" }}>{fmt(summary.net_balance)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* ── Outstanding rents table ── */}
            <div style={{ background: "white", borderRadius: "14px", padding: "22px", border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ fontWeight: "700", fontSize: "15px" }}>Outstanding Rents</div>
                <span style={{ fontSize: "12px", background: "#fff5f5", color: "#c0392b", padding: "4px 12px", borderRadius: "20px", fontWeight: "700" }}>
                  {outstanding_rents?.length || 0} pending
                </span>
              </div>
              {outstanding_rents?.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "#aaa" }}>
                  <i className="bi bi-check2-circle" style={{ fontSize: "32px", display: "block", marginBottom: "8px", color: "#1a4d2e" }}></i>
                  All rents are cleared — no outstanding payments!
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                        {["Tenant", "House", "Address", "Amount Due", "Status", "Due Date"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", fontSize: "11px", color: "#aaa", fontWeight: "700", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outstanding_rents.map((r, i) => {
                        const isOverdue = r.status === "Overdue";
                        return (
                          <tr key={i} style={{ borderBottom: "1px solid #fafafa", backgroundColor: isOverdue ? "#fff8f8" : "transparent" }}>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{r.tenant_name}</td>
                            <td style={{ padding: "12px" }}><span style={{ fontWeight: "700", color: "#1a4d2e" }}>{r.house_code}</span></td>
                            <td style={{ padding: "12px", color: "#777" }}>{r.address}</td>
                            <td style={{ padding: "12px", fontWeight: "800", color: isOverdue ? "#c0392b" : "#e67e22" }}>{fmt(r.amount_due)}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", backgroundColor: isOverdue ? "#fce4ec" : "#fff3e0", color: isOverdue ? "#c62828" : "#e65100" }}>
                                {r.status}
                              </span>
                            </td>
                            <td style={{ padding: "12px", color: isOverdue ? "#c0392b" : "#555", fontWeight: isOverdue ? "700" : "400" }}>{fmtDate(r.due_date)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #f0f0f0", backgroundColor: "#fff8f0" }}>
                        <td colSpan="3" style={{ padding: "12px", fontWeight: "700" }}>Total Outstanding</td>
                        <td style={{ padding: "12px", fontWeight: "800", fontSize: "15px", color: "#c0392b" }}>
                          {fmt(outstanding_rents.reduce((s, r) => s + parseFloat(r.amount_due || 0), 0))}
                        </td>
                        <td colSpan="2" />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

          </div>
        );
      })() : null}
    </Card>
  );
};

export default FinancialReport;
