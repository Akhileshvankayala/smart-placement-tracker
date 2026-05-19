import React, { useEffect, useState } from 'react';
import { Search, Filter, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'cgpa-desc', 'cgpa-asc', 'deadline-asc', 'deadline-desc'

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/application/all');
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/application/status/${applicationId}`, { status: newStatus });
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      alert('Failed to update application status');
    }
  };

  const getStatusStyle = (status) => {
    switch(status?.toUpperCase()) {
      case 'SELECTED': return { bg: 'var(--status-success-bg)', color: 'var(--status-success)' };
      case 'REJECTED': return { bg: 'var(--status-danger-bg)', color: 'var(--status-danger)' };
      default: return { bg: 'var(--status-info-bg)', color: 'var(--status-info)' };
    }
  };

  const getFilteredAndSortedApps = () => {
    let filtered = applications.filter(app => {
      const studentName = app.student?.name?.toLowerCase() || '';
      const compName = app.company?.companyName?.toLowerCase() || '';
      const matchesSearch = studentName.includes(searchTerm.toLowerCase()) || compName.includes(searchTerm.toLowerCase());
      const matchesCompany = companyFilter ? compName === companyFilter.toLowerCase() : true;
      return matchesSearch && matchesCompany;
    });

    if (sortBy === 'cgpa-desc') {
      filtered.sort((a, b) => (b.student?.cgpa || 0) - (a.student?.cgpa || 0));
    } else if (sortBy === 'cgpa-asc') {
      filtered.sort((a, b) => (a.student?.cgpa || 0) - (b.student?.cgpa || 0));
    } else if (sortBy === 'deadline-asc') {
      filtered.sort((a, b) => new Date(a.company?.deadline || 0) - new Date(b.company?.deadline || 0));
    } else if (sortBy === 'deadline-desc') {
      filtered.sort((a, b) => new Date(b.company?.deadline || 0) - new Date(a.company?.deadline || 0));
    }

    return filtered;
  };

  // Get unique companies for the filter dropdown
  const uniqueCompanies = [...new Set(applications.map(app => app.company?.companyName))].filter(Boolean);
  const processedApps = getFilteredAndSortedApps();

  if (loading) return <div className="spinner dark" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">All Applications</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            View and manage all student applications across companies.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by student or company..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flex: '1 1 auto' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <select className="input-field" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
                <option value="">All Companies</option>
                {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: '150px' }}>
              <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="">Sort By...</option>
                <option value="cgpa-desc">CGPA (High to Low)</option>
                <option value="cgpa-asc">CGPA (Low to High)</option>
                <option value="deadline-asc">Deadline (Soonest)</option>
                <option value="deadline-desc">Deadline (Latest)</option>
              </select>
            </div>
          </div>
          
        </div>

        {processedApps.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <FileText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 className="heading-md">No Applications Found</h3>
            <p className="text-body">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Student</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>CGPA</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Company</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {processedApps.map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{app.student?.name}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.student?.branch}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)' }}>
                      {app.student?.cgpa}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{app.company?.companyName}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Deadline: {new Date(app.company?.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.375rem 0.75rem', 
                        borderRadius: 'var(--radius-xl)', 
                        fontSize: '0.75rem', 
                        background: getStatusStyle(app.status).bg, 
                        color: getStatusStyle(app.status).color, 
                        fontWeight: 500 
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <select 
                        className="input-field" 
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="ROUND1">Round 1</option>
                        <option value="ROUND2">Round 2</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
