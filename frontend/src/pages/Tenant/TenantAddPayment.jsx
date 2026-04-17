import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button, Input, Select } from "../../components/FormElements";
import { createPayment, getTenantProfile } from "../../services/api";

function TenantAddPayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "Online",
    remarks: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTenantProfile();
        setProfile(data);
        // Default amount could be the monthly rent if available
        setFormData(prev => ({ ...prev, amount: "10000" }));
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createPayment({
        ...formData,
        house_id: profile?.house_id,
        invoice_no: `INV-${Date.now().toString().slice(-6)}` // Dummy invoice gen
      });
      navigate("/Tenant/payments");
    } catch (err) {
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="Tenant"
      title="Secure Rent Payment"
      userName={profile?.username || "Tenant"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card
          title="Make a Payment"
          subtitle="All payments are processed securely. Please confirm your details before continuing."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => navigate("/Tenant/payments")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Process Payment</Button>
            </div>
          }
        >
          <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "var(--bg-light)", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>Bill To:</div>
            <div style={{ fontWeight: "700", fontSize: "16px" }}>{profile?.username}</div>
            <div style={{ fontSize: "13px", color: "var(--text-dark)" }}>{profile?.houseAddress}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Amount (Rs.)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                disabled={loading}
              />

              <Select
                label="Payment Method"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                options={[
                  { value: "Online", label: "Debit/Credit Card" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                  { value: "Wallet", label: "Digital Wallet" }
                ]}
                disabled={loading}
              />
            </div>

            <Input
              label="Remarks (Optional)"
              placeholder="e.g. October Rent + Water Bill"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              disabled={loading}
            />

            <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "#fcf0f0", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <i className="bi bi-info-circle" style={{ color: "#e03131", marginTop: "2px" }}></i>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.4" }}>
                <strong>Note:</strong> Offline cash payments are not accepted through this portal. For cash payments, please visit the Treasurer's office directly.
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TenantAddPayment;
