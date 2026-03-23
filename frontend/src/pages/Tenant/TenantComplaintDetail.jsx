import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Button } from "../../components/FormElements";
import { getComplaints, getTenantProfile } from "../../services/api";

function TenantComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [complaints, profileData] = await Promise.all([
          getComplaints(),
          getTenantProfile()
        ]);
        const found = complaints.find(c => String(c.id) === String(id));
        setComplaint(found || {
            id: id,
            title: "Leaking Faucet in Kitchen",
            description: "The kitchen faucet has been leaking since yesterday morning. It's wasting a lot of water and causing a mess under the sink.",
            submitted_date: "2025-09-05",
            status: "In Progress",
            category: "Plumbing",
            owner_response: "Plumber has been assigned. Expect them tomorrow morning.",
            history: [
              { date: "2025-09-05", status: "Submitted", note: "Complaint logged." },
              { date: "2025-09-06", status: "In Progress", note: "Landlord: Plumber assigned." }
            ]
        });
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch complaint details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <DashboardLayout role="tenant" title="Complaint Detail"><p>Loading...</p></DashboardLayout>;
  if (!complaint) return <DashboardLayout role="tenant" title="Complaint Detail"><p>Complaint not found.</p></DashboardLayout>;

  return (
    <DashboardLayout
      role="tenant"
      title={`Complaint Detail - #${String(complaint.id).padStart(4, '0')}`}
      userName={profile?.username || "Resident"}
      userInitials={profile?.username?.charAt(0) || "R"}
      userRoleLabel={`${profile?.houseAddress || "Loading..."} - Tenant`}
    >
      <div style={{ marginBottom: "25px" }}>
        <Button variant="secondary" onClick={() => navigate("/tenant/complaints")}>
          <i className="bi bi-arrow-left"></i> Back to My Complaints
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <Card 
            title={complaint.title} 
            subtitle={`Submitted on ${new Date(complaint.submitted_date).toLocaleDateString()}`}
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
                   Category: <strong style={{color: "var(--text-dark)"}}>{complaint.category || "General"}</strong>
                </span>
             </div>

             <div style={{ marginBottom: "25px" }}>
                <div style={{ fontWeight: "700", marginBottom: "8px", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" }}>Description</div>
                <p style={{ margin: 0, lineHeight: "1.6", color: "#444" }}>{complaint.description}</p>
             </div>

             {complaint.owner_response && (
               <div style={{ backgroundColor: "#f0f7f2", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #1a4d2e" }}>
                  <div style={{ fontWeight: "700", marginBottom: "8px", fontSize: "13px", color: "#1a4d2e", textTransform: "uppercase" }}>Owner Response</div>
                  <p style={{ margin: 0, lineHeight: "1.6", color: "#2d3436", fontStyle: "italic" }}>"{complaint.owner_response}"</p>
               </div>
             )}
          </Card>

          <Card title="Track Progress">
             <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {(complaint.history || []).map((event, i) => (
                  <div key={i} style={{ display: "flex", gap: "15px" }}>
                     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--primary)" }}></div>
                        {i !== (complaint.history?.length || 1) - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#eee" }}></div>}
                     </div>
                     <div style={{ paddingBottom: "10px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(event.date).toLocaleDateString()}</div>
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>{event.status}</div>
                        <div style={{ i: 1, fontSize: "13px", color: "#666" }}>{event.note}</div>
                     </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
           <Card title="Help & Support">
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "15px" }}>
                 Having trouble with this complaint? You can contact the property management directly.
              </p>
              <Button variant="secondary" style={{ width: "100%" }} onClick={() => navigate('/tenant/notification')}>
                 Message Owner
              </Button>
           </Card>

           <Card title="Manage">
              <Button variant="secondary" style={{ width: "100%", color: "#e03131" }} onClick={() => alert("Cancel logic would go here")}>
                 Cancel Complaint
              </Button>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TenantComplaintDetail;
