import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles } from "../data/store";
import "./NewsSection.css";

export default function NewsSection({ id, icon, title, cards, altBg, layout }) {
  const [dynamic, setDynamic] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getArticles().filter(a => a.section === id);
    setDynamic(stored);
  }, [id]);

  // Merge dynamic (admin) articles at the top, then static defaults
  const allCards = [...dynamic.map(a => ({
    id: a.id, img: a.img, badge: a.badge, badgeClass: a.badge,
    title: a.title, desc: a.desc, time: a.time, author: a.author, content: a.content,
  })), ...cards.map((c, i) => ({ ...c, id: `static-${id}-${i}` }))];

  return (
    <section className={`main-news-section${altBg ? " alt-bg" : ""}`} id={id}>
      <div className="section-header">
        <h2><span className="section-icon">{icon}</span> {title}</h2>
        <a href="#" className="see-all">सभी देखें →</a>
      </div>

      {layout === "mixed" ? (
        <div className="news-grid-mixed">
          {/* Wide card */}
          <div className="news-card-wide" onClick={() => navigate(`/article/${allCards[0].id}`)}>
            <img src={allCards[0].img} alt={allCards[0].badge} />
            <div className="news-card-body">
              <span className={`badge ${allCards[0].badgeClass}`}>{allCards[0].badgeClass.replace("badge-", "")}</span>
              <h3>{allCards[0].title}</h3>
              <p>{allCards[0].desc}</p>
              <div className="card-meta">🕐 {allCards[0].time} &nbsp;|&nbsp; ✍️ {allCards[0].author}</div>
              <button className="inline-read" onClick={(e) => { e.stopPropagation(); navigate(`/article/${allCards[0].id}`); }}>और पढ़ें →</button>
            </div>
          </div>
          {/* Mini stack */}
          <div className="news-card-stack">
            {allCards.slice(1).map((c, i) => (
              <div className="news-card-mini" key={i} onClick={() => navigate(`/article/${c.id}`)}>
                <img src={c.img} alt={c.badgeClass} />
                <div>
                  <span className={`badge ${c.badgeClass}`}>{c.badgeClass?.replace("badge-", "")}</span>
                  <h5>{c.title}</h5>
                  <p className="mini-meta">🕐 {c.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="news-grid-4">
          {allCards.map((c, i) => (
            <div className="news-card" key={i} onClick={() => navigate(`/article/${c.id}`)}>
              <img src={c.img} alt={c.badgeClass} />
              <div className="news-card-body">
                <span className={`badge ${c.badgeClass}`}>{c.badgeClass?.replace("badge-", "")}</span>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
                <div className="card-meta">🕐 {c.time}</div>
                <button className="inline-read" onClick={(e) => { e.stopPropagation(); navigate(`/article/${c.id}`); }}>और पढ़ें →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
