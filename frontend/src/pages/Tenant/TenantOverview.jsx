import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getTenantProfile, getComplaints } from "../../services/api";

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

function TenantOverview() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [profileData, complaintsData] = await Promise.all([
                getTenantProfile(),
                getComplaints()
            ]);
            setProfile(profileData);
            setComplaints(complaintsData.slice(0, 3)); // Show only recent 3
        } catch (error) {
            console.error("Failed to load resident data:", error);
            // Fallback for demonstration
            setProfile({ username: "Karthik S.", occupation: "Software Engineer", email: "karthik.s@gmail.com", phone: "+94 77 900 1122", date_of_birth: "1995-02-28", houseAddress: "Unit #H001" });
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  return (
    <DashboardLayout
      role="tenant"
      title="Resident Dashboard"
      userName={loading ? "..." : (profile?.username || "Resident")}
      userInitials={profile?.username ? profile.username.charAt(0) : "R"}
      userRoleLabel={loading ? "..." : `${profile?.houseAddress || "Unallocated"} - Tenant`}
    >
      {/* Important Notice */}
      <div style={{ 
        backgroundColor: "#fff8e1", 
        border: "1px solid #ffe082", 
        borderRadius: "12px", 
        padding: "15px 25px", 
        marginBottom: "30px", 
        display: "flex", 
        alignItems: "center", 
        gap: "15px" 
      }}>
        <i className="bi bi-megaphone-fill" style={{ color: "#f57c00", fontSize: "20px" }}></i>
        <span style={{ fontSize: "14px", color: "#5d4037", fontWeight: "500" }}>
          Community Notice: The swimming pool will be closed for quarterly maintenance from Oct 22nd to 24th. 
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <StatCard title="Monthly Rent" value="Rs. 10,000" subtitle={profile?.houseAddress || "Unit Details"} icon="bi-house-heart" color="#1a4d2e" />
        <StatCard title="Next Due Date" value="Oct 01, 2026" subtitle="Scheduled" icon="bi-calendar-check" color="#e67e22" />
        <StatCard title="Open Complaints" value={loading ? "..." : `${openComplaintsCount} Pending`} subtitle="Active Tickets" icon="bi-chat-left-text" color="#3498db" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "25px" }}>
        {/* Recent Complaints Table */}
        <div className="glass-card" style={{ padding: "30px", backgroundColor: "white" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
             <h3 style={{ fontSize: "18px" }}>Recent Complaints</h3>
             <button 
               onClick={() => navigate('/tenant/addcomplaint')}
               style={{ backgroundColor: "var(--primary)", color: "white", padding: "8px 15px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer" }}
             >
               New Complaint
             </button>
           </div>
           {loading ? (
               <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading records...</p>
           ) : complaints.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                        <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Title</th>
                        <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                        <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {complaints.map((c, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "12px 10px", fontSize: "14px", fontWeight: "500" }}>{c.title}</td>
                            <td style={{ padding: "12px 10px", fontSize: "14px" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: "12px 10px" }}>
                                <span style={{ 
                                    backgroundColor: c.status === 'Resolved' ? "#e2f2e5" : "#fff5f5", 
                                    color: c.status === 'Resolved' ? "#1a4d2e" : "#e53e3e", 
                                    padding: "4px 10px", 
                                    borderRadius: "20px", 
                                    fontSize: "10px", 
                                    fontWeight: "700",
                                    textTransform: "uppercase"
                                }}>{c.status}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
           ) : (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                    <i className="bi bi-journal-check" style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}></i>
                    No complaints registered.
                </div>
           )}
        </div>

        {/* Resident Info Card */}
        <div className="glass-card" style={{ padding: "30px", backgroundColor: "white" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Resident Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <InfoRow label="Occupation" value={loading ? "..." : (profile?.occupation || "N/A")} />
            <InfoRow label="Email" value={loading ? "..." : (profile?.email || "N/A")} />
            <InfoRow label="Phone" value={loading ? "..." : (profile?.phone || "N/A")} />
            <InfoRow label="DOB" value={loading ? "..." : (profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "N/A")} />
            <hr style={{ border: "0", borderTop: "1px solid #f0f0f0", margin: "5px 0" }} />
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>Quick Support</h4>
            <div style={{ backgroundColor: "#f8f9fa", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
                Contact Security: <strong style={{ color: "var(--primary)" }}>+94 11 222 3344</strong>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: "500" }}>{value}</span>
    </div>
  );
}

export default TenantOverview;

