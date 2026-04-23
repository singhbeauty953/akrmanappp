import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const ADMIN_PASSWORD = "admin123"; // change this

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      navigate("/admin/dashboard");
    } else {
      setError("गलत पासवर्ड। पुनः प्रयास करें।");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🛡️</div>
        <h2>एडमिन लॉगिन</h2>
        <p>NewsPulse प्रशासन पैनल</p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="पासवर्ड दर्ज करें"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(""); }}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit">लॉगिन करें →</button>
        </form>
        <a href="/" className="back-link">← मुख्य साइट पर वापस जाएं</a>
      </div>
    </div>
  );
}
