import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/application/my-applications');
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch(status?.toUpperCase()) {
      case 'SELECTED':
        return <CheckCircle size={18} style={{ color: 'var(--status-success)' }} />;
      case 'REJECTED':
        return <XCircle size={18} style={{ color: 'var(--status-danger)' }} />;
      default:
        return <Clock size={18} style={{ color: 'var(--status-info)' }} />;
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toUpperCase()) {
      case 'SELECTED':
        return { background: 'var(--status-success-bg)', color: 'var(--status-success)' };
      case 'REJECTED':
        return { background: 'var(--status-danger-bg)', color: 'var(--status-danger)' };
      default:
        return { background: 'var(--status-info-bg)', color: 'var(--status-info)' };
    }
  };

  if (loading) return <div className="spinner dark" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">My Applications</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            Track the status of your placement applications.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {applications.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 className="heading-md">No Applications Yet</h3>
            <p className="text-body">You haven't applied to any companies yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Company</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Applied On</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-base)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>
                    {app.company?.companyName || 'Unknown Company'}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>
                    {app.company?.role || 'N/A'}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: 'var(--radius-xl)', 
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      ...getStatusStyle(app.status)
                    }}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
