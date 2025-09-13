import { useState, useEffect } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Date/time formatting
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const day = currentDate.getDate();
  const weekday = currentDate.toLocaleString("default", { weekday: "long" });

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const isPM = hours >= 12;
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  // Calendar calculations
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(year, currentDate.getMonth() + 1, 0);

  const daysInMonth = [];
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    daysInMonth.push(null);
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(i);
  }

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="homepage">
      {/* Clock */}
      <div className="clock">
        <p className="date-text">
          {weekday.toUpperCase()} {day} {monthName.slice(0, 3).toUpperCase()}
        </p>
        <h1 className="time">
          {displayHours}:{displayMinutes}
          <span className="ampm">{isPM ? "PM" : "AM"}</span>
        </h1>
      </div>

      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {monthName.toUpperCase()} {year}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-dayname">
            {d}
          </div>
        ))}
        {daysInMonth.map((d, i) => (
          <div
            key={i}
            className={`calendar-day ${
              d === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? "today"
                : ""
            }`}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
