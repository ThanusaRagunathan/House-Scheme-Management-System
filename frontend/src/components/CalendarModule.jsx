import React, { useState, useEffect } from "react";
import { getPayments, getMaintenances } from "../services/api";

function CalendarModule({ role }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [role]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [payments, maintenances] = await Promise.all([
        getPayments().catch(() => []),
        getMaintenances().catch(() => [])
      ]);

      const formattedEvents = [];

      // Parse Payments (Due Dates)
      payments.forEach(p => {
        if (p.due_date || p.paid_date) {
            // Priority given to due_date or fallback to paid_date
            const eventDate = p.due_date || p.paid_date;
            formattedEvents.push({
            id: `p_${p.id || p.payment_id}`,
            date: new Date(eventDate),
            title: `Rent: Rs. ${p.amount}`,
            subtitle: p.houseAddress || p.houseCode || 'Pending',
            type: "payment",
            color: p.status === 'Paid' ? "#1a4d2e" : "#e03131",
            bg: p.status === 'Paid' ? "#e2f2e5" : "#fff5f5"
            });
        }
      });

      // Parse Maintenance (Scheduled Dates)
      maintenances.forEach(m => {
        if (m.scheduled_date) {
          const isFacilityClosure = m.facility && !m.house_id;
          
          formattedEvents.push({
            id: `m_${m.task_id || m.id}`,
            date: new Date(m.scheduled_date),
            title: isFacilityClosure ? `Closure: ${m.facility}` : `Maintenance: ${m.house_code || 'Unit'}`,
            subtitle: m.category || "Scheduled Task",
            type: "maintenance",
            color: isFacilityClosure ? "#813ebd" : "#0d6efd",
            bg: isFacilityClosure ? "#f3e8fc" : "#e7f1ff"
          });
        }
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch calendar events", error);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderCells = () => {
    const cells = [];
    
    // Empty cells before the first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} style={{ minHeight: "120px", backgroundColor: "#fbfcfd", border: "1px solid #f0f0f0" }}></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const currentCellDate = new Date(year, month, d);
      const isToday = new Date().toDateString() === currentCellDate.toDateString();
      
      const dayEvents = events.filter(e => {
        return e.date.getFullYear() === year && 
               e.date.getMonth() === month && 
               e.date.getDate() === d;
      });

      cells.push(
        <div key={d} style={{ 
          minHeight: "120px", 
          border: "1px solid #f0f0f0", 
          padding: "10px", 
          backgroundColor: isToday ? "#fafeff" : "white",
          boxShadow: isToday ? "inset 0 0 0 2px var(--primary)" : "none",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{ fontWeight: isToday ? "700" : "500", color: isToday ? "var(--primary)" : "#333", fontSize: "14px" }}>
            {d}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1, overflowY: "auto" }}>
            {dayEvents.map(event => (
              <div key={event.id} style={{ 
                backgroundColor: event.bg, 
                color: event.color, 
                padding: "6px 8px", 
                borderRadius: "6px", 
                fontSize: "11px",
                borderLeft: `3px solid ${event.color}`
              }}>
                <div style={{ fontWeight: "700", marginBottom: "2px" }}>{event.title}</div>
                <div style={{ fontSize: "10px", opacity: 0.8 }}>{event.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading Calendar Events...</div>;
  }

  return (
    <div style={{ backgroundColor: "white", borderRadius: "15px", overflow: "hidden", border: "1px solid #f0f0f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 25px", borderBottom: "1px solid #f0f0f0" }}>
        <h2 style={{ margin: 0, fontSize: "20px", color: "var(--text-dark)" }}>{monthNames[month]} {year}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {(() => {
            const today = new Date();
            const viewMonth = year * 12 + month;
            const todayMonth = today.getFullYear() * 12 + today.getMonth();
            
            return (
              <>
                <button 
                  onClick={prevMonth} 
                  style={{ 
                    background: viewMonth < todayMonth ? "var(--primary)" : "white", 
                    color: viewMonth < todayMonth ? "white" : "var(--text-dark)",
                    border: "1px solid #e0e0e0", 
                    borderRadius: "8px", 
                    padding: "8px 18px", 
                    cursor: "pointer", 
                    fontWeight: "700",
                    transition: "var(--transition)",
                    boxShadow: viewMonth < todayMonth ? "0 4px 10px rgba(26, 77, 46, 0.2)" : "none"
                  }}
                >
                  <i className="bi bi-chevron-left" style={{ marginRight: "5px" }}></i>
                  Prior
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())} 
                  style={{ 
                    background: viewMonth === todayMonth ? "var(--primary)" : "#f8f9fa", 
                    color: viewMonth === todayMonth ? "white" : "var(--text-dark)",
                    border: "1px solid #e0e0e0", 
                    borderRadius: "8px", 
                    padding: "8px 18px", 
                    cursor: "pointer", 
                    fontWeight: "700",
                    transition: "var(--transition)",
                    boxShadow: viewMonth === todayMonth ? "0 4px 10px rgba(26, 77, 46, 0.2)" : "none"
                  }}
                >
                  Today
                </button>
                <button 
                  onClick={nextMonth} 
                  style={{ 
                    background: viewMonth > todayMonth ? "var(--primary)" : "white", 
                    color: viewMonth > todayMonth ? "white" : "var(--text-dark)",
                    border: "1px solid #e0e0e0", 
                    borderRadius: "8px", 
                    padding: "8px 18px", 
                    cursor: "pointer", 
                    fontWeight: "700",
                    transition: "var(--transition)",
                    boxShadow: viewMonth > todayMonth ? "0 4px 10px rgba(26, 77, 46, 0.2)" : "none"
                  }}
                >
                  Next
                  <i className="bi bi-chevron-right" style={{ marginLeft: "5px" }}></i>
                </button>
              </>
            );
          })()}
        </div>
      </div>

      {/* Days Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "15px 25px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #f0f0f0", fontSize: "12px", fontWeight: "600", color: "#666" }}>
        <span><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#0d6efd", borderRadius: "50%", marginRight: "6px" }}></span> Maintenance</span>
        <span><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#e03131", borderRadius: "50%", marginRight: "6px" }}></span> Due Rent</span>
        <span><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#1a4d2e", borderRadius: "50%", marginRight: "6px" }}></span> Paid Rent</span>
        <span><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#813ebd", borderRadius: "50%", marginRight: "6px" }}></span> Facility Booking/Closure</span>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days.map(day => (
          <div key={day} style={{ padding: "15px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", borderBottom: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0" }}>
            {day}
          </div>
        ))}
        {renderCells()}
      </div>
    </div>
  );
}

export default CalendarModule;
