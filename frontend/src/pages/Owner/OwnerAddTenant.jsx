import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card } from "../../components/FormElements";
import { register, createTenant } from "../../services/api";

function OwnerAddTenant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    nic: "",
    phone: "",
    houseAllocated: "",
    dob: "",
    email: "",
    username: "",
    password: ""
  });

  const [familyMembers, setFamilyMembers] = useState([]);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", occupation: "", nic: "", dob: "" }]);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Register the user
      const userRes = await register({
          username: formData.username,
          password: formData.password,
          role: 'tenant'
      });

      // 2. Create the tenant record
      const tenantData = {
          userId: userRes.userId,
          occupation: formData.occupation,
          dateOfBirth: formData.dob,
          houseCode: formData.houseAllocated, // Assuming the backend can handle HouseCode or ID
          // add other fields if backend supported
      };

      await createTenant(tenantData);
      
      navigate("/owner/tenants");
    } catch (err) {
      setError(err.message || "Failed to register tenant. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Register New Tenant"
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
          title="Tenant Information" 
          subtitle="Register a new resident and their family details."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Button variant="secondary" onClick={() => navigate("/owner/tenants")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Save Resident</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
                <Input 
                  label="Full Name" 
                  placeholder="e.g. John Doe" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
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

            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px dashed #ced4da" }}>
                <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "var(--primary)" }}>System Credentials</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <Input 
                        label="Username" 
                        placeholder="john.doe" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <Input 
                        label="Initial Password" 
                        type="password"
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
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
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerAddTenant;

