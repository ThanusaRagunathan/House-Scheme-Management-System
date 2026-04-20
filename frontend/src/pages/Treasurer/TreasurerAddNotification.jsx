import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Input, Button, Card, TextArea } from "../../components/FormElements";
import { createNotification } from "../../services/api";

function TreasurerAddNotification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Financial"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createNotification({
        ...formData,
        date: new Date().toISOString()
      });
      navigate("/treasurer/notifications");
    } catch (err) {
      setError(err.message || "Failed to broadcast notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="treasurer" title="Broadcast Notification">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "#e03131", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ffc9c9" }}>
            {error}
          </div>
        )}

        <Card 
          title="Create New Announcement" 
          subtitle="Send a notification or alert to all residents of the housing scheme."
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
              <Input
                label="Notification Title"
                placeholder="e.g. Urgent: Utility Maintenance Check"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "var(--text-muted)", marginBottom: "8px" }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                    fontSize: "15px",
                    backgroundColor: "white",
                    outline: "none"
                  }}
                >
                  <option value="Financial">Financial Alert</option>
                  <option value="General">General Announcement</option>
                  <option value="Urgent">Urgent Warning</option>
                  <option value="Facility Closure">Facility Closure</option>
                </select>
              </div>
            </div>

            <TextArea
              label="Notification Message"
              rows={6}
              placeholder="Provide a clear and detailed announcement for the tenants..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <Button variant="secondary" onClick={() => navigate("/treasurer/notifications")} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Send Notification
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerAddNotification;
