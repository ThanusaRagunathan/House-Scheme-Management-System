import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getHouses } from "../../services/api";

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
      totalRent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const houses = await getHouses();
            const total = houses.length;
            const occupiedCount = houses.filter(h => h.status === 'Occupied').length;
            const totalRentValue = houses.reduce((sum, h) => sum + (parseFloat(h.rent) || 0), 0);
            
            setStats({
                totalHouses: total,
                occupied: occupiedCount,
                vacant: total - occupiedCount,
                totalRent: totalRentValue
            });
        } catch (error) {
            console.error("Failed to load overview data:", error);
            // Fallback for demo if API fails
            setStats({ totalHouses: 12, occupied: 8, vacant: 4, totalRent: 124000 });
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout
      role="owner"
      title="Dashboard Overview"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <StatCard title="Total Houses" value={loading ? "..." : stats.totalHouses} subtitle={`${stats.occupied} occupied, ${stats.vacant} vacant`} icon="bi-buildings" color="#1a4d2e" />
        <StatCard title="Total Tenants" value={loading ? "..." : stats.occupied} subtitle="Active leases" icon="bi-people" color="#3498db" />
        <StatCard title="Pending Payments" value="1" subtitle="Requires attention" icon="bi-exclamation-circle" color="#e67e22" />
        <StatCard title="Monthly Revenue" value={loading ? "..." : `Rs. ${stats.totalRent.toLocaleString()}`} subtitle="Projected income" icon="bi-currency-dollar" color="#9b59b6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div className="glass-card" style={{ padding: "30px", backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h3 style={{ fontSize: "18px" }}>Recent Activity</h3>
            <button style={{ color: "var(--primary)", fontSize: "14px", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <ActivityItem title="Payment received from Karthik S." time="2 hours ago" type="payment" />
            <ActivityItem title="New maintenance request: House #12" time="5 hours ago" type="maintenance" />
            <ActivityItem title="Lease agreement updated for Priya R." time="Yesterday" type="document" />
            <ActivityItem title="Complaint resolved: Water leakage" time="2 days ago" type="complaint" />
          </div>
        </div>

        <div className="glass-card" style={{ padding: "30px", backgroundColor: "var(--primary)", color: "white" }}>
          <h3 style={{ fontSize: "18px", color: "white", marginBottom: "20px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button 
              onClick={() => navigate('/owner/addhouse')}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", border: "none", cursor: "pointer" }}
            >
              <i className="bi bi-plus-circle"></i> Add New Property
            </button>
            <button 
              onClick={() => navigate('/owner/addtenant')}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", border: "none", cursor: "pointer" }}
            >
              <i className="bi bi-person-plus"></i> Register Tenant
            </button>
            <button 
                onClick={() => navigate('/owner/createtask')}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.1)", color: "white", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", border: "none", cursor: "pointer" }}
            >
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
    switch(type) {
      case 'payment': return 'bi-cash';
      case 'maintenance': return 'bi-tools';
      case 'document': return 'bi-file-text';
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


