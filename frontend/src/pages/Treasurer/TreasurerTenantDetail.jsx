import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getTenants } from "../../services/api";
import { formatDate } from "../../utils/formatters";

function TreasurerTenantDetail() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [Tenant, setTenant] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchTenant = async () => {
         setLoading(true);
         try {
            const Tenants = await getTenants();
            const found = Tenants.find(t => String(t.id) === String(id));
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
            console.error("Failed to fetch Tenant details:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchTenant();
   }, [id]);

   if (loading) return <DashboardLayout role="treasurer" title="Tenant Detail"><p>Loading...</p></DashboardLayout>;
   if (!Tenant) return <DashboardLayout role="treasurer" title="Tenant Detail"><p>Tenant not found.</p></DashboardLayout>;

   return (
      <DashboardLayout
         role="treasurer"
         title={`Tenant Profile - ${Tenant.name || Tenant.username}`}



      >
         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
            <Button variant="secondary" onClick={() => navigate("/treasurer/Tenants")}>
               <i className="bi bi-arrow-left"></i> Back to Directory
            </Button>
            <div style={{ display: "flex", gap: "10px" }}>
               <Button variant="primary" onClick={() => navigate(`/treasurer/Tenants/edit/${id}`)}>
                  <i className="bi bi-pencil"></i> Edit Profile
               </Button>
            </div>
         </div>

         <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
               <Card title="Identification">
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                     <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(26, 77, 46, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", margin: "0 auto 15px" }}>
                        {(Tenant.name || Tenant.username)?.charAt(0)}
                     </div>
                     <div style={{ fontWeight: "700", fontSize: "18px" }}>{Tenant.name || Tenant.username}</div>
                     <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tenant ID: T-{id}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Status:</span>
                        <span style={{ fontWeight: "600", color: "#1a4d2e" }}>{Tenant.status || "Active"}</span>
                     </div>
                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--text-muted)" }}>NIC:</span>
                        <span style={{ fontWeight: "600" }}>{Tenant.nic || "N/A"}</span>
                     </div>
                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Date of Birth:</span>
                        <span style={{ fontWeight: "600" }}>{Tenant.date_of_birth ? formatDate(Tenant.date_of_birth) : "N/A"}</span>
                     </div>
                  </div>

               </Card>

               <Card title="Unit Info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div>
                        <div style={{ fontWeight: "700", fontSize: "15px" }}>{Tenant.houseCode || Tenant.houseAddress || "Unallocated"}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Primary Residence</div>
                     </div>
                     <Button variant="secondary" size="sm" onClick={() => navigate(`/treasurer/houses`)}>View House</Button>
                  </div>
               </Card>

               <Card title="Family Members">
                  {Tenant.familyMembers && Tenant.familyMembers.length > 0 ? (
                     <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {Tenant.familyMembers.map((member, idx) => (
                           <div key={idx} style={{ backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "8px", fontSize: "13px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                 <strong style={{ color: "var(--primary)" }}>{member.name}</strong>
                                 <span style={{ fontSize: "11px", backgroundColor: "#e2f2e5", color: "#1a4d2e", padding: "2px 6px", borderRadius: "4px" }}>{member.relation || "Dependent"}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "12px" }}>
                                 <span>{member.occupation || "N/A"}</span>
                                 <span>NIC: {member.nic || "N/A"}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", margin: "10px 0" }}>No registered dependents.</p>
                  )}
               </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
               <Card title="Contact & Financial Details">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "25px" }}>
                     <div>
                        <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
                        <div style={{ fontSize: "15px", fontWeight: "600" }}>{Tenant.email}</div>
                     </div>
                     <div>
                        <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Phone Number</label>
                        <div style={{ fontSize: "15px", fontWeight: "600" }}>{Tenant.phone}</div>
                     </div>
                     <div>
                        <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Lease Start</label>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{formatDate(Tenant.startDate)}</div>
                     </div>
                     <div>
                        <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Lease End</label>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{formatDate(Tenant.endDate)}</div>
                     </div>
                  </div>

                  <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>
                     <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>Emergency Contact</div>
                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span>{Tenant.emergencyContact?.split('-')[0] || "N/A"}</span>
                        <span style={{ fontWeight: "600" }}>{Tenant.emergencyContact?.split('-')[1] || "Mobile"}</span>
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
