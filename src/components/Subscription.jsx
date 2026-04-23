import { useNavigate } from "react-router-dom";
import "./Subscription.css";

export default function Subscription() {
  const navigate = useNavigate();

  return (
    <section className="subscription-section" id="subscribe">
      <div className="sub-inner">
        <div className="sub-text">
          <h2>👑 प्रीमियम समाचार अनलॉक करें</h2>
          <p>गहन रिपोर्ट, एक्सक्लूसिव इंटरव्यू और विज्ञापन-मुक्त पढ़ाई का असीमित एक्सेस पाएं।</p>
          <ul className="sub-perks">
            <li>✅ विज्ञापन-मुक्त अनुभव</li>
            <li>✅ एक्सक्लूसिव खोजी रिपोर्ट</li>
            <li>✅ दैनिक न्यूज़लेटर</li>
            <li>✅ 10+ वर्षों का आर्काइव एक्सेस</li>
          </ul>
        </div>
        <div className="sub-plans">
          <div className="plan-card">
            <h3>मासिक</h3>
            <div className="plan-price">₹99<span>/माह</span></div>
            <button className="plan-btn plan-btn-dark" onClick={() => navigate('/subscription')}>शुरू करें</button>
          </div>
          <div className="plan-card featured-plan">
            <span className="best-value">सर्वोत्तम मूल्य</span>
            <h3>वार्षिक</h3>
            <div className="plan-price">₹799<span>/वर्ष</span></div>
            <button className="plan-btn plan-btn-dark" onClick={() => navigate('/subscription')}>अभी सदस्यता लें</button>
          </div>
        </div>
      </div>
    </section>
  );
}
