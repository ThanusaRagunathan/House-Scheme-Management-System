import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getTenants, getHouses, getPayments } from "../../services/api";
import { formatDate } from "../../utils/formatters";

function OwnerTenantDetail() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [Tenant, setTenant] = useState(null);
   const [house, setHouse] = useState(null);
   const [loading, setLoading] = useState(true);
   const [payments, setPayments] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const [Tenants, houses] = await Promise.all([getTenants(), getHouses()]);
            const foundTenant = Tenants.find(t => String(t.id) === String(id));

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

            // Fetch real payments for this tenant
            const tenantPayments = await getPayments({ tenantId: id });
            setPayments(tenantPayments);
         } catch (error) {
            console.error("Failed to fetch Tenant details:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [id]);

   if (loading) return <DashboardLayout role="owner" title="Tenant Details"><p>Loading...</p></DashboardLayout>;
   if (!Tenant) return <DashboardLayout role="owner" title="Tenant Details"><p>Tenant not found.</p></DashboardLayout>;

   return (
      <DashboardLayout
         role="owner"
         title={`Tenant Profile - ${Tenant.name}`}
         headerAction={
            <div style={{ display: "flex", gap: "10px" }}>
               <Button variant="secondary" onClick={() => navigate("/owner/Tenants")}>
                  <i className="bi bi-arrow-left"></i> Back
               </Button>
               <Button variant="primary" onClick={() => navigate(`/owner/Tenants/edit/${id}`)}>
                  <i className="bi bi-pencil"></i> Edit Profile
               </Button>
            </div>
         }
      >
         <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px", marginTop: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
               <Card title="Identification">
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                     <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(26, 77, 46, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", margin: "0 auto 15px" }}>
                        {Tenant.name?.charAt(0)}
                     </div>
                     <div style={{ fontWeight: "700", fontSize: "18px" }}>{Tenant.name}</div>
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

               <Card title="Emergency Contact">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                     <div style={{ width: "35px", height: "35px", backgroundColor: "#fff5f5", color: "#e03131", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="bi bi-telephone-outbound"></i>
                     </div>
                     <div>
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>{Tenant.emergencyContact?.split('-')[0] || "N/A"}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{Tenant.emergencyContact?.split('-')[1] || "Mobile"}</div>
                     </div>
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
               <Card title="Contact & Lease Details">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
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
                     <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No house assigned to this Tenant yet.</p>
                  )}
               </Card>

                <Card title="Detailed Payment History" subtitle="Live financial record for this tenant.">
                   <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                         <thead>
                            <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                               <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Date</th>
                               <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Amount</th>
                               <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Status</th>
                               <th style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>Invoice</th>
                            </tr>
                         </thead>
                         <tbody>
                            {payments.length > 0 ? (
                               payments.map((p, i) => (
                                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                     <td style={{ padding: "12px 10px", fontSize: "14px" }}>{formatDate(p.paid_date || p.due_date)}</td>
                                     <td style={{ padding: "12px 10px", fontSize: "14px", fontWeight: "600" }}>Rs. {parseFloat(p.amount).toLocaleString()}</td>
                                     <td style={{ padding: "12px 10px" }}>
                                        <span style={{
                                           backgroundColor: p.status === 'Paid' ? "#e2f2e5" : "#fff5f5",
                                           color: p.status === 'Paid' ? "#1a4d2e" : "#e53e3e",
                                           padding: "4px 10px",
                                           borderRadius: "20px",
                                           fontSize: "10px",
                                           fontWeight: "700"
                                        }}>{p.status}</span>
                                     </td>
                                     <td style={{ padding: "12px 10px", fontSize: "14px" }}>{p.invoice_no}</td>
                                  </tr>
                               ))
                            ) : (
                               <tr>
                                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>No payment history found.</td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </Card>
             </div>
          </div>
      </DashboardLayout>
   );
}

export default OwnerTenantDetail;
