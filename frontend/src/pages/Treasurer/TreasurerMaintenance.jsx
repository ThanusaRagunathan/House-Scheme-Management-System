import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getMaintenances, deleteMaintenance, updateMaintenance } from "../../services/api";

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

const CATEGORY_COLORS = {
  "Maintenance":     { bg: "#e3f2fd", color: "#1976d2" },
  "Utility Bill":    { bg: "#fff8e1", color: "#f57c00" },
  "Service Expense": { bg: "#f3e5f5", color: "#7b1fa2" },
  "Other":           { bg: "#f0f0f0", color: "#555" },
};

function CategoryBadge({ cat }) {
  const style = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"];
  return (
    <span style={{
      fontSize: "11px", fontWeight: "700", padding: "3px 9px", borderRadius: "10px",
      backgroundColor: style.bg, color: style.color, textTransform: "uppercase"
    }}>
      {cat || "Maintenance"}
    </span>
  );
}

function BarChart({ data, valueKey, labelKey, color }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "130px", fontSize: "12px", fontWeight: "600", color: "#555", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d[labelKey]}
          </div>
          <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: "6px", height: "20px", overflow: "hidden" }}>
            <div style={{
              width: `${(d[valueKey] / max) * 100}%`,
              backgroundColor: color,
              height: "100%",
              borderRadius: "6px",
              transition: "width 0.6s ease",
              minWidth: d[valueKey] > 0 ? "4px" : "0"
            }} />
          </div>
          <div style={{ width: "90px", fontSize: "12px", fontWeight: "700", color: "#333", flexShrink: 0 }}>
            Rs. {parseFloat(d[valueKey]).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function TreasurerMaintenance() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("records");

  // Filter state
  const [filterFacility, setFilterFacility] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getMaintenances();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load maintenance tasks:", error);
      setTasks([
        { id: 1, task_id: 1, facility: "Pool", description: "Chemical balance check", scheduled_date: "2025-09-11", cost: 500, task_status: "Paid", category: "Maintenance" },
        { id: 2, task_id: 2, facility: "Gym", description: "Equipment maintenance", scheduled_date: "2025-09-15", cost: 1700, task_status: "Pending", category: "Service Expense" },
        { id: 3, task_id: 3, facility: "Utilities", description: "Water bill Q3", scheduled_date: "2025-09-26", cost: 200, task_status: "Paid", category: "Utility Bill" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;
    setActionLoading(true);
    try {
      await deleteMaintenance(id);
      setTasks(tasks.filter(t => (t.task_id || t.id) !== id));
      alert("Record deleted successfully");
    } catch (error) {
      alert("Action failed: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
      await updateMaintenance(id, { taskStatus: status });
      setTasks(tasks.map(t => (t.task_id || t.id) === id ? { ...t, task_status: status, status } : t));
    } catch (error) {
      alert("Action failed: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered records
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const facility = t.facility || t.house_code || "";
      const category = t.category || "Maintenance";
      const status = t.task_status || t.status || "";
      const date = t.scheduled_date || t.date || "";

      if (filterFacility && !facility.toLowerCase().includes(filterFacility.toLowerCase())) return false;
      if (filterCategory && category !== filterCategory) return false;
      if (filterStatus && status !== filterStatus) return false;
      if (filterDateFrom && date < filterDateFrom) return false;
      if (filterDateTo && date > filterDateTo) return false;
      return true;
    });
  }, [tasks, filterFacility, filterCategory, filterDateFrom, filterDateTo, filterStatus]);

  // ── Analytics derived data ──────────────────────────────────────────────────
  const analyticsTasks = useMemo(() => {
    return tasks.filter(t => {
      const date = t.scheduled_date || t.date || "";
      if (filterDateFrom && date < filterDateFrom) return false;
      if (filterDateTo && date > filterDateTo) return false;
      return true;
    });
  }, [tasks, filterDateFrom, filterDateTo]);

  const costByFacility = useMemo(() => {
    const map = {};
    analyticsTasks.forEach(t => {
      const key = t.facility || t.house_code || `House #${t.house_id}` || "Shared";
      map[key] = (map[key] || 0) + (parseFloat(t.cost) || 0);
    });
    return Object.entries(map)
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }, [analyticsTasks]);

  const costByCategory = useMemo(() => {
    const map = {};
    analyticsTasks.forEach(t => {
      const key = t.category || "Maintenance";
      map[key] = (map[key] || 0) + (parseFloat(t.cost) || 0);
    });
    return Object.entries(map)
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }, [analyticsTasks]);

  const costByMonth = useMemo(() => {
    const map = {};
    analyticsTasks.forEach(t => {
      const d = t.scheduled_date || t.date;
      if (!d) return;
      const month = d.substring(0, 7); // "YYYY-MM"
      map[month] = (map[month] || 0) + (parseFloat(t.cost) || 0);
    });
    return Object.entries(map)
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [analyticsTasks]);

  const totalCost = tasks.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);
  const paidCost = tasks.filter(t => (t.task_status || t.status) === "Paid").reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);
  const pendingCost = totalCost - paidCost;

  const TAB_STYLE = (active) => ({
    padding: "10px 22px", borderRadius: "10px", border: "none", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", transition: "all 0.2s",
    backgroundColor: active ? "var(--primary)" : "transparent",
    color: active ? "white" : "var(--text-muted)",
    boxShadow: active ? "0 4px 12px rgba(26,77,46,0.2)" : "none"
  });

  return (
    <DashboardLayout
      role="treasurer"
      title="Maintenance & Cost Tracking"
      headerAction={
        <Button variant="primary" onClick={() => navigate("/treasurer/addcost")} disabled={actionLoading}>
          <i className="bi bi-plus-lg"></i> Add New Cost
        </Button>
      }
    >
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "30px" }}>
        <SummaryCard title="Total Expenditure" value={loading ? "..." : `Rs. ${totalCost.toLocaleString()}`} subtitle="All records" icon="bi-cash-stack" color="#1a4d2e" />
        <SummaryCard title="Paid / Settled" value={loading ? "..." : `Rs. ${paidCost.toLocaleString()}`} subtitle="Cleared bills" icon="bi-check2-circle" color="#3498db" />
        <SummaryCard title="Pending Costs" value={loading ? "..." : `Rs. ${pendingCost.toLocaleString()}`} subtitle="Awaiting payment" icon="bi-hourglass-split" color="#e67e22" />
      </div>

      {/* Date Range Filter (shared by both tabs) */}
      <div className="glass-card" style={{ padding: "16px 20px", marginBottom: "24px", backgroundColor: "white", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>FROM DATE</div>
          <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
            style={{ border: "1px solid #eee", borderRadius: "8px", padding: "7px 12px", fontSize: "13px" }} />
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>TO DATE</div>
          <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
            style={{ border: "1px solid #eee", borderRadius: "8px", padding: "7px 12px", fontSize: "13px" }} />
        </div>
        {(filterDateFrom || filterDateTo) && (
          <button onClick={() => { setFilterDateFrom(""); setFilterDateTo(""); }}
            style={{ padding: "7px 14px", background: "#fff5f5", color: "#e03131", border: "1px solid #ffc9c9", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
            <i className="bi bi-x-circle"></i> Clear Dates
          </button>
        )}
        <div style={{ marginLeft: "auto", fontSize: "13px", color: "var(--text-muted)" }}>
          {analyticsTasks.length} record{analyticsTasks.length !== 1 ? "s" : ""} in range
        </div>
      </div>

      {/* Tab selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", backgroundColor: "#f8f9fa", padding: "6px", borderRadius: "14px", width: "fit-content" }}>
        <button style={TAB_STYLE(activeTab === "records")} onClick={() => setActiveTab("records")}>
          <i className="bi bi-list-ul" style={{ marginRight: "6px" }}></i>All Records
        </button>
        <button style={TAB_STYLE(activeTab === "analytics")} onClick={() => setActiveTab("analytics")}>
          <i className="bi bi-bar-chart-line" style={{ marginRight: "6px" }}></i>Cost Analytics
        </button>
      </div>

      {/* ── TAB: ALL RECORDS ── */}
      {activeTab === "records" && (
        <Card title="Maintenance Records" subtitle="Full log of all costs recorded by the treasury.">
          {/* Row filters */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #f0f0f0" }}>
            <input placeholder="Search facility / house..." value={filterFacility}
              onChange={e => setFilterFacility(e.target.value)}
              style={{ flex: "1", minWidth: "180px", border: "1px solid #eee", borderRadius: "8px", padding: "8px 12px", fontSize: "13px" }} />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              style={{ border: "1px solid #eee", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: filterCategory ? "#333" : "#999" }}>
              <option value="">All Categories</option>
              <option>Maintenance</option>
              <option>Utility Bill</option>
              <option>Service Expense</option>
              <option>Other</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ border: "1px solid #eee", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: filterStatus ? "#333" : "#999" }}>
              <option value="">All Statuses</option>
              <option>Requested</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Paid</option>
            </select>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                    {["ID", "Facility / House", "Category", "Description", "Date", "Cost", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t, i) => {
                    const id = t.task_id || t.id;
                    const status = t.task_status || t.status;
                    const date = t.scheduled_date || t.date;
                    const statusStyle = {
                      "Paid":        { bg: "#e2f2e5", color: "#1a4d2e" },
                      "Completed":   { bg: "#e3f2fd", color: "#1565c0" },
                      "In Progress": { bg: "#fff8e1", color: "#e65100" },
                      "Pending":     { bg: "#fce4ec", color: "#c62828" },
                      "Requested":   { bg: "#fff3e0", color: "#e65100" },
                    }[status] || { bg: "#f5f5f5", color: "#666" };

                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }} onMouseOver={e => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        <td style={{ padding: "12px", fontSize: "13px", fontWeight: "700", color: "#999" }}>M{String(id || i + 1).padStart(3, "0")}</td>
                        <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600" }}>{t.facility || t.house_code || `House #${t.house_id}` || "Shared"}</td>
                        <td style={{ padding: "12px" }}><CategoryBadge cat={t.category} /></td>
                        <td style={{ padding: "12px", fontSize: "13px", color: "#555", maxWidth: "220px" }}>{t.description}</td>
                        <td style={{ padding: "12px", fontSize: "13px" }}>{date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "700", color: "#1a4d2e" }}>Rs.&nbsp;{parseFloat(t.cost || 0).toLocaleString()}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", backgroundColor: statusStyle.bg, color: statusStyle.color, textTransform: "uppercase" }}>{status}</span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                            {status === "Completed" && (
                              <button onClick={() => handleStatusUpdate(id, "Paid")}
                                style={{ background: "#e2f2e5", border: "1px solid #c8e6c9", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", color: "#1a4d2e", fontSize: "11px", fontWeight: "600" }}
                                disabled={actionLoading}>Record Payment</button>
                            )}
                            <button onClick={() => navigate(`/treasurer/maintenance/${id}`)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }} title="View">
                              <i className="bi bi-eye-fill"></i>
                            </button>
                            <button onClick={() => navigate(`/treasurer/addcost?edit=${id}`)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }} title="Edit">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button onClick={() => handleDelete(id)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }} title="Delete" disabled={actionLoading}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTasks.length === 0 && (
                    <tr><td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      <i className="bi bi-inbox" style={{ fontSize: "28px", display: "block", marginBottom: "10px" }}></i>
                      No records match the current filters.
                    </td></tr>
                  )}
                </tbody>
                {filteredTasks.length > 0 && (
                  <tfoot>
                    <tr style={{ borderTop: "2px solid #f0f0f0", backgroundColor: "#f9fdf9" }}>
                      <td colSpan="5" style={{ padding: "12px", fontSize: "13px", fontWeight: "700", color: "#555" }}>Filtered Total ({filteredTasks.length} records)</td>
                      <td style={{ padding: "12px", fontSize: "15px", fontWeight: "800", color: "#1a4d2e" }}>
                        Rs.&nbsp;{filteredTasks.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0).toLocaleString()}
                      </td>
                      <td colSpan="2" />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ── TAB: COST ANALYTICS ── */}
      {activeTab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Cost by Facility */}
          <Card title="Cost per Facility / House" subtitle="Total expenditure grouped by facility or housing unit.">
            {loading ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading...</p>
            ) : costByFacility.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No data available.</p>
            ) : (
              <div style={{ padding: "10px 0" }}>
                <BarChart data={costByFacility} labelKey="label" valueKey="total" color="#1a4d2e" />
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", paddingTop: "12px", borderTop: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#1a4d2e" }}>
                    Grand Total: Rs.&nbsp;{analyticsTasks.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Cost by Category */}
          <Card title="Cost per Category" subtitle="Breakdown of spending by expense type.">
            {loading ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading...</p>
            ) : costByCategory.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No data available.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
                <BarChart data={costByCategory} labelKey="label" valueKey="total" color="#e67e22" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {costByCategory.map((c, i) => {
                    const pct = Math.round((c.total / analyticsTasks.reduce((s, t) => s + (parseFloat(t.cost) || 0), 1)) * 100);
                    const badgeStyle = CATEGORY_COLORS[c.label] || CATEGORY_COLORS["Other"];
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#fafafa", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: badgeStyle.color, display: "inline-block" }} />
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>{c.label}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a4d2e" }}>Rs. {c.total.toLocaleString()}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{pct}% of total</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Cost by Month */}
          <Card title="Monthly Expenditure Trend" subtitle="Track how maintenance spending changes over time.">
            {loading ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading...</p>
            ) : costByMonth.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No data available.</p>
            ) : (
              <div>
                {/* Table view */}
                <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                        {["Month", "Total Cost", "# Records", "Avg. Cost/Record"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {costByMonth.map((row, i) => {
                        const monthTasks = analyticsTasks.filter(t => (t.scheduled_date || t.date || "").startsWith(row.label));
                        const avg = monthTasks.length > 0 ? row.total / monthTasks.length : 0;
                        const [yr, mo] = row.label.split("-");
                        const monthName = new Date(yr, parseInt(mo) - 1).toLocaleString("default", { month: "long", year: "numeric" });
                        return (
                          <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                            <td style={{ padding: "12px", fontWeight: "600", fontSize: "14px" }}>{monthName}</td>
                            <td style={{ padding: "12px", fontWeight: "800", fontSize: "15px", color: "#1a4d2e" }}>Rs. {row.total.toLocaleString()}</td>
                            <td style={{ padding: "12px", color: "#555" }}>{monthTasks.length}</td>
                            <td style={{ padding: "12px", color: "#777" }}>Rs. {Math.round(avg).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ backgroundColor: "#f9fdf9", borderTop: "2px solid #f0f0f0" }}>
                        <td style={{ padding: "12px", fontWeight: "700" }}>Total</td>
                        <td style={{ padding: "12px", fontWeight: "800", color: "#1a4d2e", fontSize: "16px" }}>
                          Rs. {costByMonth.reduce((s, r) => s + r.total, 0).toLocaleString()}
                        </td>
                        <td style={{ padding: "12px", fontWeight: "700" }}>{analyticsTasks.length}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {/* Bar chart for months */}
                <BarChart data={costByMonth} labelKey="label" valueKey="total" color="#3498db" />
              </div>
            )}
          </Card>

        </div>
      )}
    </DashboardLayout>
  );
}

export default TreasurerMaintenance;
