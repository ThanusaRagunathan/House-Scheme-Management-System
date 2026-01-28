import Background from "../assets/bgimg.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
   const navigate = useNavigate();
      const cardStyle={ 
        backgroundColor:"#0b3d02", 
        padding:"20px", 
        margin:"20px", 
        maxWidth:"200px",
        height:"200px", 
        color:"white",
        border:"1px solid black", 
        textAlign:"center", 
        justifyContent:"center", 
        display:"flex", 
        flexDirection:"column", 
      };
      const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  cursor: "pointer",
};

  return (
    <div>
      <header style={{padding:"50px", backgroundColor:"#0b3d02"}}>
        <div style={{display:"flex", justifyContent:"flex-end", gap:"50px", color:"white", fontSize:"20px"}}>
        <nav><a href="#home" style={navLinkStyle}>Home</a></nav>
        <nav><a href="#about" style={navLinkStyle}>About Us</a></nav>
        <nav><a href="#features" style={navLinkStyle}>Features</a></nav>
        <nav><a href="#contact" style={navLinkStyle}>Contact</a></nav>
        </div>
      </header>
    
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        borderBottom:"2px solid black",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          color: "black",
          padding: "40px",
          textAlign: "center"
        }}
      >
        
        <h1 id="home" style={{fontSize:"80px"}}>House Scheme <br /> Managment System</h1>
        <h1 style={{fontSize:"40px"}}>Simplify your house, tenant and finance managment in one platform</h1>
        <button onClick={() => navigate('/login')} style={{height:"40px", width:"100px", color:"white", backgroundColor:"#0b3d02", borderRadius:"15px", cursor:"pointer"}}>Login</button>
      </div>
      
    </div>
    <div>
      <h1 id="about">About Us</h1>
      <i>Manage Your Housing Scheme Smarter <br /></i><br />
      The House Scheme Management System unites all housing operations in
      one platform. It enables owners, tenants, and treasurers to manage
      properties, payments, and finances seamlessly. With user-friendly tools
      and secure data handling, it replaces manual records, reduces errors,
      and ensures transparency and easy access anytime, anywhere.
    </div>

    <div>
      <h1 id="features">Features</h1>
       <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"20px"}} >
      <div style={cardStyle}>
        <h4>Property & Tenant <br />Management</h4>
        <p>Add, update, and manage multiple properties, tenants, and their respective lease agreements effortlessly.</p>
      </div>
      <div style={cardStyle}>
        <h4>Rent Collection & Tracking</h4>
        <p>Automate monthly rent collection, view payment history, and issue receipts digitally.</p>
      </div>
      <div style={cardStyle}>
        <h4>Maintenance Requests</h4>
        <p>Tenants can raise maintenance issues that are tracked until resolved, ensuring accountability.</p>
      </div>
      <div style={cardStyle}>
        <h4>Financial Reporting</h4>
        <p>Treasurers can generate detailed reports for income, expenses, and fund utilization.</p>
      </div>
      <div style={cardStyle}>
        <h4>Alerts & Notifications</h4>
        <p>Receive instant reminders for rent due dates, maintenance updates, and payment confirmations.</p>
      </div>
      <div style={cardStyle}>
        <h4>Lease Agreement Management</h4>
        <p>Create and manage lease documents and renewal alerts digitally.</p>
      </div>
      </div>
    </div>
    <div>
      <footer style={{padding:"15px", backgroundColor:"#0b3d02", height:"250px", color:"white"}}>
<h1 id="contact">Contact</h1>
<p>Have any questions or need help getting started?<br />
Reach out to us — we’re here to help you manage your housing scheme efficiently. <br /><br /> Email:
<a href="mailto:support@housescheme.lk">support@housescheme.lk</a> <br />
Address: Prime Villas, Old Kandy Road, Dalugama, Sri Lanka <br />
Phone: +94 77 123 4567 <br />
Website: <a href="https://www.primelands.lk/house/DALUGAMA-PRIME-VILLAS/en" target="_blank">www.primelands.lk</a></p>
      </footer>
    </div>
    </div>
    
  );
}

export default Home;
