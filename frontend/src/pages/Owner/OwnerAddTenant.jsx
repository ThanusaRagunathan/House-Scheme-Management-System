import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card, Select } from "../../components/FormElements";
import { register, createTenant, getHouses } from "../../services/api";

function OwnerAddTenant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [houses, setHouses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    nic: "",
    phone: "",
    houseAllocated: "",
    dob: "",
    leaseStartDate: new Date().toISOString().split('T')[0],
    email: "",
    username: "",
    password: ""
  });

  const [familyMembers, setFamilyMembers] = useState([]);

  const generatePassword = (name, dob) => {
    if (!name || !dob) return "";
    const firstFour = name.replace(/\s+/g, "").substring(0, 4);
    const dateParts = dob.split("-"); // YYYY-MM-DD
    if (dateParts.length !== 3) return "";
    const year = dateParts[0].slice(-2);
    const day = dateParts[2];
    return `${firstFour}${day}+${year}`;
  };


  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const allHouses = await getHouses();
        console.log("All houses fetched:", allHouses);
        // Use case-insensitive check and trim for status
        const vacantHouses = allHouses.filter(h => h.status && h.status.toLowerCase() === 'vacant');
        setHouses(vacantHouses);
        // Removed auto-allocation of first vacant house to keep it optional
      } catch (err) {
        console.error("Failed to load houses", err);
        // Fallback with a vacant house for demo
        const demoHouses = [
          { id: 101, houseCode: "H - 001", status: "Vacant", address: "123, Oak Street", rooms: 2 },
          { id: 102, houseCode: "H - 002", status: "Occupied", address: "124, Oak Street", rooms: 3 }
        ];
        const vacantDemos = demoHouses.filter(h => h.status.toLowerCase() === 'vacant');
        setHouses(vacantDemos);
        // Removed auto-allocation for demo
      }
    };
    fetchHouses();
  }, []);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", occupation: "", nic: "", dob: "" }]);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits (e.g. 0712345678).");
      return;
    }

    setLoading(true);

    try {
      // 1. Register the user with all details
      const userRes = await register({
        username: formData.username,
        password: formData.password,
        role: 'Tenant',
        email: formData.email,
        phone: formData.phone
      });

      if (!userRes || !userRes.userId) {
        throw new Error("Failed to get user ID from registration.");
      }

      // 2. Create the Tenant record and link house
      const TenantData = {
        userId: userRes.userId,
        fullName: formData.fullName,
        nic: formData.nic,
        occupation: formData.occupation,
        dateOfBirth: formData.dob,
        leaseStartDate: formData.leaseStartDate,
        houseId: formData.houseAllocated ? parseInt(formData.houseAllocated) : null
      };

      await createTenant(TenantData);

      // Optional: Add family members here if backend supported it
      // Currently the backend createTenant only takes (userId, occupation, dateOfBirth)

      navigate("/owner/Tenants");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register Tenant. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Register New Tenant"
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card
          title="Tenant Information"
          subtitle="Register a new Tenant, allocate a vacant unit, and set up system access."
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
              <Input
                label="Full Name"
                placeholder="e.g. Ariana Grande"
                value={formData.fullName}
                onChange={(e) => {
                  const name = e.target.value;
                  // Generate username
                  const generatedUsername = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, ".")
                    .split(".")
                    .filter(Boolean)
                    .join(".");

                  // Generate password
                  const generatedPassword = generatePassword(name, formData.dob);

                  setFormData({
                    ...formData,
                    fullName: name,
                    username: generatedUsername,
                    password: generatedPassword || formData.password
                  });
                }}
                required
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
                placeholder="ariana@example.com"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              <Select
                label="Allocate Vacant House"
                value={formData.houseAllocated}
                onChange={(e) => setFormData({ ...formData, houseAllocated: e.target.value })}
                options={[
                  { label: "Select a vacant house...", value: "" },
                  ...houses.map(h => ({
                    label: `${h.houseCode || h.referenceCode || h.address} (Rooms: ${h.rooms})`,
                    value: h.id || h.house_id
                  }))
                ]}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => {
                  const dob = e.target.value;
                  const generatedPassword = generatePassword(formData.fullName, dob);
                  setFormData({ ...formData, dob, password: generatedPassword || formData.password });
                }}
                required
              />
              <Input
                label="Lease Start Date"
                type="date"
                value={formData.leaseStartDate}
                onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
                required
              />
            </div>

            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px dashed #ced4da" }}>
              <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "var(--primary)" }}>System Credentials</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <Input
                  label="Username"
                  placeholder="ariana.grande"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  label="Initial Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: "30px", marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h4 style={{ margin: 0, color: "var(--primary)" }}>Family Members</h4>
                <Button variant="secondary" onClick={addFamilyMember} type="button">
                  <i className="bi bi-plus-lg"></i> Add Member
                </Button>
              </div>

              {familyMembers.length === 0 && (
                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", padding: "10px" }}>No family members added yet.</p>
              )}

              {familyMembers.map((member, index) => (
                <div key={index} style={{
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  border: "1px solid #eee",
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr auto",
                  gap: "10px",
                  alignItems: "end"
                }}>
                  <Input label="Name" value={member.name} onChange={(e) => handleFamilyChange(index, 'name', e.target.value)} />
                  <Input label="Occupation" value={member.occupation} onChange={(e) => handleFamilyChange(index, 'occupation', e.target.value)} />
                  <Input label="NIC" value={member.nic} onChange={(e) => handleFamilyChange(index, 'nic', e.target.value)} />
                  <Input label="DOB" type="date" value={member.dob} onChange={(e) => handleFamilyChange(index, 'dob', e.target.value)} />
                  <Button variant="secondary" onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== index))} style={{ padding: "8px", color: "#e03131" }}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <Button variant="secondary" type="button" onClick={() => navigate("/owner/Tenants")} disabled={loading}>Cancel</Button>
              <Button variant="primary" type="submit" loading={loading}>Save Tenant</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerAddTenant;


