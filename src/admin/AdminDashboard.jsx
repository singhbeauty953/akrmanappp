import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getArticles, saveArticle, deleteArticle, SECTIONS, BADGES } from "../data/store";
import "./AdminDashboard.css";

const EMPTY_FORM = {
  id: null, title: "", badge: "badge-red", badgeLabel: "",
  section: "section1", desc: "", content: "", author: "",
  img: "", time: "", featured: false,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tab, setTab] = useState("list"); // list | write
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const imgInputRef = useRef();

  useEffect(() => {
    if (!sessionStorage.getItem("admin_auth")) navigate("/admin");
    setArticles(getArticles());
  }, [navigate]);

  function refresh() { setArticles(getArticles()); }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleImageFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, img: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return showToast("❌ शीर्षक आवश्यक है।");
    const badge = BADGES.find(b => b.value === form.badge);
    saveArticle({ ...form, badgeLabel: badge?.label || "", time: form.time || "अभी" });
    showToast("✅ समाचार सफलतापूर्वक सहेजा गया!");
    setForm(EMPTY_FORM);
    setTab("list");
    refresh();
  }

  function handleEdit(article) {
    setForm(article);
    setTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    deleteArticle(id);
    setDeleteConfirm(null);
    showToast("🗑️ समाचार हटाया गया।");
    refresh();
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    navigate("/admin");
  }

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.desc || "").toLowerCase().includes(search.toLowerCase())
  );

  const sectionLabel = v => SECTIONS.find(s => s.value === v)?.label || v;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">📰 <span>NewsPulse</span></div>
        <p className="sidebar-sub">एडमिन पैनल</p>
        <nav className="sidebar-nav">
          <button className={tab === "list"  ? "active" : ""} onClick={() => setTab("list")}>
            📋 सभी समाचार
          </button>
          <button className={tab === "write" ? "active" : ""} onClick={() => { setForm(EMPTY_FORM); setTab("write"); }}>
            ✏️ नया समाचार लिखें
          </button>
        </nav>
        <div className="sidebar-stats">
          <div className="stat-box">
            <span>{articles.length}</span>
            <p>कुल समाचार</p>
          </div>
          <div className="stat-box">
            <span>{articles.filter(a => a.section === "hero").length}</span>
            <p>हीरो स्टोरी</p>
          </div>
        </div>
        <div className="sidebar-bottom">
          <a href="/" target="_blank" className="view-site-btn">🌐 साइट देखें</a>
          <button className="logout-btn" onClick={handleLogout}>🚪 लॉगआउट</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {toast && <div className="toast">{toast}</div>}

        {/* ── LIST TAB ── */}
        {tab === "list" && (
          <div>
            <div className="admin-header">
              <h1>📋 सभी समाचार</h1>
              <input
                className="search-bar"
                placeholder="समाचार खोजें…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <p>🗞️ कोई समाचार नहीं मिला।</p>
                <button onClick={() => setTab("write")}>+ नया समाचार जोड़ें</button>
              </div>
            ) : (
              <div className="article-list">
                {filtered.map(a => (
                  <div className="article-row" key={a.id}>
                    {a.img && <img src={a.img} alt="" className="row-thumb" />}
                    {!a.img && <div className="row-thumb placeholder">📰</div>}
                    <div className="row-body">
                      <span className={`badge ${a.badge}`}>{a.badge.replace("badge-","")}</span>
                      <h4>{a.title}</h4>
                      <p className="row-meta">
                        🗂️ {sectionLabel(a.section)} &nbsp;|&nbsp;
                        🕐 {a.time || "—"} &nbsp;|&nbsp;
                        {a.author && <>✍️ {a.author}</>}
                      </p>
                    </div>
                    <div className="row-actions">
                      <button className="btn-preview" onClick={() => setPreview(a)}>👁 देखें</button>
                      <button className="btn-edit"    onClick={() => handleEdit(a)}>✏️ संपादित</button>
                      <button className="btn-delete"  onClick={() => setDeleteConfirm(a.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── WRITE TAB ── */}
        {tab === "write" && (
          <div>
            <div className="admin-header">
              <h1>{form.id ? "✏️ समाचार संपादित करें" : "✏️ नया समाचार लिखें"}</h1>
            </div>
            <form className="article-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Title */}
                <div className="form-group full">
                  <label>शीर्षक <span className="req">*</span></label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="समाचार का शीर्षक हिंदी में लिखें…" />
                </div>

                {/* Section + Badge */}
                <div className="form-group">
                  <label>सेक्शन</label>
                  <select name="section" value={form.section} onChange={handleChange}>
                    {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>बैज (श्रेणी)</label>
                  <select name="badge" value={form.badge} onChange={handleChange}>
                    {BADGES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>

                {/* Author + Time */}
                <div className="form-group">
                  <label>लेखक / पत्रकार</label>
                  <input name="author" value={form.author} onChange={handleChange}
                    placeholder="जैसे: अनीता शर्मा" />
                </div>
                <div className="form-group">
                  <label>समय</label>
                  <input name="time" value={form.time} onChange={handleChange}
                    placeholder="जैसे: 2 घंटे पहले" />
                </div>

                {/* Short description */}
                <div className="form-group full">
                  <label>संक्षिप्त विवरण</label>
                  <textarea name="desc" value={form.desc} onChange={handleChange} rows={3}
                    placeholder="कार्ड पर दिखने वाला छोटा विवरण…" />
                </div>

                {/* Full content */}
                <div className="form-group full">
                  <label>पूरा लेख / समाचार</label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows={10}
                    placeholder="यहाँ पूरा समाचार या लेख लिखें…" />
                </div>

                {/* Image */}
                <div className="form-group full">
                  <label>छवि</label>
                  <div className="img-row">
                    <div className="img-upload-box" onClick={() => imgInputRef.current.click()}>
                      {form.img
                        ? <img src={form.img} alt="preview" />
                        : <span>📁 क्लिक करके छवि अपलोड करें</span>
                      }
                      <input ref={imgInputRef} type="file" accept="image/*"
                        onChange={handleImageFile} style={{ display: "none" }} />
                    </div>
                    <div className="img-url-box">
                      <p>— या URL दर्ज करें —</p>
                      <input name="img" value={form.img.startsWith("data:") ? "" : form.img}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="form-group full">
                  <label className="toggle-label">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                    <span>⭐ मुख्य/फीचर्ड समाचार के रूप में दिखाएं</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel"
                  onClick={() => { setForm(EMPTY_FORM); setTab("list"); }}>
                  रद्द करें
                </button>
                <button type="submit" className="btn-save">
                  {form.id ? "✅ अपडेट करें" : "✅ प्रकाशित करें"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPreview(null)}>✕</button>
            {preview.img && <img src={preview.img} alt="" className="modal-img" />}
            <div className="modal-body">
              <span className={`badge ${preview.badge}`}>{preview.badge.replace("badge-","")}</span>
              <h2>{preview.title}</h2>
              <p className="modal-meta">
                {preview.author && <>✍️ {preview.author} &nbsp;|&nbsp;</>}
                🕐 {preview.time} &nbsp;|&nbsp;
                🗂️ {sectionLabel(preview.section)}
              </p>
              {preview.desc && <p className="modal-desc">{preview.desc}</p>}
              {preview.content && <div className="modal-content">{preview.content}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-card" onClick={e => e.stopPropagation()}>
            <h3>🗑️ समाचार हटाएं?</h3>
            <p>क्या आप वाकई इस समाचार को स्थायी रूप से हटाना चाहते हैं?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>रद्द करें</button>
              <button className="btn-delete-confirm" onClick={() => handleDelete(deleteConfirm)}>हाँ, हटाएं</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
