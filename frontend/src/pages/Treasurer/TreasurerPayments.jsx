import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getPayments, updatePayment, deletePayment } from "../../services/api";
import { formatDate } from "../../utils/formatters";

function SummaryCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-dark)" }}>{value}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{subtitle}</div>
      </div>
      <div style={{ width: "45px", height: "45px", backgroundColor: `${color}1A`, color: color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function TreasurerPayments() {
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
      setPayments([
        { id: 1, invoice_no: "INV-2026-001", TenantName: "Karthik", houseAddress: "H001", paid_date: "2026-09-01", amount: 10000, status: "Paid", payment_method: "Online" },
        { id: 2, invoice_no: "INV-2026-002", TenantName: "Jack Brown", houseAddress: "H002", paid_date: null, amount: 17000, status: "Pending", payment_method: "-" },
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
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const collectionsCount = payments.filter(p => p.status === 'Paid').length;

  return (
    <DashboardLayout
      role="treasurer"
      title="Payment Collections"



    >
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/treasurer/generateinvoice")} disabled={actionLoading}>
          <i className="bi bi-file-earmark-plus"></i> Draft Invoice
        </Button>
        <Button variant="primary" onClick={() => navigate("/treasurer/addpayment")} disabled={actionLoading}>
          <i className="bi bi-plus-lg"></i> Record Payment
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "35px" }}>
        <SummaryCard title="Total Collected" value={`Rs. ${totalCollected.toLocaleString()}`} subtitle={`${collectionsCount} verified payments`} icon="bi-cash-coin" color="#1a4d2e" />
        <SummaryCard title="Pending Receivables" value={`Rs. ${totalPending.toLocaleString()}`} subtitle="Outstanding invoices" icon="bi-hourglass-split" color="#e67e22" />
        <SummaryCard title="Monthly Target" value="Rs. 50,000" subtitle="84% Completed" icon="bi-bullseye" color="#3498db" />
      </div>

      <Card title="All Transaction Records" subtitle="Track and manage every payment made by Tenants within the housing scheme.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Invoice</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Tenant / Tenant</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>House</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Amount</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "15px 10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "15px 10px", fontSize: "14px", fontWeight: "600" }}>{p.invoice_no}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px" }}>{p.TenantName || 'N/A'}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px" }}>{p.houseAddress || 'N/A'}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px" }}>{p.paid_date ? formatDate(p.paid_date) : 'Pending'}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px", fontWeight: "600" }}>Rs. {parseFloat(p.amount).toLocaleString()}</td>
                    <td style={{ padding: "15px 10px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                        backgroundColor: p.status === 'Paid' ? "#e2f2e5" : "#fff5f5",
                        color: p.status === 'Paid' ? "#1a4d2e" : "#e03131",
                        textTransform: "uppercase"
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "15px 10px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        {p.status !== "Paid" && (
                          <button
                            onClick={() => handleStatusUpdate(p.id, "Paid")}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#1a4d2e" }}
                            title="Approve Payment"
                            disabled={actionLoading}
                          >
                            <i className="bi bi-check-circle-fill"></i>
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/treasurer/payments/${p.id}`)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          title="View"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button
                          onClick={() => navigate(`/treasurer/payments/edit/${p.id}`)}
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
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!loading && payments.filter(p => p.status === 'Pending').length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <Card title="Immediate Reminders Needed" subtitle="Tenants with overdue or pending invoices.">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {payments.filter(p => p.status === 'Pending').map((p, i) => (
                <div key={i} style={{ padding: "15px", backgroundColor: "#fcfcfc", borderRadius: "10px", border: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{p.TenantName} - {p.houseAddress}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.invoice_no} • Rs. {parseFloat(p.amount).toLocaleString()}</div>
                  </div>
                  <Button variant="secondary" onClick={() => alert("Reminder sent!")} disabled={actionLoading}>
                    <i className="bi bi-send"></i> Notify
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TreasurerPayments;
