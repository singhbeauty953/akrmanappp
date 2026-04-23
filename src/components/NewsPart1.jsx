import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles } from "../data/store";
import "./NewsPart1.css";

const DEFAULT_SIDE_STORIES = [
  {
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
    badge: "तकनीक", badgeClass: "badge-blue",
    title: "AI की बड़ी सफलता: नया मॉडल मानवीय तर्क परीक्षण में आगे निकला",
    time: "4 घंटे पहले",
    id: "static-side-1"
  },
  {
    img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400&q=80",
    badge: "स्वास्थ्य", badgeClass: "badge-green",
    title: "WHO ने उष्णकटिबंधीय रोगों के लिए नई वैक्सीन को मंजूरी दी",
    time: "6 घंटे पहले",
    id: "static-side-2"
  },
  {
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    badge: "अर्थव्यवस्था", badgeClass: "badge-orange",
    title: "भारत की GDP वृद्धि FY 2026-27 में 7.4% रहने का अनुमान",
    time: "8 घंटे पहले",
    id: "static-side-3"
  },
];

export default function NewsPart1() {
  const navigate = useNavigate();
  const [heroStory, setHeroStory] = useState(null);
  const [sideStories, setSideStories] = useState(DEFAULT_SIDE_STORIES);

  useEffect(() => {
    // Get hero story from admin articles or use default
    const articles = getArticles();
    const hero = articles.find(a => a.section === "hero");
    if (hero) {
      setHeroStory({
        img: hero.img,
        badge: hero.badgeLabel || hero.badge?.replace("badge-", ""),
        badgeClass: hero.badge,
        title: hero.title,
        desc: hero.desc,
        time: hero.time,
        author: hero.author,
        id: hero.id,
      });
    }

    // Get side stories - admin articles with featured flag
    const featured = articles.filter(a => a.featured && a.section !== "hero");
    if (featured.length > 0) {
      setSideStories(featured.slice(0, 3).map(a => ({
        img: a.img,
        badge: a.badgeLabel || a.badge?.replace("badge-", ""),
        badgeClass: a.badge,
        title: a.title,
        time: a.time,
        id: a.id,
      })));
    }
  }, []);

  const displayHero = heroStory || {
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80",
    badge: "मुख्य समाचार",
    badgeClass: "badge-red",
    title: "2026 में ऐतिहासिक जलवायु सम्मेलन के लिए विश्व नेता एकजुट",
    desc: "विश्व नेता अगले दशक के लिए कार्बन उत्सर्जन और नवीकरणीय ऊर्जा लक्ष्यों पर बाध्यकारी समझौते करने के लिए एकत्रित हुए।",
    time: "2 घंटे पहले",
    author: "सारा मिशेल",
    id: "default-hero"
  };
  return (
    <section className="news-part1">
      {/* Breaking ticker */}
      <div className="breaking-ticker">
        <span className="ticker-label">⚡ Breaking</span>
        <div className="ticker-wrap">
          <div className="ticker-text">
            पीएम ने नई स्वास्थ्य नीति की घोषणा की &bull; शेयर बाजार ने नया रिकॉर्ड बनाया &bull;
            भारत ने टेस्ट सीरीज 3-1 से जीती &bull; SpaceX स्टारशिप ने कक्षा पूरी की &bull;
            नई दिल्ली में G20 शिखर सम्मेलन शुरू &bull; इस साल मानसून जल्दी आया
          </div>
        </div>
      </div>

      {/* Featured grid */}
      <div className="featured-grid">
        {/* Hero */}
        <div className="hero-story" onClick={() => navigate(`/article/${displayHero.id}`)}>
          <img src={displayHero.img} alt={displayHero.title} />
          <div className="hero-overlay">
            <span className={`badge ${displayHero.badgeClass}`}>{displayHero.badge}</span>
            <h2>{displayHero.title}</h2>
            <p>{displayHero.desc}</p>
            <div className="hero-meta">🕐 {displayHero.time} &nbsp;|&nbsp; ✍️ {displayHero.author}</div>
          </div>
        </div>

        {/* Side cards */}
        <div className="side-stories">
          {sideStories.map((s, i) => (
            <div className="side-card" key={i} onClick={() => navigate(`/article/${s.id}`)}>
              <img src={s.img} alt={s.badge} />
              <div className="side-card-body">
                <span className={`badge ${s.badgeClass}`}>{s.badge}</span>
                <h4>{s.title}</h4>
                <p className="side-meta">🕐 {s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
