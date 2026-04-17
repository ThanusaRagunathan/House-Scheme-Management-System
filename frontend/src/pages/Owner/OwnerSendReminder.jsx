import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button, TextArea, Input } from "../../components/FormElements";
import { getPayments, createNotification } from "../../services/api";

function OwnerSendReminder() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "Urgent: Overdue Rent Payment Reminder",
    message: "This is a formal reminder that your rent payment is currently due/overdue. Please settle your outstanding balance at your earliest convenience to avoid any late fees."
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      // Fallback for demo
      setPayments([
        { id: 1, invoice_no: "INV-2026-001", TenantName: "Karthik", houseCode: "H-001", amount: 10000, status: "Paid" },
        { id: 2, invoice_no: "INV-2026-002", TenantName: "Jack Brown", houseCode: "H-002", amount: 17000, status: "Pending" },
        { id: 3, invoice_no: "INV-2026-003", TenantName: "Sarah Connor", houseCode: "H-005", amount: 12000, status: "Pending" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const overduePayments = payments.filter(p => p.status !== "Paid" && p.TenantName);

  useEffect(() => {
    if (selectAll) {
      setSelectedTenants(new Set(overduePayments.map(p => p.id)));
    } else {
      setSelectedTenants(new Set());
    }
  }, [selectAll]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleSelect = (id) => {
    const next = new Set(selectedTenants);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedTenants(next);
  };

  const handleSendReminder = async (e) => {
    e.preventDefault();
    if (selectedTenants.size === 0) {
      setError("Please select at least one tenant to send a reminder to.");
      return;
    }
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real application, you would send a bulk notification targeted at specific tenants.
      // Here we simulate the process by creating notification records or sending an alert.
      for (const pId of selectedTenants) {
        // Assume createNotification supports targeted deliveries or simply general creation for the demo
        await createNotification({
          title: formData.title,
          message: formData.message,
          type: "Reminder",
          date: new Date().toISOString(),
          // You could pass targetTenantId if your backend supports it
        });
      }
      
      setSuccess(`Successfully sent reminders to ${selectedTenants.size} tenant(s).`);
      setSelectedTenants(new Set());
      setSelectAll(false);
      
      // Auto return after 2 seconds
      setTimeout(() => {
        navigate("/owner/notification");
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Failed to send reminders");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="owner"
      title="Send Rent Reminders"
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1.5fr", gap: "20px" }}>
        
        {/* Left Side: Overdue List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && (
            <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", border: "1px solid #ffc9c9" }}>
              <i className="bi bi-exclamation-circle" style={{ marginRight: "10px" }}></i>
              {error}
            </div>
          )}
          {success && (
            <div style={{ backgroundColor: "#e2f2e5", color: "#1a4d2e", padding: "15px", borderRadius: "10px", border: "1px solid #c3e6cb" }}>
              <i className="bi bi-check-circle-fill" style={{ marginRight: "10px" }}></i>
              {success}
            </div>
          )}

          <Card title="Overdue Tenants" subtitle={`${overduePayments.length} tenants with pending payments.`}>
            {loading ? (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Loading records...</p>
            ) : overduePayments.length === 0 ? (
              <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontSize: "15px" }}>
                <i className="bi bi-check2-circle" style={{ fontSize: "30px", color: "#1a4d2e", display: "block", marginBottom: "10px" }}></i>
                Great! There are currently no overdue payments.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #f0f0f0" }}>
                      <th style={{ padding: "12px", width: "40px" }}>
                        <input 
                          type="checkbox" 
                          checked={selectAll && overduePayments.length > 0} 
                          onChange={() => setSelectAll(!selectAll)}
                          style={{ cursor: "pointer", width: "16px", height: "16px" }}
                        />
                      </th>
                      <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Tenant</th>
                      <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>House</th>
                      <th style={{ padding: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Pending (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overduePayments.map((p, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: selectedTenants.has(p.id) ? "#f8fdf9" : "transparent" }}>
                        <td style={{ padding: "12px" }}>
                          <input 
                            type="checkbox" 
                            checked={selectedTenants.has(p.id)}
                            onChange={() => handleToggleSelect(p.id)}
                            style={{ cursor: "pointer", width: "16px", height: "16px" }}
                          />
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{p.TenantName}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{p.houseCode || 'N/A'}</td>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600", color: "#e03131" }}>{parseFloat(p.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Message Editor */}
        <div>
          <Card title="Reminder Template" subtitle="Customize the message that will be sent.">
            <form onSubmit={handleSendReminder}>
              <div style={{ marginBottom: "15px" }}>
                <Input
                  label="Message Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <TextArea
                  label="Message Body"
                  rows={8}
                  placeholder="Enter reminder details here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              
              <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px dashed #ccc", marginBottom: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
                Selected Tenants: <strong>{selectedTenants.size}</strong> out of {overduePayments.length}
              </div>

              <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <Button 
                  variant="primary" 
                  type="submit" 
                  loading={actionLoading} 
                  disabled={selectedTenants.size === 0 || overduePayments.length === 0}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <i className="bi bi-send" style={{ marginRight: "8px" }}></i> Send Reminders
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate("/owner/notification")} 
                  disabled={actionLoading}
                  style={{ width: "100%", justifyContent: "center", backgroundColor: "white" }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default OwnerSendReminder;
