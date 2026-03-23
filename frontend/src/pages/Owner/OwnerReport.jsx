import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getPayments, getMaintenances, getHouses } from "../../services/api";

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="glass-card" style={{ padding: "20px", backgroundColor: "white", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500" }}>{title}</div>
          <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "5px", color: "var(--text-dark)" }}>{value}</div>
          {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{subtitle}</div>}
        </div>
        <div style={{ color: color || "var(--primary)", fontSize: "20px" }}>
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}

function OwnerReport() {
  const [payments, setPayments] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payData, mainData, houseData] = await Promise.all([
          getPayments(),
          getMaintenances(),
          getHouses()
        ]);
        setPayments(payData);
        setMaintenances(mainData);
        setHouses(houseData);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const totalExpenses = maintenances.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
  const netIncome = totalRevenue - totalExpenses;
  const occupancyRate = houses.length > 0 ? (houses.filter(h => h.status === 'Occupied').length / houses.length) * 100 : 0;

  return (
    <DashboardLayout
      role="owner"
      title="Financial Performance Report"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
        <Button variant="primary">
          <i className="bi bi-file-earmark-pdf"></i> Export Statement
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
        <StatCard title="Total Revenue" value={loading ? "..." : `Rs. ${totalRevenue.toLocaleString()}`} icon="bi-currency-dollar" color="#1a4d2e" subtitle="Paid invoices only" />
        <StatCard title="Total Expenses" value={loading ? "..." : `Rs. ${totalExpenses.toLocaleString()}`} icon="bi-cash-stack" color="#e03131" subtitle="Maintenance costs" />
        <StatCard title="Net Income" value={loading ? "..." : `Rs. ${netIncome.toLocaleString()}`} icon="bi-graph-up-arrow" color="#3498db" subtitle="Profit after expenses" />
        <StatCard title="Occupancy" value={loading ? "..." : `${occupancyRate.toFixed(0)}%`} icon="bi-bar-chart" color="#f57c00" subtitle={`${houses.filter(h => h.status === 'Occupied').length} / ${houses.length} Units`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <Card title="Recent Revenue" subtitle="A summary of the latest incoming rent payments.">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: "12px", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: "10px" }}>Date</th>
                <th style={{ padding: "10px" }}>Payer</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.filter(p => p.status === 'Paid').slice(0, 5).map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td style={{ padding: "10px", fontSize: "13px" }}>{new Date(p.payment_date).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", fontSize: "13px" }}>{p.payer_name || 'Resident'}</td>
                  <td style={{ padding: "10px", fontSize: "13px", fontWeight: "600", textAlign: "right" }}>Rs. {parseFloat(p.amount).toLocaleString()}</td>
                </tr>
              ))}
              {!loading && payments.filter(p => p.status === 'Paid').length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No revenue recorded.</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card title="Recent Expenses" subtitle="A summary of the latest maintenance expenditures.">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: "12px", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: "10px" }}>Date</th>
                <th style={{ padding: "10px" }}>Facility</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {maintenances.slice(0, 5).map((m, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td style={{ padding: "10px", fontSize: "13px" }}>{new Date(m.date).toLocaleDateString()}</td>
                  <td style={{ padding: "10px", fontSize: "13px" }}>{m.facility}</td>
                  <td style={{ padding: "10px", fontSize: "13px", fontWeight: "600", textAlign: "right", color: "#e03131" }}>Rs. {parseFloat(m.cost).toLocaleString()}</td>
                </tr>
              ))}
              {!loading && maintenances.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No expenses recorded.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerReport;
