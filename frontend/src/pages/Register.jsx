import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // default
    branch: '',
    cgpa: '',
    backlogs: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const dataToSubmit = { ...formData };
    if (dataToSubmit.role === 'admin') {
      delete dataToSubmit.branch;
      delete dataToSubmit.cgpa;
      delete dataToSubmit.backlogs;
    }

    const res = await register(dataToSubmit);
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
            <h1 className="heading-xl">Create Account</h1>
            <p className="text-body" style={{ marginTop: '0.5rem' }}>
              Join the platform to kickstart your journey.<br></br>you can create account for admin(just to test out admin features).
            </p>
          </div>

          <div className="auth-form-container" style={{ padding: '2rem 3rem' }}>
            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group" style={{ flexDirection: 'row', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label" htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    className="input-field"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input-field"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.role === 'student' && (
                <div className="form-group" style={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '100px' }}>
                    <label className="input-label" htmlFor="branch">Branch</label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      className="input-field"
                      placeholder="CSE, ECE..."
                      value={formData.branch}
                      onChange={handleChange}
                      required={formData.role === 'student'}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '100px' }}>
                    <label className="input-label" htmlFor="cgpa">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      id="cgpa"
                      name="cgpa"
                      className="input-field"
                      placeholder="8.5"
                      value={formData.cgpa}
                      onChange={handleChange}
                      required={formData.role === 'student'}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '100px' }}>
                    <label className="input-label" htmlFor="backlogs">Backlogs</label>
                    <input
                      type="number"
                      id="backlogs"
                      name="backlogs"
                      className="input-field"
                      placeholder="0"
                      value={formData.backlogs}
                      onChange={handleChange}
                      required={formData.role === 'student'}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                {loading ? <span className="spinner"></span> : 'Sign Up'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-quote-container">
            <h2 className="auth-quote">"Work together like a hive to secure your dream placement."</h2>
            <p className="auth-author">Hirbee Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
