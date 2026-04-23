import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">आक्रमण<span>.com</span></span>
          <p>सच्ची खबरे, तेज़ रफ्तार<br />भारत की विश्वसनीय समाचार वेबसाइट।</p>
        </div>
        <div className="footer-links">
          <h5>विभाग</h5>
          <ul>
            {["भारत","विश्व","स्वास्थ्य","आयुर्वेद","खेल","तकनीक"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-links">
          <h5>कंपनी</h5>
          <ul>
            {["हमारे बारे में","करियर","विज्ञापन","गोपनीयता नीति","संपर्क करें"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-social">
          <h5>हमें फॉलो करें</h5>
          <div className="social-icons">
            {["Facebook","Twitter","Instagram","YouTube"].map(s => (
              <a key={s} href="#" title={s}>{s[0]}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Bharat.com. सर्वाधिकार सुरक्षित।</div>
    </footer>
  );
}
