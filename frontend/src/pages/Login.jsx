import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser?.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/student/dashboard';
      }
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-blob blob-1"></div>
        <div className="auth-blob blob-2"></div>
      </div>

      <div className="auth-content">
        <div className="auth-left">
          <div className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/hirebee.png" alt="Hirbee Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            Hirbee
          </div>

          <div className="auth-header">
            <h1 className="heading-xl">Welcome back</h1>
            <p className="text-body" style={{ marginTop: '0.5rem' }}>
              Enter your credentials to access your account.
            </p>
          </div>

          <div className="auth-form-container">
            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="input-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-link">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-quote-container">
            <h2 className="auth-quote">"Gathering the best opportunities and helping you land sweet job offers."</h2>
            <p className="auth-author">Hirbee Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
