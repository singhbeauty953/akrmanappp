import { useEffect, useState } from "react";
import bharatLogo from "../assets/bharatlogo.png";
import "./LogoBar.css";

export default function LogoBar() {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date().toLocaleDateString("hi-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  return (
    <div className="logo-bar">
      <div className="logo-left">
        <img src={bharatLogo} alt="Bharat News Logo" className="bharat-logo" />
      </div>
      <div className="logo-right">
        <span className="date-tag">{date}</span>
      </div>
    </div>
  );
}
