import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticles } from "../data/store";
import { section1Cards, section2Cards, section3Cards } from "../data/newsData";
import "./CategoryPage.css";

const CATEGORIES = {
  "होम पेज":         { section: "all", icon: "🏠" },
  "भारत":          { section: "section1", icon: "🇮🇳" },
  "विदेश":         { section: "section1", icon: "🌍" },
  "हेल्थ":         { section: "section2", icon: "❤️" },
  "मनोजन":         { section: "section3", icon: "🎬" },
  "करियर":         { section: "section1", icon: "💼" },
  "फ्रांचिस":      { section: "section3", icon: "🏢" },
  "खेल":          { section: "section3", icon: "⚽" },
  "विज्ञान-तकनीकी": { section: "section3", icon: "🔬" },
  "सोशल":         { section: "section1", icon: "👥" },
  "वीडियो":        { section: "all", icon: "🎥" },
  "पॉडकास्ट":      { section: "all", icon: "🎙️" },
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const cat = decodeURIComponent(category);
    const config = CATEGORIES[cat];
    
    if (!config) {
      navigate("/");
      return;
    }

    // Get all stored articles and filter by section
    const allStored = getArticles();
    const stored = config.section === "all"
      ? allStored
      : allStored.filter(a => a.section === config.section);

    setArticles(stored);
  }, [category, navigate]);

  const cat = decodeURIComponent(category);
  const config = CATEGORIES[cat];
  
  if (!config) return null;

  return (
    <>
      {/* Header */}
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate("/")}>&larr; होम</button>
        <h1>{config.icon} {cat}</h1>
      </div>

      {/* Content */}
      <div className="category-container">
        {articles.length === 0 ? (
          <div className="no-articles">
            <p>इस श्रेणी में अभी कोई समाचार नहीं है।</p>
            <button onClick={() => navigate("/")} className="back-to-home">होम पर जाएं</button>
          </div>
        ) : (
          <div className="category-grid">
            {articles.map((a, i) => (
              <article className="category-card" key={i} onClick={() => navigate(`/article/${a.id}`)}>
                {a.img && <img src={a.img} alt={a.title} className="card-img" />}
                <div className="card-content">
                  <span className={`badge ${a.badge}`}>
                    {a.badge.replace("badge-", "")}
                  </span>
                  <h3>{a.title}</h3>
                  {a.desc && <p className="card-desc">{a.desc}</p>}
                  <div className="card-meta">
                    <span>🕐 {a.time || "अभी"}</span>
                    {a.author && <span>✍️ {a.author}</span>}
                    <span className="badge-new">नया</span>
                  </div>
                  <button className="read-more" onClick={(e) => { e.stopPropagation(); navigate(`/article/${a.id}`); }}>और पढ़ें →</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
