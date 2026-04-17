import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Select, Button, Card } from "../../components/FormElements";
import { createHouse } from "../../services/api";

function OwnerAddHouse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    address: "",
    rooms: "",
    rent: "",
    rentType: "Monthly",
    status: "Vacant"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input 
                label="Number of Rooms" 
                type="number"
                placeholder="2" 
                value={formData.rooms}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({...formData, rooms: value});
                }}
                required
              />
              
              <Input 
                label="Monthly Rent (Rs.)" 
                type="number"
                placeholder="15000" 
                value={formData.rent}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
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


