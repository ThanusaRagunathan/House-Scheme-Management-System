import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Select, Button, Card } from "../../components/FormElements";
import { createHouse, getHouses } from "../../services/api";

function OwnerAddHouse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    address: "",
    rooms: "",
    rent: "",
    status: "Vacant"
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        const houses = await getHouses();
        // Extract numbers from "H - 001", "H-001", "H001", etc.
        const codes = houses.map(h => {
          const match = (h.houseCode || h.referenceCode || "").match(/\d+/);
          return match ? parseInt(match[0], 10) : null;
        }).filter(n => n !== null);

        let nextNum = 1;
        if (codes.length > 0) {
          const sorted = [...new Set(codes)].sort((a, b) => a - b);
          for (let i = 0; i < sorted.length; i++) {
            if (sorted[i] === nextNum) {
              nextNum++;
            } else if (sorted[i] > nextNum) {
              break;
            }
          }
        }
        setFormData(prev => ({ ...prev, code: nextNum.toString().padStart(3, "0") }));
      } catch (err) {
        console.error("Failed to fetch houses for auto-code:", err);
      }
    };
    fetchNextCode();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = "Reference code is required";
    if (!formData.address.trim()) errors.address = "Physical address is required";
    
    const rooms = parseInt(formData.rooms);
    if (isNaN(rooms) || rooms <= 0) errors.rooms = "Number of rooms must be greater than 0";

    const rent = parseFloat(formData.rent);
    if (isNaN(rent) || rent <= 0) errors.rent = "Monthly rent must be a positive amount";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please fix the validation errors below.");
      return;
    }

    setLoading(true);

    try {
      // Get ownerId from token
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const houseData = {
        referenceCode: `H - ${formData.code}`,
        address: formData.address,
        rooms: parseInt(formData.rooms),
        rentAmount: parseFloat(formData.rent),
        status: formData.status,
        ownerId: payload.id
      };

      await createHouse(houseData);
      navigate("/owner/houses");
    } catch (err) {
      setError(err.message || "Failed to add house. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Add New House"
      
      
      
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
            <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
                {error}
            </div>
        )}
        
        <Card 
          title="House Details" 
          subtitle="Enter the information for the new housing unit."
        >
          <form onSubmit={handleSubmit}>
            <Input 
              label="House Reference Code" 
              placeholder="001" 
              prefix="H - "
              value={formData.code}
              error={fieldErrors.code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({...formData, code: value});
              }}
              required
            />
            
            <Input 
              label="Physical Address" 
              placeholder="Full street address" 
              value={formData.address}
              error={fieldErrors.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input 
                label="Number of Rooms" 
                type="number"
                placeholder="2" 
                value={formData.rooms}
                error={fieldErrors.rooms}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({...formData, rooms: value});
                }}
                required
              />
              
              <Input 
                label="Monthly Rent (Rs.)" 
                type="number"
                placeholder="15000" 
                value={formData.rent}
                error={fieldErrors.rent}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({...formData, rent: value});
                }}
                required
              />
            </div>

            <Select 
              label="Initial Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { label: "Vacant", value: "Vacant" },
                { label: "Occupied", value: "Occupied" },
                { label: "Maintenance", value: "Maintenance" }
              ]}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <Button variant="secondary" type="button" onClick={() => navigate("/owner/houses")} disabled={loading}>Cancel</Button>
              <Button variant="primary" type="submit" loading={loading}>Save House</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerAddHouse;


