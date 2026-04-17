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
            code: house.referenceCode ? house.referenceCode.replace(/^H - /, "") : "",
            address: house.address || "",
            rooms: house.rooms || "",
            rent: house.rentAmount || house.rent || "",
            rentType: "Monthly",
            status: house.status || "Vacant"
          });
        } else {
          setError("House not found.");
        }
      } catch (err) {
        setError("Failed to fetch house details.");
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
        referenceCode: `H - ${formData.code}`,
        address: formData.address,
        rooms: parseInt(formData.rooms),
        rentAmount: parseFloat(formData.rent),
        status: formData.status
      };

      await updateHouse(id, houseData);
      navigate("/owner/houses");
    } catch (err) {
      setError(err.message || "Failed to update house. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout role="owner" title="Edit House"><p>Loading details...</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title="Edit House"
      
      
      
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
            <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
                {error}
            </div>
        )}
        
        <Card 
          title="Update House Details" 
          subtitle={`Editing house record ID: ${id}`}
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => navigate("/owner/houses")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Update House</Button>
            </div>
          }
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
