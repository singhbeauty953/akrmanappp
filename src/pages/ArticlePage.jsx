import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticles } from "../data/store";
import "./ArticlePage.css";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allArticles = getArticles();
    const found = allArticles.find(a => a.id === id);
    if (found) {
      setArticle(found);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="article-loading">लोड हो रहा है...</div>;
  }

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>😕 समाचार नहीं मिला</h2>
        <button onClick={() => navigate("/")} className="btn-home">होम पर जाएं</button>
      </div>
    );
  }

  return (
    <article className="article-page">
      {/* Header */}
      <div className="article-header">
        <button className="back-btn" onClick={() => navigate("/")}>&larr; वापस जाएं</button>
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className={`badge ${article.badge}`}>
            {article.badge.replace("badge-", "")}
          </span>
          {article.author && <span>✍️ {article.author}</span>}
          <span>🕐 {article.time || "अभी"}</span>
        </div>
      </div>

      {/* Image */}
      {article.img && (
        <div className="article-image-wrap">
          <img src={article.img} alt={article.title} className="article-image" />
        </div>
      )}

      {/* Content */}
      <div className="article-container">
        {/* Summary */}
        {article.desc && (
          <p className="article-summary">
            <strong>{article.desc}</strong>
          </p>
        )}

        {/* Full content */}
        <div className="article-body">
          {article.content ? (
            <div className="article-text">
              {article.content.split("\n").map((para, i) => (
                para.trim() && <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            <p className="no-content">पूरी कहानी जल्द आ रही है...</p>
          )}
        </div>

        {/* Share & More */}
        <div className="article-footer">
          <div className="share-buttons">
            <button className="share-btn">📤 शेयर करें</button>
            <button className="share-btn">🔖 सहेजें</button>
          </div>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← अन्य समाचार देखें
          </button>
        </div>
      </div>
    </article>
  );
}
