import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Button, Card } from "../../components/FormElements";
import { getPayments, updatePayment, deletePayment } from "../../services/api";

function StatCard({ title, subtitle, value, icon, color }) {
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

function OwnerPayment() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      // Fallback for demo
      setPayments([
          { id: 1, invoice_no: "INV-2026-001", tenantName: "Karthik", houseAddress: "H001", paid_date: "2026-09-01", amount: 10000, status: "Paid", payment_method: "Online" },
          { id: 2, invoice_no: "INV-2026-002", tenantName: "Jack Brown", houseAddress: "H002", paid_date: null, amount: 17000, status: "Pending", payment_method: "-" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    setActionLoading(true);
    try {
        await deletePayment(id);
        setPayments(payments.filter(p => p.id !== id));
    } catch (error) {
        console.error("Failed to delete payment:", error);
        alert("Action failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
        await updatePayment(id, { status });
        setPayments(payments.map(p => p.id === id ? { ...p, status, paid_date: status === 'Paid' ? new Date().toISOString() : null } : p));
    } catch (error) {
        console.error("Failed to update status:", error);
        alert("Action failed: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalOutstanding = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const collectionRate = payments.length > 0 ? (payments.filter(p => p.status === 'Paid').length / payments.length) * 100 : 0;

  const unpaidPayments = payments.filter(p => p.status !== 'Paid');

  return (
    <DashboardLayout
      role="owner"
      title="Financial Management"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
        <Button variant="primary" onClick={() => navigate("/owner/generate-receipts")}>
           <i className="bi bi-receipt"></i> Generate Bulk Invoices
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "40px" }}>
        <StatCard title="Total Collected" value={loading ? "..." : `Rs. ${totalCollected.toLocaleString()}`} subtitle="Year to Date" icon="bi-currency-dollar" color="#1a4d2e" />
        <StatCard title="Total Outstanding" value={loading ? "..." : `Rs. ${totalOutstanding.toLocaleString()}`} subtitle={`${unpaidPayments.length} Units`} icon="bi-clock-history" color="#e67e22" />
        <StatCard title="Collection Rate" value={loading ? "..." : `${collectionRate.toFixed(0)}%`} subtitle="Target 100%" icon="bi-graph-up-arrow" color="#3498db" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Card title="Payment History" subtitle="List of all recently recorded transactions.">
          {loading ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading payments...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Invoice</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Tenant</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Amount</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{p.invoice_no}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{p.tenantName || 'N/A'}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{p.houseAddress || 'N/A'}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{p.paid_date ? new Date(p.paid_date).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>Rs. {parseFloat(p.amount).toLocaleString()}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ 
                          padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                          backgroundColor: p.status === "Paid" ? "#e2f2e5" : "#fff5f5",
                          color: p.status === "Paid" ? "#1a4d2e" : "#e03131",
                          textTransform: "uppercase"
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                         <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            {p.status !== "Paid" && (
                              <button 
                                onClick={() => handleStatusUpdate(p.id, "Paid")}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#1a4d2e" }}
                                title="Mark as Paid"
                                disabled={actionLoading}
                              >
                                <i className="bi bi-check-circle-fill"></i>
                              </button>
                            )}
                            <button 
                              onClick={() => navigate(`/owner/payments/edit/${p.id}`)}
                               style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                               title="Edit"
                            >
                               <i className="bi bi-pencil-square"></i>
                            </button>
                            <button 
                               onClick={() => handleDelete(p.id)}
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
                  {payments.length === 0 && (
                      <tr><td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No payments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {unpaidPayments.length > 0 && (
            <Card title="Outstanding Balances" subtitle="Payments that are currently due/overdue.">
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Invoice</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Tenant</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House</th>
                    <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Amount</th>
                    <th style={{ padding: "12px" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {unpaidPayments.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{p.invoice_no}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{p.tenantName || 'N/A'}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{p.houseAddress || 'N/A'}</td>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>Rs. {parseFloat(p.amount).toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                        <Button variant="secondary" onClick={() => alert("Reminder sent to " + p.tenantName)} disabled={actionLoading}>
                            <i className="bi bi-bell"></i> Remind
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OwnerPayment;
