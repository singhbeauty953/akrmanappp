import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const links = ["होम पेज","भारत","विदेश","हेल्थ","मनोजन","करियर","फ्रांचिस","खेल","विज्ञान-तकनीकी","सोशल","वीडियो","पॉडकास्ट"];

export default function Navbar() {
  const [active, setActive] = useState("होम पेज");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleClick(link, e) {
    e.preventDefault();
    setActive(link);
    setMobileMenuOpen(false); // Close menu after selecting
    if (link === "होम पेज") {
      navigate("/");
    } else {
      navigate(`/category/${encodeURIComponent(link)}`);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Mobile hamburger menu */}
        <button className={`hamburger ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {links.map(l => (
            <li key={l}>
              <a
                href="#"
                className={active === l ? "active" : ""}
                onClick={e => handleClick(l, e)}
              >{l}</a>
            </li>
          ))}
        </ul>

        {/* Search bar */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="समाचार खोजें…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button aria-label="खोजें">🔍</button>
        </div>

        {/* Auth Section */}
        <div className="nav-auth">
          {user ? (
            <>
              <button onClick={() => navigate('/subscription')} className="subscription-btn">
                💎 Premium
              </button>
              <div className="user-menu">
                <span className="user-name">{user.phone}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/subscription')} className="subscription-btn">
                💎 Premium
              </button>
              <button onClick={() => navigate('/login')} className="login-btn">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
