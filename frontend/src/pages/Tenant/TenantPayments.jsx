import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getPayments, getTenantProfile } from "../../services/api";

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

function TenantPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, profileData] = await Promise.all([
          getPayments(),
          getTenantProfile()
        ]);
        setPayments(paymentsData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        // Fallback for demo
        setPayments([
          { invoice_no: "INV-2026-001", paid_date: "2026-09-01", amount: 10000, status: "Paid", payment_method: "Online" },
          { invoice_no: "INV-2026-002", paid_date: null, amount: 10000, status: "Pending", payment_method: "-" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const transactionCount = payments.length;

  return (
    <DashboardLayout
      role="tenant"
      title="My Payments & Invoices"
      userName={profile?.username || "Resident"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
        <Button variant="primary" onClick={() => navigate("/tenant/addpayment")}>
          <i className="bi bi-plus-lg"></i> Make New Payment
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "35px" }}>
        <SummaryCard title="Total Paid" value={`Rs. ${totalPaid.toLocaleString()}`} subtitle="All time" icon="bi-check-all" color="#1a4d2e" />
        <SummaryCard title="Outstanding" value={`Rs. ${totalPending.toLocaleString()}`} subtitle="Due now" icon="bi-clock-history" color="#e67e22" />
        <SummaryCard title="History" value={transactionCount} subtitle="Total invoices" icon="bi-receipt" color="#3498db" />
      </div>

      <Card title="Detailed Payment History" subtitle="A complete record of your rent and facility payments.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Invoice No.</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Amount</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                  <th style={{ padding: "15px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Method</th>
                  <th style={{ padding: "15px 10px" }}></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "15px 10px", fontSize: "14px", fontWeight: "600" }}>{p.invoice_no}</td>
                    <td style={{ padding: "15px 10px", fontSize: "14px" }}>{p.paid_date ? new Date(p.paid_date).toLocaleDateString() : 'Awaiting Payment'}</td>
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
                    <td style={{ padding: "15px 10px", fontSize: "14px", color: "#555" }}>{p.payment_method || '-'}</td>
                    <td style={{ padding: "15px 10px", textAlign: "right" }}>
                      <Button variant="secondary" onClick={() => alert("Downloading receipt for " + p.invoice_no)}>
                        <i className="bi bi-download"></i> Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No payment history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TenantPayments;
