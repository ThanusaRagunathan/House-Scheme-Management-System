import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card, Select } from "../../components/FormElements";
import { getTenant, updateTenant, getHouses } from "../../services/api";

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [houses, setHouses] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const Tenant = await getTenant(id);
        if (Tenant) {
          setFormData({
            fullName: Tenant.username || Tenant.name || "",
            occupation: Tenant.occupation || "",
            nic: Tenant.nic || "",
            phone: Tenant.phone || "",
            houseAllocated: Tenant.houseAddress || Tenant.houseCode || "",
            dob: Tenant.date_of_birth ? new Date(Tenant.date_of_birth).toISOString().split('T')[0] : "",
            email: Tenant.email || ""
          });

          if (Tenant.familyMembers) {
            setFamilyMembers(Tenant.familyMembers.map(m => ({
               name: m.name || "",
               relation: m.relation || "",
               occupation: m.occupation || "",
               nic: m.nic || "",
               dob: m.date_of_birth ? m.date_of_birth.split('T')[0] : ""
            })));
          }
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

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) errors.email = "Invalid email format";
    
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone)) errors.phone = "Phone must be exactly 10 digits";

    if (!formData.nic.trim()) errors.nic = "NIC is required";
    else if (!nicRegex.test(formData.nic)) errors.nic = "Invalid NIC format (9 Digits + V/X or 12 Digits)";

    if (!formData.dob) errors.dob = "Date of Birth is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", relation: "", occupation: "", nic: "", dob: "" }]);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please fix the validation errors below.");
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('[aria-invalid="true"]');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
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
        email: formData.email,
        familyMembers: familyMembers
      };

      await updateTenant(id, TenantData);
      navigate("/owner/Tenants");
    } catch (err) {
      setError(err.message || "Failed to update Tenant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout role="owner" title="Edit Tenant"><p>Loading details...</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
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
              <Button variant="secondary" onClick={() => navigate("/owner/Tenants")} disabled={loading}>Cancel</Button>
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
                placeholder="john@example.com"
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
                error={fieldErrors.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>

            <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ margin: "0", fontSize: "16px", color: "var(--text-dark)" }}>Family Members (Dependents)</h4>
                  <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "var(--text-muted)" }}>Registered dependents living with the tenant.</p>
                </div>
                <Button variant="secondary" onClick={addFamilyMember} type="button" style={{ fontSize: "12px" }}>
                  <i className="bi bi-plus-lg"></i> Add Member
                </Button>
              </div>

              {familyMembers.length > 0 ? (
                familyMembers.map((member, index) => (
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
                    <Button variant="secondary" onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== index))} type="button" style={{ padding: "8px", color: "#e03131" }}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", color: "var(--text-muted)", fontSize: "14px" }}>
                  No family members registered. Click "Add Member" to include dependents.
                </div>
              )}
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerEditTenant;
