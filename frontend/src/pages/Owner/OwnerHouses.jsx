import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getHouses, deleteHouse } from "../../services/api";
import { sortHousesByReference } from "../../utils/formatters";

function HouseCard({ house, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const identifier = house.id || house.house_id;
    if (window.confirm(`Are you sure you want to delete house ${house.referenceCode || house.houseCode || house.code}?`)) {
      if (!identifier) {
        alert("Cannot delete: House ID is missing.");
        return;
      }
      await onDelete(identifier);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "20px", backgroundColor: "white", display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>{house.referenceCode}</div>
          <div style={{ fontSize: "16px", fontWeight: "700" }}>{house.address}</div>
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

      {house.Tenants && house.Tenants.length > 0 && (
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "var(--text-muted)" }}>Current Tenants</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {house.Tenants.map((t, i) => (
              <span key={i} style={{ fontSize: "12px", padding: "2px 8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>{t.fullName || (typeof t === 'string' ? t.split(' ')[0] : 'Tenant')}</span>
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
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getHouses();
      console.log("Frontend: Houses fetched successfully:", data);
      setHouses(sortHousesByReference(data));
    } catch (err) {
      console.error("Frontend: Failed to fetch houses:", err);
      setError("Failed to load houses from server. Showing demo data for preview.");
      // Fallback for demo if API fails
      setHouses([
        { id: 1, referenceCode: "H - 001 (Demo)", status: "Occupied", address: "123, Oak Street", rooms: 2, rent: "10,000", Tenants: [{ fullName: "Ariana Grande" }] },
        { id: 2, referenceCode: "H - 002 (Demo)", status: "Vacant", address: "124, Oak Street", rooms: 3, rent: "17,000", Tenants: [] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHouse = async (id) => {
    console.log(`Frontend: Requesting delete for house ID: ${id}`);
    setActionLoading(true);
    try {
      await deleteHouse(id);
      setHouses(prev => prev.filter(h => h.id !== id));
      alert("House deleted successfully");
    } catch (error) {
      console.error("Frontend: Failed to delete house:", error);
      alert(`Failed to delete house: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title={`House Portfolio ${!loading ? `(${houses.length})` : ''}`}
      headerAction={
        <button
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: actionLoading ? 0.7 : 1
          }}
          onClick={() => navigate("/owner/addhouse")}
          disabled={actionLoading}
        >
          <i className="bi bi-plus-lg"></i> Add New House
        </button>
      }
    >

      {error && (
        <div style={{ 
          backgroundColor: "#fff5f5", 
          color: "#e03131", 
          padding: "15px 20px", 
          borderRadius: "12px", 
          marginBottom: "25px", 
          fontSize: "14px", 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          border: "1px solid #ffc9c9"
        }}>
          <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "16px" }}></i>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "var(--text-muted)" }}>
          <div className="spinner" style={{ marginBottom: "15px" }}></div>
          Loading houses...
        </div>
      ) : houses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "white", borderRadius: "20px", border: "1px dashed #e0e0e0" }}>
          <i className="bi bi-house-door" style={{ fontSize: "48px", color: "#e0e0e0", marginBottom: "20px", display: "block" }}></i>
          <h3 style={{ fontSize: "20px", color: "var(--primary)", marginBottom: "10px" }}>No Houses Registered</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "25px" }}>You haven't added any housing units to your portfolio yet.</p>
          <button 
            onClick={() => navigate("/owner/addhouse")}
            style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "var(--primary)", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}
          >
            Add Your First House
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {houses.map((house) => (
            <HouseCard key={house.id || house.house_id} house={house} onDelete={handleDeleteHouse} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default OwnerHouses;
