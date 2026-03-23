import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getHouses } from "../../services/api";

function OwnerHouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouse = async () => {
      setLoading(true);
      try {
        const houses = await getHouses();
        const found = houses.find(h => String(h.id) === String(id));
        if (found) {
          setHouse(found);
        } else {
          // Fallback demo data
          setHouse({
            id: id,
            houseCode: "H001",
            address: "123, Oak Street, Colombo 07",
            houseType: "Luxury Apartment",
            rooms: 3,
            bathrooms: 2,
            area: "1200 sqft",
            rent: 15000,
            status: "Occupied",
            description: "A beautiful 3-bedroom apartment with a city view. Located in a prime residential area with 24/7 security and parking.",
            tenants: [
              { name: "Jack Sparrow", email: "jack@blackpearl.com", phone: "0771234567", startDate: "2024-01-01" }
            ],
            amenities: ["WiFi", "Pool Access", "Gym", "Parking"]
          });
        }
      } catch (error) {
        console.error("Failed to fetch house details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  if (loading) return <DashboardLayout role="owner" title="House Details"><p>Loading...</p></DashboardLayout>;
  if (!house) return <DashboardLayout role="owner" title="House Details"><p>House not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title={`House Details - ${house.houseCode || house.id}`}
      userName="Thanusa"
      userInitials="TR"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/owner/houses")}>
          <i className="bi bi-arrow-left"></i> Back to List
        </Button>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="primary" onClick={() => navigate(`/owner/addhouse?edit=${id}`)}>
            <i className="bi bi-pencil"></i> Edit Property
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Property Information">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Address</label>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>{house.address}</div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Status</label>
                <div>
                   <span style={{ 
                    padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    backgroundColor: house.status === "Occupied" ? "#e2f2e5" : "#fff5f5",
                    color: house.status === "Occupied" ? "#1a4d2e" : "#e03131",
                    textTransform: "uppercase"
                  }}>
                    {house.status}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Type</label>
                <div style={{ fontSize: "15px" }}>{house.houseType}</div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Rent</label>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary)" }}>Rs. {parseFloat(house.rent).toLocaleString()}</div>
              </div>
            </div>
            
            <div style={{ marginTop: "20px" }}>
               <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Description</label>
               <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#555" }}>{house.description}</p>
            </div>
          </Card>

          <Card title="Current Tenants">
             {house.tenants && house.tenants.length > 0 ? (
               <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                 {house.tenants.map((tenant, idx) => (
                   <div key={idx} style={{ padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: "700" }}>{tenant.name || tenant}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{tenant.email || "No email"} • {tenant.phone || "No phone"}</div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/owner/tenants`)}>
                        Manage
                      </Button>
                   </div>
                 ))}
               </div>
             ) : (
               <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No active tenants for this property.</p>
             )}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Specs & Amenities">
             <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                   <span>Rooms:</span>
                   <span style={{ fontWeight: "600" }}>{house.rooms || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                   <span>Bathrooms:</span>
                   <span style={{ fontWeight: "600" }}>{house.bathrooms || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                   <span>Area:</span>
                   <span style={{ fontWeight: "600" }}>{house.area || "N/A"}</span>
                </div>
             </div>
             <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "15px 0" }} />
             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(house.amenities || ["WiFi", "Parking"]).map((am, i) => (
                  <span key={i} style={{ fontSize: "11px", backgroundColor: "#f0f0f0", padding: "4px 10px", borderRadius: "5px" }}>{am}</span>
                ))}
             </div>
          </Card>

          <Card title="Quick Actions">
             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Button variant="secondary" style={{ width: "100%", textAlign: "left" }} onClick={() => navigate(`/owner/payments`)}>
                   <i className="bi bi-cash"></i> View Payment History
                </Button>
                <Button variant="secondary" style={{ width: "100%", textAlign: "left" }} onClick={() => navigate(`/owner/complaints`)}>
                   <i className="bi bi-exclamation-triangle"></i> Recent Complaints
                </Button>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OwnerHouseDetail;
