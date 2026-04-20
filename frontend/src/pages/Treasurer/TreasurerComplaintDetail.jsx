import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button, TextArea } from "../../components/FormElements";
import { getComplaints, updateComplaint } from "../../services/api";

function TreasurerComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const complaints = await getComplaints();
        const found = complaints.find(c => String(c.id) === String(id));
        if (found) {
          setComplaint(found);
          setRemarks(found.treasurer_remarks || "");
        } else {
          // Fallback demo data
          setComplaint({
            id: id,
            title: "Loud Neighbors after 10 PM",
            description: "The Tenants in H003 are frequently hosting parties until late at night. It's disruptive for working neighbors.",
            submitted_date: "2025-09-13",
            status: "Open",
            category: "General/Noise",
            houseAddress: "H004 - 54, Main Street",
            TenantName: "Patrick Tompson",
            priority: "Low"
          });
        }
      } catch (error) {
        console.error("Failed to fetch complaint details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateComplaint(id, { status: newStatus, treasurer_remarks: remarks });
      setComplaint({ ...complaint, status: newStatus, treasurer_remarks: remarks });
      alert("Status updated to " + newStatus);
    } catch (error) {
      alert("Failed: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <DashboardLayout role="treasurer" title="Complaint Detail"><p>Loading...</p></DashboardLayout>;
  if (!complaint) return <DashboardLayout role="treasurer" title="Complaint Detail"><p>Complaint not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="treasurer"
      title={`Review Complaint - #${String(complaint.id).padStart(4, '0')}`}



    >


      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title={complaint.title} subtitle={`Reported by ${complaint.TenantName || 'Tenant'} from ${complaint.houseAddress || 'Unit'}`}>
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
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(complaint.submitted_date).toLocaleDateString()}</span>
            </div>

            <div style={{ backgroundColor: "#f9f9f9", padding: "18px", borderRadius: "10px", marginBottom: "20px" }}>
              <div style={{ fontWeight: "700", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Complaint Content</div>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", marginBottom: complaint.attachment_url ? "15px" : "0" }}>{complaint.description}</p>
              
              {complaint.attachment_url && (
                <div style={{ marginTop: "15px" }}>
                  <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Attachment Found</div>
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${complaint.attachment_url}`} 
                    alt="Complaint Attachment" 
                    style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer" }}
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}${complaint.attachment_url}`, '_blank')}
                  />
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "5px" }}>Click to view full image</div>
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: "700", marginBottom: "10px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Treasurer's Internal Remarks</div>
              <TextArea
                placeholder="Add notes for internal tracking or for the owner to see..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <Button variant="primary" onClick={() => handleUpdate("In Progress")} disabled={updating || complaint.status === "In Progress"}>
                  Move to In Progress
                </Button>
                <Button variant="primary" onClick={() => handleUpdate("Resolved")} disabled={updating || complaint.status === "Resolved"}>
                  Resolve Issue
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card title="Quick Info">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-muted)" }}>Category:</span>
                <span style={{ fontWeight: "600" }}>{complaint.category || "General"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-muted)" }}>Priority:</span>
                <span style={{ fontWeight: "600", color: complaint.priority === 'High' ? '#e03131' : 'inherit' }}>{complaint.priority || "Normal"}</span>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "15px 0" }} />
            <Button variant="secondary" style={{ width: "100%" }} onClick={() => navigate('/treasurer/Tenants')}>
              Contact Tenant
            </Button>
          </Card>

          <Card title="Admin Actions">
            <Button variant="secondary" style={{ width: "100%", marginBottom: "10px" }} onClick={() => navigate('/treasurer/notifications/add')}>
              Notify Tenant
            </Button>
            <Button variant="secondary" style={{ width: "100%", color: "#e03131" }} onClick={() => alert("Forwarded to Owner")}>
              Forward to Owner
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TreasurerComplaintDetail;
