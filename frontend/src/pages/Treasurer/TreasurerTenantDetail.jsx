import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getTenants } from "../../services/api";

function TreasurerTenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      try {
        const tenants = await getTenants();
        const found = tenants.find(t => String(t.id) === String(id));
        if (found) {
          setTenant(found);
        } else {
          // Fallback demo data
          setTenant({
            id: id,
            name: "Jack Sparrow",
            email: "jack@blackpearl.com",
            phone: "0771234567",
            houseCode: "H001",
            nic: "199012345678",
            emergencyContact: "Gibbs - 0779998887",
            status: "Active",
            rentAmount: 10000,
            joinDate: "2024-01-01"
          });
        }
      } catch (error) {
        console.error("Failed to fetch tenant details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  if (loading) return <DashboardLayout role="treasurer" title="Tenant Detail"><p>Loading...</p></DashboardLayout>;
  if (!tenant) return <DashboardLayout role="treasurer" title="Tenant Detail"><p>Tenant not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="treasurer"
      title={`Resident Profile - ${tenant.name || tenant.username}`}
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/treasurer/tenants")}>
          <i className="bi bi-arrow-left"></i> Back to Directory
        </Button>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="primary" onClick={() => navigate(`/treasurer/tenants/edit/${id}`)}>
            <i className="bi bi-pencil"></i> Edit Profile
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Identification">
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                 <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(26, 77, 46, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", margin: "0 auto 15px" }}>
                    {(tenant.name || tenant.username)?.charAt(0)}
                 </div>
                 <div style={{ fontWeight: "700", fontSize: "18px" }}>{tenant.name || tenant.username}</div>
                 <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tenant ID: T-{id}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Status:</span>
                    <span style={{ fontWeight: "600", color: "#1a4d2e" }}>{tenant.status || "Active"}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-muted)" }}>NIC:</span>
                    <span style={{ fontWeight: "600" }}>{tenant.nic || "N/A"}</span>
                 </div>
              </div>
           </Card>

           <Card title="Unit Info">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>{tenant.houseCode || tenant.houseAddress || "Unallocated"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Primary Residence</div>
                 </div>
                 <Button variant="secondary" size="sm" onClick={() => navigate(`/treasurer/houses`)}>View House</Button>
              </div>
           </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Contact & Financial Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{tenant.email}</div>
                 </div>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Phone Number</label>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{tenant.phone}</div>
                 </div>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Rent</label>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary)" }}>Rs. {(tenant.rentAmount || 10000).toLocaleString()}</div>
                 </div>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Joined Since</label>
                    <div style={{ fontSize: "15px" }}>{tenant.joinDate || "2024-01-01"}</div>
                 </div>
              </div>
              
              <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>
                 <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>Emergency Contact</div>
                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>{tenant.emergencyContact?.split('-')[0] || "N/A"}</span>
                    <span style={{ fontWeight: "600" }}>{tenant.emergencyContact?.split('-')[1] || "Mobile"}</span>
                 </div>
              </div>
           </Card>

           <Card title="Payment Status Summary">
              <div style={{ display: "flex", gap: "20px" }}>
                 <div style={{ flex: 1, padding: "15px", backgroundColor: "#f0f7f2", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#1a4d2e", textTransform: "uppercase", marginBottom: "5px" }}>Total Invoiced</div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>Rs. 45,000</div>
                 </div>
                 <div style={{ flex: 1, padding: "15px", backgroundColor: "#fff5f5", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#e03131", textTransform: "uppercase", marginBottom: "5px" }}>Arrears</div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>Rs. 10,000</div>
                 </div>
                 <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button variant="primary" size="sm" onClick={() => navigate('/treasurer/payments')}>History</Button>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerTenantDetail;
