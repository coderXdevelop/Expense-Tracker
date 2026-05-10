import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../service/Api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await verifyOtp(email, otp);
      console.log("OTP verified:", response);
      navigate('/login'); // redirect to login
    } catch (err) {
      console.error("OTP verification error:", err);
      setError('Invalid or expired OTP. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h1 className="auth-title">Verify Email</h1>
        <p className="auth-subtitle">Enter the OTP sent to {email}</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">OTP</label>
            <input
              type="text"
              className="form-input"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
