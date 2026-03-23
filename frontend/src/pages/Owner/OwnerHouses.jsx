import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>{house.houseCode || house.code}</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{house.address}</div>
        </div>
        <span style={{ 
          padding: "4px 10px", 
          borderRadius: "20px", 
          fontSize: "11px", 
          fontWeight: "700",
          backgroundColor: house.status === "Occupied" ? "#e2f2e5" : "#fff8e1",
          color: house.status === "Occupied" ? "#1a4d2e" : "#f57c00"
        }}>
          {(house.status || "Vacant").toUpperCase()}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Rent</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>Rs. {house.rent}</div>
        </div>
        <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Rooms</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>{house.rooms} Units</div>
        </div>
      </div>

      {house.tenants && house.tenants.length > 0 && (
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "var(--text-muted)" }}>Current Tenants</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {house.tenants.map((t, i) => (
              <span key={i} style={{ fontSize: "12px", padding: "2px 8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>{t.fullName || (typeof t === 'string' ? t.split(' ')[0] : 'Resident')}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "auto", display: "flex", gap: "10px", paddingTop: "15px", borderTop: "1px solid #f0f0f0" }}>
        <button 
           onClick={() => navigate(`/owner/houses/${house.id || house.houseCode}`)}
          style={{ flex: 1, padding: "8px", borderRadius: "6px", backgroundColor: "var(--primary)", color: "white", fontWeight: "600", fontSize: "12px", border: "none", cursor: "pointer" }}
        >
          Details
        </button>
        <button 
          onClick={() => navigate(`/owner/houses/edit/${house.id}`)}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#f0f0f0", color: "#555", border: "none", cursor: "pointer" }}
        >
          <i className="bi bi-pencil-square"></i>
        </button>
        <button 
          onClick={handleDelete}
          style={{ padding: "8px", borderRadius: "6px", backgroundColor: "#fff5f5", color: "#e03131", border: "none", cursor: "pointer" }}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
}

function OwnerHouses() {
    const navigate = useNavigate();
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

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
            // Fallback for demo if API fails
            setHouses([
                { id: 1, houseCode: "H001", status: "Occupied", address: "123, Oak Street", rooms: 2, rent: "10,000", tenants: [{fullName: "Karthik"}] },
                { id: 2, houseCode: "H002", status: "Occupied", address: "124, Oak Street", rooms: 3, rent: "17,000", tenants: [{fullName: "Jack Brown"}] }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHouse = async (id) => {
        setActionLoading(true);
        try {
            await deleteHouse(id);
            setHouses(houses.filter(h => h.id !== id));
            alert("House deleted successfully");
        } catch (error) {
            console.error("Failed to delete house:", error);
            alert("Failed to delete house: " + error.message);
        } finally {
            setActionLoading(false);
        }
    };

  return (
    <DashboardLayout
      role="owner"
      title="Property Portfolio"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
           <h3 style={{ fontSize: "18px" }}>All Houses ({houses.length})</h3>
           <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Manage and monitor your housing units</p>
        </div>
        <button
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 24px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: actionLoading ? 0.7 : 1
          }}
          onClick={()=>navigate("/owner/addhouse")}
          disabled={actionLoading}
        >
          <i className="bi bi-plus-lg"></i> Add New Unit
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>Loading houses...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {houses.map((house) => (
            <HouseCard key={house.id || house.houseCode} house={house} onDelete={handleDeleteHouse} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default OwnerHouses;
