import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getHouses, deleteHouse } from "../../services/api";

function HouseCard({ house, onDelete }) {
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete house ${house.houseCode || house.code}?`)) {
      await onDelete(house.id);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "20px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>{house.houseCode || house.code}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{house.houseType || 'Residential'}</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate(`/treasurer/houses/edit/${house.id}`)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <i className="bi bi-pencil-square"></i>
            </button>
            <button onClick={handleDelete} style={{ border: "none", background: "none", cursor: "pointer", color: "#e03131" }}>
                <i className="bi bi-trash"></i>
            </button>
        </div>
      </div>

      <div style={{ fontSize: "14px", color: "var(--text-dark)" }}>
        <i className="bi bi-geo-alt" style={{ marginRight: "8px" }}></i>
        {house.address || house.location}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Rent</div>
          <div style={{ fontWeight: "700" }}>Rs. {parseFloat(house.rent).toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Status</div>
          <div style={{ color: house.status === 'Occupied' ? '#1a4d2e' : '#e67e22', fontWeight: "700" }}>{house.status}</div>
        </div>
      </div>

      <Button variant="secondary" onClick={() => navigate(`/treasurer/houses/${house.id}`)}>
        View Details
      </Button>
    </div>
  );
}

function TreasurerHouses() {
    const navigate = useNavigate();
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHouses();
    }, []);

    const fetchHouses = async () => {
        setLoading(true);
        try {
            const data = await getHouses();
            setHouses(data);
        } catch (error) {
            console.error("Failed to fetch houses:", error);
            // Fallback for demo
            setHouses([
                { id: 1, houseCode: "H001", address: "123, Oak Street", houseType: "Apartment", rent: 10000, status: "Occupied" },
                { id: 2, houseCode: "H002", address: "124, Oak Street", houseType: "Villa", rent: 17000, status: "Occupied" },
                { id: 3, houseCode: "H003", address: "125, Oak Street", houseType: "Studio", rent: 8000, status: "Vacant" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHouse = async (id) => {
        try {
            await deleteHouse(id);
            setHouses(houses.filter(h => h.id !== id));
            alert("House deleted successfully");
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed: " + error.message);
        }
    };

    return (
        <DashboardLayout
            role="treasurer"
            title="House Inventory"
            userName="Aravinth"
            userInitials="AR"
            userRoleLabel="Chief Treasurer"
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Housing Units ({houses.length})</h3>
                <Button variant="primary" onClick={() => navigate("/treasurer/houses/add")}>
                    <i className="bi bi-plus-lg"></i> Add New Unit
                </Button>
            </div>

            {loading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading inventory...</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
                    {houses.map(house => (
                        <HouseCard key={house.id} house={house} onDelete={handleDeleteHouse} />
                    ))}
                    {houses.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", backgroundColor: "#f9f9f9", borderRadius: "15px" }}>
                            <i className="bi bi-house-door" style={{ fontSize: "48px", color: "#ddd", display: "block", marginBottom: "15px" }}></i>
                            <div style={{ color: "var(--text-muted)" }}>No houses found in the inventory.</div>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}

export default TreasurerHouses;
