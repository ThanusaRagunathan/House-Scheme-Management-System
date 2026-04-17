import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card, Select } from "../../components/FormElements";
import { getTenants, updateTenant, getHouses } from "../../services/api";

function TreasurerEditTenant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    nic: "",
    phone: "",
    houseAllocated: "",
    dob: "",
    email: ""
  });
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const Tenants = await getTenants();
        const Tenant = Tenants.find(t => String(t.id) === String(id));
        if (Tenant) {
          setFormData({
            fullName: Tenant.username || Tenant.name || "",
            occupation: Tenant.occupation || "",
            nic: Tenant.nic || "",
            phone: Tenant.phone || "",
            houseAllocated: Tenant.houseAddress || Tenant.houseCode || "",
            dob: Tenant.dateOfBirth ? Tenant.dateOfBirth.split('T')[0] : "",
            email: Tenant.email || ""
          });
        } else {
          setError("Tenant record not found.");
        }
      } catch (err) {
        setError("Failed to load Tenant details.");
      } finally {
        setFetching(false);
      }
    };

    const fetchHouses = async () => {
      try {
        const allHouses = await getHouses();
        setHouses(allHouses);
      } catch (err) {
        setHouses([
          { id: 101, houseCode: "H - 001", status: "Vacant", address: "123, Oak Street", rooms: 2 },
          { id: 102, houseCode: "H - 002", status: "Occupied", address: "124, Oak Street", rooms: 3 }
        ]);
      }
    };

    fetchTenant();
    fetchHouses();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits (e.g. 0712345678).");
      return;
    }

    setLoading(true);

    try {
      const TenantData = {
        occupation: formData.occupation,
        dateOfBirth: formData.dob,
        houseCode: formData.houseAllocated,
        phone: formData.phone,
        nic: formData.nic,
        email: formData.email
      };

      await updateTenant(id, TenantData);
      navigate("/treasurer/Tenants");
    } catch (err) {
      setError(err.message || "Failed to update Tenant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout role="treasurer" title="Edit Tenant"><p>Loading details...</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="treasurer"
      title="Edit Tenant Profile"
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card
          title="Tenant Details"
          subtitle={`Updating information for ${formData.fullName}`}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Button variant="secondary" onClick={() => navigate("/treasurer/Tenants")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Save Changes</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
              <Input
                label="Full Name (Account Name)"
                value={formData.fullName}
                disabled
              />
              <Input
                label="Phone Number"
                placeholder="e.g. 0712345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                pattern="[0-9]{10}"
                maxLength="10"
                minLength="10"
                title="Phone number must be exactly 10 digits"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "20px" }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Occupation"
                placeholder="Software Engineer"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
              <Input
                label="NIC Number"
                placeholder="199XXXXXXXXX"
                value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Select
                label="House Allocated"
                value={formData.houseAllocated}
                onChange={(e) => setFormData({ ...formData, houseAllocated: e.target.value })}
                options={[
                  { label: formData.houseAllocated ? `Current: ${formData.houseAllocated}` : "Select a vacant house...", value: formData.houseAllocated },
                   ...houses
                     .filter(h => h.status && h.status.toLowerCase() === 'vacant')
                     .map(h => ({
                       label: `${h.houseCode || h.referenceCode || h.address} (Rooms: ${h.rooms || 'N/A'}) - Vacant`,
                       value: h.houseCode || h.id || h.house_id
                     }))
                ]}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerEditTenant;
