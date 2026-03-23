import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card } from "../../components/FormElements";
import { getTenants, updateTenant } from "../../services/api";

function OwnerEditTenant() {
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

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenants = await getTenants();
        const tenant = tenants.find(t => String(t.id) === String(id));
        if (tenant) {
          setFormData({
            fullName: tenant.username || tenant.name || "",
            occupation: tenant.occupation || "",
            nic: tenant.nic || "",
            phone: tenant.phone || "",
            houseAllocated: tenant.houseAddress || tenant.houseCode || "",
            dob: tenant.dateOfBirth ? tenant.dateOfBirth.split('T')[0] : "",
            email: tenant.email || ""
          });
        } else {
          setError("Resident record not found.");
        }
      } catch (err) {
        setError("Failed to load resident details.");
      } finally {
        setFetching(false);
      }
    };
    fetchTenant();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tenantData = {
          occupation: formData.occupation,
          dateOfBirth: formData.dob,
          houseCode: formData.houseAllocated,
          phone: formData.phone,
          nic: formData.nic,
          email: formData.email
      };

      await updateTenant(id, tenantData);
      navigate("/owner/tenants");
    } catch (err) {
      setError(err.message || "Failed to update resident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout role="owner" title="Edit Resident"><p>Loading details...</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title="Edit Resident Profile"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {error && (
            <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
                {error}
            </div>
        )}

        <Card 
          title="Resident Details" 
          subtitle={`Updating information for ${formData.fullName}`}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Button variant="secondary" onClick={() => navigate("/owner/tenants")} disabled={loading}>Cancel</Button>
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
                  placeholder="+94 XX XXX XXXX" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "20px" }}>
              <Input 
                label="Email Address" 
                type="email"
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input 
                label="Occupation" 
                placeholder="Software Engineer" 
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              />
              <Input 
                label="NIC Number" 
                placeholder="199XXXXXXXXX" 
                value={formData.nic}
                onChange={(e) => setFormData({...formData, nic: e.target.value})}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input 
                label="House Allocated" 
                placeholder="e.g. H005" 
                value={formData.houseAllocated}
                onChange={(e) => setFormData({...formData, houseAllocated: e.target.value})}
                required
              />
              <Input 
                label="Date of Birth" 
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                required
              />
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerEditTenant;
