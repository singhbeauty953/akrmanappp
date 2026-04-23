import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OTPVerifyPage.css';

export default function OTPVerifyPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();

  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate('/login');
      return;
    }

    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, phone, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(phone, otp);
      if (response.ok) {
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setOtp('');
    setTimer(300);
    navigate('/login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!phone) return null;

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h1>Verify OTP</h1>
        <p className="phone-display">Sent to: +91{phone}</p>
        
        <form onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <label>Enter 6-digit OTP</label>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading}
              maxLength="6"
              className="otp-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="timer">
            OTP expires in: <strong>{formatTime(timer)}</strong>
          </div>

          <button type="submit" disabled={loading || timer === 0} className="submit-btn">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <button 
          onClick={handleResendOtp}
          disabled={timer > 0 || loading}
          className="resend-btn"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
