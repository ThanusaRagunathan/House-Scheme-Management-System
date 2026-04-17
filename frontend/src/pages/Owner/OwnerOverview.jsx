import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getHouses, getTenants, getPayments, getMaintenances } from "../../services/api";

function StatCard({ title, subtitle, value, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}>
      <div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500", marginBottom: "5px" }}>{title}</div>
        <div style={{ fontSize: "28px", fontWeight: "700", color: color || "var(--primary)" }}>{value}</div>
        {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>{subtitle}</div>}
      </div>
      <div style={{ padding: "15px", backgroundColor: color ? `${color}1A` : "rgba(26, 77, 46, 0.1)", borderRadius: "12px", color: color || "var(--primary)", fontSize: "24px" }}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

function OwnerOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalHouses: 0,
    occupied: 0,
    vacant: 0,
    totalRent: 0,
    totalExpenditure: 0,
    pendingPayments: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [houses, tenants, payments, maintenances] = await Promise.all([
          getHouses(),
          getTenants(),
          getPayments(),
          getMaintenances()
        ]);

        const total = houses.length;
        const occupiedCount = houses.filter(h => h.status === 'Occupied').length;
        const totalRentValue = houses.reduce((sum, h) => sum + (parseFloat(h.rent || h.rent_amount) || 0), 0);
        const totalExpenditure = maintenances.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
        const pendingPayments = payments.filter(p => p.status === 'Pending').length;

        setStats({
          totalHouses: total,
          occupied: occupiedCount,
          vacant: total - occupiedCount,
          totalRent: totalRentValue,
          totalExpenditure,
          pendingPayments
        });

        // Combine for activity feed
        const activity = [
          ...tenants.map(t => ({ title: `New Tenant: ${t.name || t.fullName || t.username}`, time: "Recently Added", type: "document" })),
          ...payments.filter(p => p.paid_date).slice(0, 5).map(p => ({ title: `Payment Received: Rs. ${parseFloat(p.amount).toLocaleString()}`, time: new Date(p.paid_date).toLocaleDateString(), type: "payment" })),
          ...maintenances.slice(0, 3).map(m => ({ title: `Maintenance: ${m.description}`, time: m.scheduled_date ? new Date(m.scheduled_date).toLocaleDateString() : 'Scheduled', type: "maintenance" }))
        ].slice(0, 5);

        setRecentActivity(activity);
      } catch (error) {
        console.error("Failed to load overview data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout role="owner" title="Dashboard Overview">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <StatCard title="Total Houses" value={loading ? "..." : stats.totalHouses} subtitle={`${stats.occupied} occupied, ${stats.vacant} vacant`} icon="bi-buildings" color="#1a4d2e" />
        <StatCard title="Total Tenants" value={loading ? "..." : stats.occupied} subtitle="Active leases" icon="bi-people" color="#3498db" />
        <StatCard title="Pending Payments" value={loading ? "..." : stats.pendingPayments} subtitle="Requires attention" icon="bi-exclamation-circle" color="#e67e22" />
        <StatCard title="Monthly Revenue" value={loading ? "..." : `Rs. ${stats.totalRent.toLocaleString()}`} subtitle="Projected income" icon="bi-currency-dollar" color="#9b59b6" />
        <StatCard title="Total Expenditure" value={loading ? "..." : `Rs. ${stats.totalExpenditure.toLocaleString()}`} subtitle="All maintenance costs" icon="bi-tools" color="#e03131" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div className="glass-card" style={{ padding: "30px", backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px" }}>Recent Activity</h3>
            <button 
              onClick={() => navigate('/owner/tenants')}
              style={{ color: "var(--primary)", fontSize: "14px", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((act, id) => (
                <ActivityItem key={id} title={act.title} time={act.time} type={act.type} />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                <i className="bi bi-clock-history" style={{ fontSize: "32px", display: "block", marginBottom: "10px", color: "#eee" }}></i>
                No recent activity found.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "30px", backgroundColor: "var(--primary)", color: "white" }}>
          <h3 style={{ fontSize: "18px", color: "white", marginBottom: "20px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={() => navigate('/owner/addhouse')} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", border: "none", cursor: "pointer" }}>
              <i className="bi bi-plus-circle"></i> Add New House
            </button>
            <button onClick={() => navigate('/owner/addTenant')} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", border: "none", cursor: "pointer" }}>
              <i className="bi bi-person-plus"></i> Register Tenant
            </button>
            <button onClick={() => navigate('/owner/createtask')} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", border: "none", cursor: "pointer" }}>
              <i className="bi bi-hammer"></i> Create Task
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ActivityItem({ title, time, type }) {
  const getIcon = () => {
    switch (type) {
      case 'payment': return 'bi-cash';
      case 'maintenance': return 'bi-tools';
      case 'document': return 'bi-person-check';
      case 'complaint': return 'bi-chat-left-text';
      default: return 'bi-dot';
    }
  };

  return (
    <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", paddingBottom: "15px", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
        <i className={`bi ${getIcon()}`}></i>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "14px", fontWeight: "500" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{time}</div>
      </div>
    </div>
  );
}

export default OwnerOverview;
