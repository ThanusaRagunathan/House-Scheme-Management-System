import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Select, Button, Card } from "../../components/FormElements";
import { getHouses, updateHouse } from "../../services/api";

function OwnerEditHouse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    address: "",
    rooms: "",
    rent: "",
    rentType: "Monthly",
    status: "Vacant"
  });

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const houses = await getHouses();
        const house = houses.find(h => String(h.id) === String(id));
        if (house) {
          setFormData({
            code: house.houseCode || house.code || "",
            address: house.address || "",
            rooms: house.rooms || "",
            rent: house.rentAmount || house.rent || "",
            rentType: "Monthly",
            status: house.status || "Vacant"
          });
        } else {
          setError("Property not found.");
        }
      } catch (err) {
        setError("Failed to fetch property details.");
      } finally {
        setFetching(false);
      }
    };
    fetchHouse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const houseData = {
        address: formData.address,
        rooms: parseInt(formData.rooms),
        rentAmount: parseFloat(formData.rent),
        status: formData.status,
        houseCode: formData.code
      };

      await updateHouse(id, houseData);
      navigate("/owner/houses");
    } catch (err) {
      setError(err.message || "Failed to update property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout role="owner" title="Edit Property"><p>Loading details...</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title="Edit Property"
      userName="Suresh Kumar"
      userInitials="SK"
      userRoleLabel="Property Owner"
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
            <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
                {error}
            </div>
        )}
        
        <Card 
          title="Update Property Details" 
          subtitle={`Editing house record ID: ${id}`}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => navigate("/owner/houses")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Update Property</Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <Input 
              label="House Reference Code" 
              placeholder="e.g. H005" 
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
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
                onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                required
              />
              
              <Input 
                label="Monthly Rent (Rs.)" 
                type="number"
                placeholder="15000" 
                value={formData.rent}
                onChange={(e) => setFormData({...formData, rent: e.target.value})}
                required
              />
            </div>

            <Select 
              label="Current Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { label: "Vacant", value: "Vacant" },
                { label: "Occupied", value: "Occupied" },
                { label: "Maintenance", value: "Maintenance" }
              ]}
            />
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OwnerEditHouse;
