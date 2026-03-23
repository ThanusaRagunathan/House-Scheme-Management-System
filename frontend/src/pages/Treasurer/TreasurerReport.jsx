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

function TreasurerReports() {
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
        console.error("Failed to fetch treasury report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const totalExpenses = maintenances.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
  const netSurplus = totalRevenue - totalExpenses;
  const occupancyRate = houses.length > 0 ? (houses.filter(h => h.status === 'Occupied').length / houses.length) * 100 : 0;

  return (
    <DashboardLayout
      role="treasurer"
      title="Financial Performance & Audits"
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
        <Button variant="primary">
          <i className="bi bi-file-earmark-pdf"></i> Download Fiscal Statement
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
        <StatCard title="Total Revenue" value={loading ? "..." : `Rs. ${totalRevenue.toLocaleString()}`} icon="bi-cash-coin" color="#1a4d2e" subtitle="Verified income" />
        <StatCard title="Total Expenses" value={loading ? "..." : `Rs. ${totalExpenses.toLocaleString()}`} icon="bi-receipt-cutoff" color="#e03131" subtitle="Maintenance & Ops" />
        <StatCard title="Net Surplus" value={loading ? "..." : `Rs. ${netSurplus.toLocaleString()}`} icon="bi-piggy-bank" color="#3498db" subtitle="Available funds" />
        <StatCard title="System Health" value={loading ? "..." : `${occupancyRate.toFixed(0)}%`} icon="bi-shield-check" color="#f57c00" subtitle="Asset utilization" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Card title="Maintenance Expenditure Log" subtitle="Detailed audit trail of all maintenance-related costs.">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: "12px", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px 10px" }}>Reference</th>
                  <th style={{ padding: "12px 10px" }}>Facility</th>
                  <th style={{ padding: "12px 10px" }}>Description</th>
                  <th style={{ padding: "12px 10px" }}>Date</th>
                  <th style={{ padding: "12px 10px", textAlign: "right" }}>Cost (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.map((m, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: "600" }}>{`MNT-${i + 100}`}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{m.facility}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{m.description}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{new Date(m.date).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: "700", textAlign: "right", color: "#e03131" }}>{parseFloat(m.cost).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Revenue Stream (Recent Invoices)" subtitle="A breakdown of latest rent collections and other income sources.">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: "12px", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px 10px" }}>Invoice</th>
                  <th style={{ padding: "12px 10px" }}>Resident</th>
                  <th style={{ padding: "12px 10px" }}>House</th>
                  <th style={{ padding: "12px 10px" }}>Status</th>
                  <th style={{ padding: "12px 10px", textAlign: "right" }}>Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f9f9f9" }}>
                    <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: "600" }}>{p.invoice_no}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{p.tenantName || 'Resident'}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{p.houseAddress || 'Unit'}</td>
                    <td style={{ padding: "12px 10px" }}>
                       <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "10px", backgroundColor: p.status === 'Paid' ? "#e2f2e5" : "#fff5f5", color: p.status === 'Paid' ? "#1a4d2e" : "#e03131" }}>{p.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: "700", textAlign: "right" }}>{parseFloat(p.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerReports;
