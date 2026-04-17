import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <header style={{
        padding: "20px 0",
        backgroundColor: "var(--primary)",
        position: "fixed",
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <nav style={{ display: "flex", gap: "30px" }}>
            <a href="#home" style={{ color: "white", fontWeight: "500" }}>Home</a>
            <a href="#about" style={{ color: "white", fontWeight: "500" }}>About Us</a>
            <a href="#features" style={{ color: "white", fontWeight: "500" }}>Features</a>
            <a href="#contact" style={{ color: "white", fontWeight: "500" }}>Contact</a>
          </nav>
        </div>
      </header>

      <section id="home"
        style={{
          position: "relative",
          minHeight: "100vh",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1, color: "white", textAlign: "left" }}>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", color: "white", lineHeight: "1.1", marginBottom: "20px" }}>
            House Scheme <br /> Management System
          </h1>
          <p style={{ fontSize: "20px", maxWidth: "600px", marginBottom: "40px", opacity: "0.9" }}>
            Simplify your house, Tenant and finance management in one sophisticated platform built for modern living.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ fontSize: "18px", padding: "15px 40px" }}
          >
            Get Started
          </button>
        </div>
      </section>

      <section id="about" className="section-padding" style={{ backgroundColor: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>Manage Your Housing Scheme Smarter</h2>
              <p style={{ fontSize: "18px", color: "var(--text-muted)" }}>
                The House Scheme Management System unites all housing operations in one platform. It enables owners, Tenants, and treasurers to manage houses, payments, and finances seamlessly.
                With user-friendly tools and secure data handling, it replaces manual records, reduces errors, and ensures transparency and easy access anytime, anywhere.
              </p>
            </div>
            <div className="glass-card" style={{ padding: "40px", backgroundColor: "var(--primary)", color: "white" }}>
              <h3 style={{ color: "white", marginBottom: "15px" }}>Our Mission</h3>
              <p>To provide a transparent, efficient, and user-centric ecosystem for Tenantial communities, ensuring that administrative complexity never hinders community living.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-padding" style={{ backgroundColor: "var(--background)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "40px" }}>Core Features</h2>
            <div style={{ height: "4px", width: "80px", backgroundColor: "var(--secondary)", margin: "20px auto" }}></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            <FeatureCard
              title="House & Tenant Management"
              desc="Add, update, and manage multiple houses, Tenants, and their respective lease agreements effortlessly."
            />
            <FeatureCard
              title="Rent Collection & Tracking"
              desc="Automate monthly rent collection, view payment history, and issue receipts digitally."
            />
            <FeatureCard
              title="Maintenance Requests"
              desc="Tenants can raise maintenance issues that are tracked until resolved, ensuring accountability."
            />
            <FeatureCard
              title="Financial Reporting"
              desc="Treasurers can generate detailed reports for income, expenses, and fund utilization."
            />
            <FeatureCard
              title="Alerts & Notifications"
              desc="Receive instant reminders for rent due dates, maintenance updates, and payment confirmations."
            />
            <FeatureCard
              title="Lease Agreement Management"
              desc="Create and manage lease documents and renewal alerts digitally."
            />
          </div>
        </div>
      </section>

      <footer id="contact" style={{ padding: "80px 0 40px", backgroundColor: "var(--primary)", color: "white" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", marginBottom: "60px" }}>
            <div>
              <h3 style={{ color: "white", marginBottom: "20px" }}>HSMS</h3>
              <p style={{ opacity: 0.8 }}>Professional housing management solutions for modern communities.</p>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "20px" }}>Contact Us</h4>
              <p style={{ opacity: 0.8, marginBottom: "10px" }}>Email: <a href="mailto:support@housescheme.lk" style={{ color: "white", textDecoration: "underline" }}>support@housescheme.lk</a></p>
              <p style={{ opacity: 0.8, marginBottom: "10px" }}>Phone: <a href="tel:+94771234567" style={{ color: "white", textDecoration: "underline" }}>+94 77 123 4567</a></p>
              <p style={{ opacity: 0.8 }}>Address: Prime Villas, Old Kandy Road, Dalugama, Sri Lanka</p>
            </div>
            <div>
              <h4 style={{ color: "white", marginBottom: "20px" }}>Quick Links</h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="#home" style={{ opacity: 0.8 }}>Home</a>
                <a href="#about" style={{ opacity: 0.8 }}>About Us</a>
                <a href="#features" style={{ opacity: 0.8 }}>Features</a>
              </nav>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px", textAlign: "center", opacity: 0.6, fontSize: "14px" }}>
            © 2026 House Scheme Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="glass-card" style={{
      padding: "30px",
      transition: "var(--transition)",
      cursor: "default",
      border: "1px solid rgba(0, 0, 0, 0.15)",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.15)";
      }}
    >
      <h4 style={{ marginBottom: "15px", color: "var(--primary)" }}>{title}</h4>
      <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>{desc}</p>
    </div>
  );
}

export default Home;

