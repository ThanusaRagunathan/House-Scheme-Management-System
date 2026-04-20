import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getTenants, deleteTenant } from "../../services/api";
import { formatDate } from "../../utils/formatters";

function TreasurerTenants() {
  const navigate = useNavigate();
  const [Tenants, setTenants] = useState([]);
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
      console.error("Failed to fetch Tenants:", error);
      // Fallback for demo
      setTenants([
        { id: 1, name: "Karthik", email: "karthik@gmail.com", phone: "077 123 4567", houseCode: "H001", nic: "S1234567", occupation: "Software Engineer", dob: "1990-01-01", tenancyPeriod: "2020-01-01 to 2025-01-01" },
        { id: 2, name: "Jack Brown", email: "jack123@gmail.com", phone: "077 548 5503", houseCode: "H002", nic: "S1234568", occupation: "Teacher", dob: "1985-03-15", tenancyPeriod: "2020-01-01 to 2025-01-01" },
        { id: 3, name: "Patrick Tompson", email: "pato@gmail.com", phone: "075 472 3652", houseCode: "H004", nic: "S1234569", occupation: "Doctor", dob: "1995-06-20", tenancyPeriod: "2020-01-01 to 2025-01-01" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Tenant ${name}?`)) return;
    setActionLoading(true);
    try {
      await deleteTenant(id);
      setTenants(Tenants.filter(t => t.id !== id));
      alert("Tenant removed successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="treasurer"
      title="Tenant Directory"



    >
      <Card>
        {loading ? (
          <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Name</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Contact Details</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>NIC</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Occupation</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Date of Birth</th>
                  <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Tenancy Period</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Tenants.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{t.name || t.username}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      <div style={{ fontWeight: "500" }}>{t.email}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.phone}</div>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.houseCode || t.houseAddress || 'N/A'}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.nic || 'N/A'}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.occupation || 'N/A'}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{t.date_of_birth ? formatDate(t.date_of_birth) : (t.dob || 'N/A')}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {t.startDate ? `${formatDate(t.startDate)} - ${formatDate(t.endDate)}` : (t.tenancyPeriod || 'N/A')}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <Button variant="secondary" onClick={() => navigate(`/treasurer/Tenants/${t.id}`)}>
                          View
                        </Button>
                        <button
                          onClick={() => navigate(`/treasurer/Tenants/edit/${t.id}`)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name || t.username)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#e03131" }}
                          title="Delete"
                          disabled={actionLoading}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {Tenants.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>No Tenants registered.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default TreasurerTenants;
