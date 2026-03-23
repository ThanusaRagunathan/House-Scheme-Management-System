import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getPayments } from "../../services/api";

function TreasurerPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      try {
        const payments = await getPayments();
        const found = payments.find(p => String(p.id) === String(id));
        if (found) {
          setPayment(found);
        } else {
          // Fallback demo data
          setPayment({
            id: id,
            invoice_no: "INV-2025-0812",
            houseCode: "H002",
            tenantName: "Jack Sparrow",
            amount: 17000,
            due_date: "2025-09-01",
            paid_date: "2025-08-12",
            status: "Paid",
            payment_method: "Bank Transfer",
            reference: "BT-99887766",
            notes: "Full payment for Sept 2025 rent."
          });
        }
      } catch (error) {
        console.error("Failed to fetch payment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  if (loading) return <DashboardLayout role="treasurer" title="Financial Detail"><p>Loading...</p></DashboardLayout>;
  if (!payment) return <DashboardLayout role="treasurer" title="Financial Detail"><p>Record not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="treasurer"
      title={`Payment Record - ${payment.invoice_no}`}
      userName="Aravinth"
      userInitials="AR"
      userRoleLabel="Chief Treasurer"
    >
      <div style={{ marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/treasurer/payments")}>
          <i className="bi bi-arrow-left"></i> Back to Payments
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        <Card title="Invoice Summary">
           <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Amount Received</div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--primary)" }}>Rs. {parseFloat(payment.amount).toLocaleString()}</div>
              <div>
                 <span style={{ 
                    padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    backgroundColor: payment.status === "Paid" ? "#e2f2e5" : "#fff5f5",
                    color: payment.status === "Paid" ? "#1a4d2e" : "#e03131",
                    textTransform: "uppercase"
                  }}>
                    {payment.status}
                  </span>
              </div>
           </div>
           
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
              <div>
                 <label style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Invoice No</label>
                 <div style={{ fontWeight: "600" }}>{payment.invoice_no}</div>
              </div>
              <div>
                 <label style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Payment Date</label>
                 <div style={{ fontWeight: "600" }}>{payment.paid_date || 'Pending'}</div>
              </div>
              <div>
                 <label style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Method</label>
                 <div style={{ fontWeight: "600" }}>{payment.payment_method || 'N/A'}</div>
              </div>
              <div>
                 <label style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reference</label>
                 <div style={{ fontWeight: "600" }}>{payment.reference || 'N/A'}</div>
              </div>
           </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Payer Details">
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                 <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                    {payment.tenantName?.charAt(0)}
                 </div>
                 <div>
                    <div style={{ fontWeight: "700" }}>{payment.tenantName}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>House: {payment.houseCode}</div>
                 </div>
              </div>
              <Button variant="secondary" style={{ width: "100%" }} onClick={() => navigate('/treasurer/tenants')}>View Profile</Button>
           </Card>

           <Card title="Remarks & Actions">
              <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
                 <strong>Memo:</strong> {payment.notes || "No additional notes provided."}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                 <Button variant="primary" style={{ flex: 1 }} onClick={() => alert("Downloading PDF Receipt...")}>
                   <i className="bi bi-file-earmark-pdf"></i> Download Receipt
                 </Button>
                 <Button variant="secondary" onClick={() => navigate('/treasurer/payments/edit/' + id)}>
                   Edit Record
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerPaymentDetail;
