import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button, TextArea } from "../../components/FormElements";
import { getComplaints, updateComplaint } from "../../services/api";

function OwnerComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      try {
        const complaints = await getComplaints();
        const found = complaints.find(c => String(c.id) === String(id));
        if (found) {
          setComplaint(found);
          setResponse(found.owner_response || "");
        } else {
          // Fallback demo data
          setComplaint({
            id: id,
            title: "Leaking Faucet in Kitchen",
            description: "The kitchen faucet has been leaking since yesterday morning. It's wasting a lot of water and causing a mess under the sink.",
            houseAddress: "H002 - 124, Oak Street",
            TenantName: "Jack Sparrow",
            submitted_date: "2025-09-05",
            status: "In Progress",
            priority: "Medium",
            category: "Plumbing",
            history: [
              { date: "2025-09-05", status: "Open", note: "Complaint submitted by Tenant." },
              { date: "2025-09-06", status: "In Progress", note: "Landlord viewed the complaint and assigned a plumber." }
            ]
          });
        }
      } catch (error) {
        console.error("Failed to fetch complaint details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await updateComplaint(id, { status: newStatus, owner_response: response });
      setComplaint({ ...complaint, status: newStatus, owner_response: response });
      alert("Complaint status updated to " + newStatus);
    } catch (error) {
      alert("Failed to update: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <DashboardLayout role="owner" title="Complaint Details"><p>Loading...</p></DashboardLayout>;
  if (!complaint) return <DashboardLayout role="owner" title="Complaint Details"><p>Complaint not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="owner"
      title={`Complaint Detail - #${String(complaint.id).padStart(4, '0')}`}



    >


      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card
            title={complaint.title}
            subtitle={`Submitted on ${new Date(complaint.submitted_date).toLocaleDateString()} by ${complaint.TenantName || 'Tenant'}`}
          >
            <div style={{ marginBottom: "20px" }}>
              <span style={{
                padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                backgroundColor: complaint.status === "Resolved" ? "#e2f2e5" : (complaint.status === "Open" ? "#fff5f5" : "#fff8e1"),
                color: complaint.status === "Resolved" ? "#1a4d2e" : (complaint.status === "Open" ? "#e03131" : "#f57c00"),
                textTransform: "uppercase",
                marginRight: "10px"
              }}>
                {complaint.status}
              </span>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Category: <strong style={{ color: "var(--text-dark)" }}>{complaint.category || "General"}</strong>
              </span>
            </div>

            <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "12px", marginBottom: "25px" }}>
              <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>Description</div>
              <p style={{ margin: 0, lineHeight: "1.6", color: "#444", marginBottom: complaint.attachment_url ? "15px" : "0" }}>{complaint.description}</p>
              
              {complaint.attachment_url && (
                <div style={{ marginTop: "15px" }}>
                  <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>Attachment</div>
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${complaint.attachment_url}`} 
                    alt="Complaint Attachment" 
                    style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer" }}
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}${complaint.attachment_url}`, '_blank')}
                  />
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "5px" }}>Click image to open in full size</div>
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>Your Response</div>
              <TextArea
                placeholder="Add a note or response to the Tenant..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                disabled={complaint.status === "Resolved"}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                {complaint.status !== "Resolved" && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateStatus("In Progress")}
                      disabled={updating || complaint.status === "In Progress"}
                    >
                      Mark In Progress
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateStatus("Resolved")}
                      disabled={updating}
                    >
                      Mark as Resolved
                    </Button>
                  </>
                )}
                {complaint.status === "Resolved" && (
                  <p style={{ color: "#1a4d2e", fontWeight: "600" }}><i className="bi bi-check-circle-fill"></i> This complaint has been resolved.</p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Timeline">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(complaint.history || [
                { date: complaint.submitted_date, status: "Submitted", note: "Complaint logged in system." }
              ]).map((event, i) => (
                <div key={i} style={{ display: "flex", gap: "15px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--primary)" }}></div>
                    {i !== (complaint.history?.length || 1) - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#eee" }}></div>}
                  </div>
                  <div style={{ paddingBottom: "10px" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(event.date).toLocaleDateString()}</div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{event.status}</div>
                    <div style={{ fontSize: "13px", color: "#666" }}>{event.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Tenant Details">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                {complaint.TenantName?.charAt(0) || "T"}
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px" }}>{complaint.TenantName || "Tenant"}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tenant</div>
              </div>
            </div>
            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>House:</span>
                <span style={{ fontWeight: "600" }}>{complaint.houseAddress || "N/A"}</span>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "15px 0" }} />
            <Button variant="secondary" style={{ width: "100%" }} onClick={() => navigate(`/owner/Tenants`)}>
              Contact Tenant
            </Button>
          </Card>

          <Card title="Quick Info">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-muted)" }}>Priority:</span>
                <span style={{ fontWeight: "600", color: complaint.priority === "High" ? "#e03131" : "inherit" }}>{complaint.priority || "Medium"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-muted)" }}>ID:</span>
                <span style={{ fontWeight: "600" }}>CMP-{id}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OwnerComplaintDetail;
