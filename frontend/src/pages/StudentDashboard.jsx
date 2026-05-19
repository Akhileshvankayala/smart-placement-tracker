import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Building, FileText, Activity, Clock, XCircle, CheckCircle, X } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    eligibleCompanies: 0,
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    offersReceived: 0
  });
  const [loading, setLoading] = useState(true);
  const [showOffersModal, setShowOffersModal] = useState(false);

  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, compRes] = await Promise.all([
          api.get('/application/my-applications'),
          api.get('/company/eligible')
        ]);
        
        const fetchedApps = appsRes.data.applications || [];
        const fetchedComps = compRes.data.companies || [];
        
        setApplications(fetchedApps);
        setCompanies(fetchedComps);
        
        setStats({
          eligibleCompanies: fetchedComps.length,
          applicationsSubmitted: fetchedApps.length,
          interviewsScheduled: fetchedApps.filter(a => ['ROUND1', 'ROUND2'].includes(a.status)).length,
          offersReceived: fetchedApps.filter(a => a.status === 'SELECTED').length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="spinner dark" style={{ margin: 'auto' }}></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Student Portal</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            Welcome back, {user?.name}. Here is your placement summary.
          </p>
        </div>
        <Link to="/student/profile" className="btn-primary" style={{ textDecoration: 'none' }}>
          Upload Resume
        </Link>
      </div>

      <div className="dashboard-stats">
        <Link to="/student/companies" className="stat-card glass-panel" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-header">
            <span className="stat-title">Eligible Companies</span>
            <div className="stat-icon"><Building size={20} /></div>
          </div>
          <div className="stat-value">{stats.eligibleCompanies}</div>
        </Link>

        <Link to="/student/applications" className="stat-card glass-panel" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-header">
            <span className="stat-title">Applications</span>
            <div className="stat-icon"><FileText size={20} /></div>
          </div>
          <div className="stat-value">{stats.applicationsSubmitted}</div>
        </Link>

        <div 
          className="stat-card glass-panel" 
          style={{ cursor: 'pointer' }}
          onClick={() => setShowOffersModal(true)}
        >
          <div className="stat-header">
            <span className="stat-title">Offers</span>
            <div className="stat-icon"><CheckCircle size={20} /></div>
          </div>
          <div className="stat-value">{stats.offersReceived}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">Your Application Timeline</h3>
          </div>
          <div className="activity-list">
            {applications.length === 0 ? (
              <p className="text-body">You have no active applications.</p>
            ) : (
              applications.slice(0, 5).map(app => (
                <div key={app._id} className="activity-item">
                  <div className="activity-icon" style={{ 
                    background: app.status === 'SELECTED' ? 'var(--status-success-bg)' : app.status === 'REJECTED' ? 'var(--status-danger-bg)' : 'var(--status-info-bg)', 
                    color: app.status === 'SELECTED' ? 'var(--status-success)' : app.status === 'REJECTED' ? 'var(--status-danger)' : 'var(--status-info)' 
                  }}>
                    {app.status === 'SELECTED' ? <CheckCircle size={16} /> : app.status === 'REJECTED' ? <XCircle size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text"><strong>{app.company?.companyName}</strong> - {app.status}</p>
                    <span className="activity-time">Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">Upcoming Deadlines</h3>
          </div>
          <div className="activity-list">
            {companies.filter(c => c.isOpen).length === 0 ? (
              <p className="text-body">No upcoming deadlines.</p>
            ) : (
              companies
                .filter(c => c.isOpen)
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5)
                .map(comp => {
                  const daysLeft = Math.ceil((new Date(comp.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={comp._id} className="activity-item">
                      <div className="activity-content">
                        <p className="activity-text" style={{ fontWeight: 500 }}>{comp.companyName} - {comp.role}</p>
                        <span className="activity-time" style={{ color: daysLeft <= 3 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                          {daysLeft < 0 ? 'Closed' : `Closes in ${daysLeft} days`}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Offers Modal */}
      {showOffersModal && (
        <div className="modal-overlay" onClick={() => setShowOffersModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="heading-md">Your Offers</h3>
              <button className="modal-close" onClick={() => setShowOffersModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="activity-list">
              {applications.filter(app => app.status === 'SELECTED').length === 0 ? (
                <p className="text-body text-center" style={{ padding: '2rem 0' }}>
                  You don't have any offers yet. Keep applying!
                </p>
              ) : (
                applications
                  .filter(app => app.status === 'SELECTED')
                  .map(app => (
                    <div key={app._id} className="activity-item" style={{ padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                      <div className="activity-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                        <CheckCircle size={20} />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text" style={{ fontSize: '1rem', fontWeight: '600' }}>{app.company?.companyName}</p>
                        <p className="text-sm" style={{ marginTop: '0.25rem' }}>Role: <span style={{ color: 'var(--text-primary)' }}>{app.company?.role}</span></p>
                        <p className="text-sm">Package: <span style={{ color: 'var(--text-primary)' }}>₹{app.company?.packageOffered} LPA</span></p>
                        <span className="activity-time" style={{ display: 'block', marginTop: '0.5rem' }}>Offered on {new Date(app.updatedAt || app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
