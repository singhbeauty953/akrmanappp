import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { premiumCards } from "../data/newsData";
import { getArticles } from "../data/store";
import "./PremiumNewsSection.css";

export default function PremiumNewsSection() {
  const [dynamic, setDynamic] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const stored = getArticles().filter(a => a.section === "premium");
    setDynamic(stored);
  }, []);

  // Merge dynamic (admin) articles at the top, then static defaults
  const allCards = [
    ...dynamic.map(a => ({
      id: a.id,
      img: a.img,
      badge: a.badge,
      badgeClass: a.badge,
      title: a.title,
      desc: a.desc,
      time: a.time,
      author: a.author,
      content: a.content,
    })),
    ...premiumCards.map((c, i) => ({ ...c, id: `static-premium-${i}` }))
  ];

  const isPremium = user?.subscriptionStatus === 'active' && user?.subscriptionPlan;

  const handleCardClick = (cardId) => {
    if (isPremium) {
      navigate(`/article/${cardId}`);
    }
  };

  return (
    <section className="premium-news-section">
      <div className="section-header">
        <h2><span className="section-icon">👑</span> Premium News</h2>
        <a href="#" className="see-all">सभी देखें →</a>
      </div>

      <div className="news-grid-4">
        {allCards.map((c, i) => (
          <div
            key={i}
            className={`news-card premium-card ${!isPremium ? "locked" : ""}`}
            onClick={() => handleCardClick(c.id)}
            style={{ cursor: isPremium ? "pointer" : "default" }}
          >
            <img src={c.img} alt={c.badgeClass} />
            
            {!isPremium && (
              <div className="premium-overlay">
                <div className="lock-icon">🔒</div>
                <p className="overlay-text">Subscribe to read</p>
                <button
                  className="subscribe-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/subscription");
                  }}
                >
                  Subscribe Now
                </button>
              </div>
            )}

            <div className="news-card-body">
              <span className={`badge ${c.badgeClass}`}>
                {c.badgeClass?.replace("badge-", "")}
              </span>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
              <div className="card-meta">
                🕐 {c.time}
                {c.author && ` | ✍️ ${c.author}`}
              </div>
              {isPremium && (
                <button
                  className="inline-read"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/article/${c.id}`);
                  }}
                >
                  और पढ़ें →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
