import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SubscriptionPage.css';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();

  useEffect(() => {
    fetchPlans();
    loadRazorpayScript();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscription/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setMessage('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const handleSubscribe = async (planId) => {
    setProcessing(planId);
    setMessage('');

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch('http://localhost:5000/api/subscription/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planId })
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        setMessage(error.error || 'Failed to create order');
        setProcessing(null);
        return;
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay payment modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        handler: async (response) => {
          await handlePaymentSuccess(response, planId);
        },
        prefill: {
          contact: '',
          email: ''
        },
        theme: {
          color: '#d4af37'
        },
        modal: {
          ondismiss: () => {
            setMessage('Payment cancelled');
            setProcessing(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error initiating payment');
      setProcessing(null);
    }
  };

  const handlePaymentSuccess = async (paymentResponse, planId) => {
    try {
      // Step 3: Verify payment on backend
      const verifyResponse = await fetch('http://localhost:5000/api/subscription/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planId,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature
        })
      });

      if (verifyResponse.ok) {
        setMessage('✓ Payment successful! Your subscription is now active.');
        await refreshUser();
        setTimeout(() => navigate('/'), 2000);
      } else {
        const error = await verifyResponse.json();
        setMessage(error.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Payment verification failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div className="sub-container"><p>Loading plans...</p></div>;
  }

  return (
    <div className="sub-container">
      <div className="sub-header">
        <h1>Choose Your Plan</h1>
        <p>Unlimited access to premium news content</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="plans-grid">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`plan-card ${plan.id === 'premium' ? 'featured' : ''}`}
          >
            <h3>{plan.name}</h3>
            <div className="price">₹{plan.price}</div>
            <p className="duration">{plan.duration} days access</p>

            <ul className="features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={processing === plan.id}
              className="subscribe-btn"
            >
              {processing === plan.id ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="payment-info">
        <p>💳 Secure payment powered by Razorpay</p>
      </div>
    </div>
  );
}
