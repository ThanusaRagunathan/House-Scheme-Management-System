import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card, Select } from "../../components/FormElements";
import { createPayment, getTenants, getHouses } from "../../services/api";

function TreasurerAddPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tenants, setTenants] = useState([]);
  const [houses, setHouses] = useState([]);
  
  const [formData, setFormData] = useState({
    tenantId: "",
    houseId: "",
    amount: "",
    paymentType: "Rent",
    paymentMethod: "Offline",
    paymentDate: new Date().toISOString().split('T')[0],
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenantsList, housesList] = await Promise.all([
          getTenants(),
          getHouses()
        ]);
        setTenants(tenantsList);
        setHouses(housesList);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createPayment({
        ...formData,
        amount: parseFloat(formData.amount),
        tenantId: parseInt(formData.tenantId),
        houseId: parseInt(formData.houseId)
      });
      navigate("/treasurer/payments");
    } catch (err) {
      setError(err.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="treasurer" title="Record Payment">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card 
          title="Manual Payment Entry" 
          subtitle="Record an offline or official payment received from a tenant."
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Select
                label="Tenant Name"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                options={[
                  { label: "Select Tenant...", value: "" },
                  ...tenants.map(t => ({ label: t.name || t.fullName || t.username, value: t.id }))
                ]}
                required
              />
              <Select
                label="House / Unit"
                value={formData.houseId}
                onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
                options={[
                  { label: "Select Unit...", value: "" },
                  ...houses.map(h => ({ label: `${h.houseCode || h.address} (Unit ${h.id})`, value: h.id }))
                ]}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              <Input
                label="Amount (Rs.)"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <Select
                label="Payment Type"
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                options={[
                  { label: "Rent", value: "Rent" },
                  { label: "Security Deposit", value: "Security Deposit" },
                  { label: "Utility Bill", value: "Utility" },
                  { label: "Maintenance", value: "Maintenance" },
                  { label: "Other", value: "Other" }
                ]}
              />
              <Input
                label="Payment Date"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
              <Select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                options={[
                  { label: "Offline (Cash/Cheque)", value: "Offline" },
                  { label: "Bank Transfer", value: "Bank Transfer" },
                  { label: "Online Portal", value: "Online" }
                ]}
              />
              <Input
                label="Description / Reference"
                placeholder="e.g. Rent for April 2026"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <Button variant="secondary" onClick={() => navigate("/treasurer/payments")} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Record Payment
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerAddPayment;
