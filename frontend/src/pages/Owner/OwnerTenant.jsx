import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getTenants, deleteTenant } from "../../services/api";

function OwnerTenant() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const data = await getTenants();
      setTenants(data);
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
      // Fallback for demo
      setTenants([
        { id: 1, username: "Karthik", email: "karthik@gmail.com", phone: "077 123 4567", houseAddress: "H001" },
        { id: 2, username: "Jack Brown", email: "jack123@gmail.com", phone: "077 548 5503", houseAddress: "H002" },
        { id: 3, username: "Patrick Tompson", email: "pato@gmail.com", phone: "075 472 3652", houseAddress: "H004" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    
    setActionLoading(true);
    try {
        await deleteTenant(id);
        setTenants(tenants.filter(t => t.id !== id));
        alert("Tenant deleted successfully");
    } catch (error) {
        console.error("Failed to delete tenant:", error);
        alert("Failed to delete tenant: " + error.message);
    } finally {
        setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Tenant Directory"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
        <Button variant="primary" onClick={() => navigate("/owner/addtenant")} disabled={actionLoading}>
          <i className="bi bi-person-plus"></i> Add New Tenant
        </Button>
      </div>

      <Card title="Active Residents" subtitle="A complete list of all tenants across all housing units.">
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading tenants...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Name</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Email</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Phone</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Unit</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{t.username}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.email}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.phone}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.houseAddress || 'Unallocated'}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <Button variant="secondary" onClick={() => navigate(`/owner/tenants/${t.id}`)}>
                           View
                        </Button>
                        <button 
                          onClick={() => navigate(`/owner/tenants/edit/${t.id}`)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteTenant(t.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }}
                          disabled={actionLoading}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tenants.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No tenants registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default OwnerTenant;
