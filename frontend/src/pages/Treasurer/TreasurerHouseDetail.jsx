import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getHouses } from "../../services/api";

function TreasurerHouseDetail() {
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
            houseType: "Apartment",
            rooms: 3,
            rent: 10000,
            status: "Occupied",
            owner: "Thanusa Ragunathan",
            tenant: "Jack Sparrow",
            history: [
              { date: "2024-01-01", type: "Payment", amount: 10000, status: "Verified" },
              { date: "2023-12-01", type: "Maintenance", amount: 1500, status: "Paid" }
            ]
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

  if (loading) return <DashboardLayout role="treasurer" title="House Details"><p>Loading...</p></DashboardLayout>;
  if (!house) return <DashboardLayout role="treasurer" title="House Details"><p>House not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="treasurer"
      title={`Inventory Detail - ${house.houseCode || house.id}`}
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/treasurer/houses")}>
          <i className="bi bi-arrow-left"></i> Back to Inventory
        </Button>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="primary" onClick={() => navigate(`/treasurer/houses/edit/${id}`)}>
            <i className="bi bi-pencil"></i> Edit Unit
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Unit Information">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>House Code</label>
                <div style={{ fontSize: "16px", fontWeight: "700" }}>{house.houseCode}</div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Current Status</label>
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
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Rent</label>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--primary)" }}>Rs. {parseFloat(house.rent).toLocaleString()}</div>
              </div>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Unit Type</label>
                <div style={{ fontSize: "15px" }}>{house.houseType || "Default"}</div>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Full Address</label>
                <div style={{ fontSize: "15px" }}>{house.address}</div>
            </div>
          </Card>

          <Card title="Ownership & Resident">
             <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Owner</div>
                      <div style={{ fontWeight: "600" }}>{house.owner || "Thanusa Ragunathan"}</div>
                   </div>
                   <Button variant="secondary" size="sm" onClick={() => navigate('/treasurer/tenants')}>Contact</Button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Current Tenant</div>
                      <div style={{ fontWeight: "600" }}>{house.tenant || "Jack Sparrow"}</div>
                   </div>
                   <Button variant="secondary" size="sm" onClick={() => navigate('/treasurer/tenants')}>Profile</Button>
                </div>
             </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Financial History (Recent)">
             <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {house.history.map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", fontSize: "13px" }}>
                     <div>
                        <div style={{ fontWeight: "600" }}>{h.type}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{h.date}</div>
                     </div>
                     <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "700" }}>Rs. {h.amount}</div>
                        <div style={{ fontSize: "11px", color: h.status === 'Verified' ? '#1a4d2e' : 'inherit' }}>{h.status}</div>
                     </div>
                  </div>
                ))}
                <Button variant="secondary" onClick={() => navigate('/treasurer/payments')}>View All Payments</Button>
             </div>
          </Card>

          <Card title="Maintenance Logs">
             <div style={{ textAlign: "center", padding: "10px" }}>
                <div style={{ fontSize: "24px", color: "var(--primary)", marginBottom: "10px" }}><i className="bi bi-tools"></i></div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No active maintenance requests for this unit.</p>
                <Button variant="secondary" style={{ width: "100%" }} onClick={() => navigate('/treasurer/maintenance')}>System Logs</Button>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerHouseDetail;
