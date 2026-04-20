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
    password: "",
    confirmPassword: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [familyMembers, setFamilyMembers] = useState([]);

  const generatePassword = (name, dob) => {
    if (!name || !dob) return "";
    const firstFour = name.replace(/\s+/g, "").substring(0, 4);
    const dateParts = dob.split("-"); // YYYY-MM-DD
    if (dateParts.length !== 3) return "";
    const year = dateParts[0].slice(-2);
    const day = dateParts[2];
    return `${firstFour}${day}@${year}`;
  };


  useEffect(() => {
    if (formData.fullName) {
      const generatedUsername = formData.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ".")
        .split(".")
        .filter(Boolean)
        .join(".");
      
      const generatedPassword = generatePassword(formData.fullName, formData.dob);

      setFormData(prev => ({
        ...prev,
        username: generatedUsername,
        password: generatedPassword || prev.password,
        confirmPassword: generatedPassword || prev.confirmPassword
      }));
    }
  }, [formData.fullName, formData.dob]);

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
    setFamilyMembers([...familyMembers, { name: "", relation: "", occupation: "", nic: "", dob: "" }]);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+@$!%*?&._\-/])[A-Za-z\d+@$!%*?&._\-/]{8,}$/;

    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) errors.email = "Invalid email format";
    
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone)) errors.phone = "Phone must be exactly 10 digits";

    if (!formData.nic.trim()) errors.nic = "NIC is required";
    else if (!nicRegex.test(formData.nic)) errors.nic = "Invalid NIC format (9 Digits + V/X or 12 Digits)";

    if (!formData.dob) errors.dob = "Date of Birth is required";
    if (!formData.leaseStartDate) errors.leaseStartDate = "Lease Start Date is required";
    if (!formData.username.trim()) errors.username = "Username is required";

    if (!formData.password) errors.password = "Password is required";
    else if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please correct the errors before submitting.");
      // Scroll to the first error field
      setTimeout(() => {
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setLoading(true);

    try {
      // 1. Register the user
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
        houseId: formData.houseAllocated ? parseInt(formData.houseAllocated) : null,
        familyMembers: familyMembers
      };

      await createTenant(TenantData);

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
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", 
          borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
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
                error={fieldErrors.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                placeholder="e.g. 0712345678"
                value={formData.phone}
                error={fieldErrors.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                maxLength="10"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "20px" }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="ariana@example.com"
                value={formData.email}
                error={fieldErrors.email}
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
                placeholder="Old (901234567V) or New (199012345678)"
                value={formData.nic}
                error={fieldErrors.nic}
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
                error={fieldErrors.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
              <Input
                label="Lease Start Date"
                type="date"
                value={formData.leaseStartDate}
                error={fieldErrors.leaseStartDate}
                onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
                required
              />
            </div>

            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px dashed #ced4da" }}>
              <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "var(--primary)", fontWeight: "700" }}>System Credentials</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "20px", alignItems: "start" }}>
                <Input
                  label="Username"
                  placeholder="ariana.grande"
                  value={formData.username}
                  error={fieldErrors.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  error={fieldErrors.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  error={fieldErrors.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "5px" }}>
                Password must be at least 8 characters, include an uppercase letter, a number, and a special character.
              </p>
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
                  gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr 1fr auto",
                  gap: "10px",
                  alignItems: "end"
                }}>
                  <Input label="Name" value={member.name} onChange={(e) => handleFamilyChange(index, 'name', e.target.value)} />
                  <Input label="Relation" value={member.relation} onChange={(e) => handleFamilyChange(index, 'relation', e.target.value)} />
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