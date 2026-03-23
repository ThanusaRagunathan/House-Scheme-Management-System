import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getTenants, getHouses } from "../../services/api";

function OwnerTenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tenants, houses] = await Promise.all([getTenants(), getHouses()]);
        const foundTenant = tenants.find(t => String(t.id) === String(id));
        
        if (foundTenant) {
          setTenant(foundTenant);
          if (foundTenant.houseId) {
            setHouse(houses.find(h => String(h.id) === String(foundTenant.houseId)));
          }
        } else {
          // Fallback demo data
          setTenant({
            id: id,
            name: "Jack Sparrow",
            email: "jack@blackpearl.com",
            phone: "0771234567",
            status: "Active",
            startDate: "2024-01-01",
            endDate: "2025-01-01",
            nic: "199012345678",
            emergencyContact: "Gibbs - 0779998887",
            houseCode: "H001"
          });
          setHouse({ houseCode: "H001", address: "123, Oak Street, Colombo 07" });
        }
      } catch (error) {
        console.error("Failed to fetch tenant details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <DashboardLayout role="owner" title="Tenant Details"><p>Loading...</p></DashboardLayout>;
  if (!tenant) return <DashboardLayout role="owner" title="Tenant Details"><p>Tenant not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title={`Tenant Profile - ${tenant.name}`}
      userName="Thanusa"
      userInitials="TR"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/owner/tenants")}>
          <i className="bi bi-arrow-left"></i> Back to Tenants
        </Button>
        <Button variant="primary" onClick={() => navigate(`/owner/addtenant?edit=${id}`)}>
          <i className="bi bi-pencil"></i> Edit Profile
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Identification">
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                 <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(26, 77, 46, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", margin: "0 auto 15px" }}>
                    {tenant.name?.charAt(0)}
                 </div>
                 <div style={{ fontWeight: "700", fontSize: "18px" }}>{tenant.name}</div>
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

           <Card title="Emergency Contact">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                 <div style={{ width: "35px", height: "35px", backgroundColor: "#fff5f5", color: "#e03131", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bi bi-telephone-outbound"></i>
                 </div>
                 <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{tenant.emergencyContact?.split('-')[0] || "N/A"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{tenant.emergencyContact?.split('-')[1] || "Mobile"}</div>
                 </div>
              </div>
           </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Contact & Lease Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{tenant.email}</div>
                 </div>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Phone Number</label>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{tenant.phone}</div>
                 </div>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Lease Start</label>
                    <div style={{ fontSize: "15px" }}>{tenant.startDate || "N/A"}</div>
                 </div>
                 <div>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Lease End</label>
                    <div style={{ fontSize: "15px" }}>{tenant.endDate || "N/A"}</div>
                 </div>
              </div>
           </Card>

           <Card title="Assigned Residence">
              {house ? (
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                       <div style={{ fontSize: "24px", color: "var(--primary)" }}>
                          <i className="bi bi-house-door"></i>
                       </div>
                       <div>
                          <div style={{ fontWeight: "700" }}>{house.houseCode}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{house.address}</div>
                       </div>
                    </div>
                    <Button variant="secondary" onClick={() => navigate(`/owner/houses/${house.id}`)}>
                       View house
                    </Button>
                 </div>
              ) : (
                 <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No house assigned to this tenant yet.</p>
              )}
           </Card>

           <Card title="Financial Overview">
              <div style={{ display: "flex", gap: "20px" }}>
                 <div style={{ flex: 1, padding: "15px", backgroundColor: "#f0f7f2", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#1a4d2e", textTransform: "uppercase", marginBottom: "5px" }}>Total Paid</div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>Rs. 45,000</div>
                 </div>
                 <div style={{ flex: 1, padding: "15px", backgroundColor: "#fff5f5", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#e03131", textTransform: "uppercase", marginBottom: "5px" }}>Arrears</div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>Rs. 10,000</div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OwnerTenantDetail;
