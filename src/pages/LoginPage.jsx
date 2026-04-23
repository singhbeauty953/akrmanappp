import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOtp } = useAuth();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtp(phone);
      if (response.ok) {
        navigate('/verify-otp', { state: { phone } });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📰 NEWS APP</h1>
        <h2>Login with OTP</h2>
        
        <form onSubmit={handleSendOtp}>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={loading}
              maxLength="10"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="info-text">
          We'll send a 6-digit OTP to verify your number
        </p>
      </div>
    </div>
  );
}
