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
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "Visa",
    remarks: "",
    evidence: null,
    billingCycle: "Monthly",
    amountOption: "Standard",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTenantProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && formData.amountOption === "Standard") {
      const rent = parseFloat(profile.rentAmount || 0);
      const multiplier = formData.billingCycle === "Yearly" ? 12 : 1;
      setFormData(prev => ({ ...prev, amount: (rent * multiplier).toString() }));
    }
  }, [profile, formData.billingCycle, formData.amountOption]);

  const validateForm = () => {
    const errors = {};
    const amountNum = parseFloat(formData.amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      errors.amount = "Payment amount must be a positive number";
    }

    // Card Details Validation
    if (!formData.cardholderName.trim()) errors.cardholderName = "Cardholder name is required";
    
    const cleanCard = formData.cardNumber.replace(/\s/g, "");
    if (!/^\d{15,16}$/.test(cleanCard)) {
      errors.cardNumber = "Enter a valid 15 or 16-digit card number";
    }

    const expiryMatch = formData.expiryDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch) {
      errors.expiryDate = "Use MM/YY format";
    } else {
      const month = parseInt(expiryMatch[1]);
      const year = parseInt(expiryMatch[2]);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = "Card has expired";
      }
    }

    if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = "Invalid CVV";
    }

    if (formData.evidence) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(formData.evidence.type)) {
        errors.evidence = "Invalid file format. Please upload PDF, JPG, or PNG.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length > 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      setError("Please fix the validation errors below.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amount: formData.amount,
        paymentMethod: formData.payment_method,
        remarks: `[${formData.billingCycle} Payment] ${formData.remarks}`.trim(),
        tenancyId: profile?.tenancyId,
        invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
        status: "Paid",
        paidDate: new Date().toISOString().split('T')[0]
      };

      await createPayment(payload);
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
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9", fontWeight: "600" }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: "10px" }}></i> {error}
          </div>
        )}

        <Card
          title="Make a Payment"
          subtitle="All payments are processed securely. Please confirm your details before continuing."
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
              <Button variant="secondary" onClick={() => navigate("/Tenant/payments")} disabled={loading}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={loading}>Process Payment</Button>
            </div>
          }
        >
          <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>Bill To:</div>
            <div style={{ fontWeight: "700", fontSize: "18px", color: "var(--text-dark)" }}>{profile?.username}</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{profile?.houseAddress}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <Select
                label="Billing Cycle"
                value={formData.billingCycle}
                onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value }))}
                options={[
                  { value: "Monthly", label: "Monthly" },
                  { value: "Yearly", label: "Yearly" }
                ]}
                disabled={loading}
              />

              <Select
                label="Amount Selection"
                value={formData.amountOption}
                onChange={(e) => setFormData(prev => ({ ...prev, amountOption: e.target.value }))}
                options={[
                  { value: "Standard", label: `Standard Rent (${formData.billingCycle})` },
                  { value: "Other", label: "Other Amount" }
                ]}
                disabled={loading}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Input
                label="Amount (Rs.)"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                error={fieldErrors.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                disabled={loading || formData.amountOption === "Standard"}
              />

              <Select
                label="Payment Method"
                value={formData.payment_method}
                error={fieldErrors.payment_method}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                options={[
                  { value: "Visa", label: "Visa Card" },
                  { value: "MasterCard", label: "Master Card" },
                  { value: "Amex", label: "American Express (Amex)" }
                ]}
                disabled={loading}
              />
            </div>

            <Input
              label="Remarks (Optional)"
              placeholder="e.g. October Rent + Water Bill"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              disabled={loading}
            />

            <div style={{ padding: "20px", backgroundColor: "rgba(26, 77, 46, 0.03)", borderRadius: "12px", border: "1px solid rgba(26, 77, 46, 0.1)", marginBottom: "25px", marginTop: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--primary)", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="bi bi-credit-card-2-front-fill"></i> Card Information
              </h4>
              
              <Input
                label="Cardholder Name"
                placeholder="Full name as printed on card"
                value={formData.cardholderName}
                error={fieldErrors.cardholderName}
                onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                required
                disabled={loading}
              />

              <Input
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                error={fieldErrors.cardNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                maxLength="19"
                required
                disabled={loading}
                prefix={<i className={`bi bi-${formData.payment_method === 'Visa' ? 'credit-card' : 'credit-card-2-front'}`}></i>}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <Input
                  label="Expiration Date"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  error={fieldErrors.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: formatExpiry(e.target.value) }))}
                  maxLength="5"
                  required
                  disabled={loading}
                />
                <Input
                  label="CVV / CVC"
                  placeholder="123"
                  type="password"
                  value={formData.cvv}
                  error={fieldErrors.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, "") }))}
                  maxLength="4"
                  required
                  disabled={loading}
                />
              </div>
            </div>





            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff9db", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid #ffe066" }}>
              <i className="bi bi-info-circle-fill" style={{ color: "#f08c00", fontSize: "18px" }}></i>
              <div style={{ fontSize: "12px", color: "#856404", lineHeight: "1.5" }}>
                <strong>Important:</strong> Offline cash payments are not tracked through this digital portal. For cash transactions, please visit the Treasurer's office directly for a manual receipt.
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TenantAddPayment;
