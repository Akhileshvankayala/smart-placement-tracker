import React, { useEffect, useState } from 'react';
import { Building, Plus, X, Search, CheckCircle, XCircle, Users } from 'lucide-react';
import api from '../utils/api';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    role: '',
    packageOffered: '',
    minCGPA: '',
    allowedBranches: '',
    allowedBacklogs: '',
    deadline: ''
  });

  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/company');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newCompany,
        allowedBranches: newCompany.allowedBranches.split(',').map(b => b.trim())
      };
      await api.post('/company/add', payload);
      setShowAddModal(false);
      setNewCompany({ companyName: '', role: '', packageOffered: '', minCGPA: '', allowedBranches: '', allowedBacklogs: '', deadline: '' });
      fetchCompanies();
    } catch (error) {
      console.error("Failed to add company", error);
      alert(error.response?.data?.message || 'Failed to add company');
    }
  };

  const handleCloseApplications = async (id) => {
    if (window.confirm("Are you sure you want to close applications for this company? Students will no longer be able to apply.")) {
      try {
        await api.patch(`/company/close/${id}`);
        setCompanies(companies.map(c => c._id === id ? { ...c, isOpen: false } : c));
      } catch (error) {
        console.error("Failed to close applications", error);
        alert(error.response?.data?.message || 'Failed to close company');
      }
    }
  };

  const handleReopenApplications = async (id) => {
    if (window.confirm("Are you sure you want to reopen applications for this company? It will become visible to students again.")) {
      try {
        await api.patch(`/company/reopen/${id}`);
        setCompanies(companies.map(c => c._id === id ? { ...c, isOpen: true } : c));
      } catch (error) {
        console.error("Failed to reopen applications", error);
        alert(error.response?.data?.message || 'Failed to reopen company. Did you restart the server?');
      }
    }
  };

  const handleViewApplicants = async (companyId) => {
    setSelectedCompanyId(companyId);
    setShowApplicantsModal(true);
    setLoadingApplicants(true);
    try {
      const response = await api.get(`/application/company/${companyId}`);
      setApplicants(response.data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applicants", error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/application/status/${applicationId}`, { status: newStatus });
      // Update local state
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      alert('Failed to update application status');
    }
  };

  if (loading) return <div className="spinner dark" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Company Management</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            Manage recruiting companies and their eligibility criteria.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Company
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input-field" placeholder="Search companies..." style={{ paddingLeft: '2.5rem' }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Company</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role & Package</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Criteria</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-base)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                      <Building size={20} />
                    </div>
                    <span style={{ fontWeight: 500 }}>{company.companyName}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{company.role}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{company.packageOffered} LPA</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    CGPA &gt;= {company.minCGPA} | Backlogs &lt;= {company.allowedBacklogs}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  {company.isOpen ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                      <CheckCircle size={14} /> Active
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)', fontSize: '0.75rem', fontWeight: 500, background: 'var(--status-danger-bg)', color: 'var(--status-danger)' }}>
                      <XCircle size={14} /> Closed
                    </div>
                  )}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="btn-ghost" style={{ padding: '0.5rem', color: 'var(--status-info)' }} onClick={() => handleViewApplicants(company._id)} title="View Applicants">
                    <Users size={18} />
                  </button>
                  {company.isOpen ? (
                    <button className="btn-ghost" style={{ padding: '0.5rem', color: 'var(--status-warning)' }} onClick={() => handleCloseApplications(company._id)} title="Close Applications">
                      <XCircle size={18} />
                    </button>
                  ) : (
                    <button className="btn-ghost" style={{ padding: '0.5rem', color: 'var(--status-success)' }} onClick={() => handleReopenApplications(company._id)} title="Reopen Applications">
                      <CheckCircle size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative' }}>
            <button className="btn-ghost" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem' }} onClick={() => setShowAddModal(false)}>
              <X size={20} />
            </button>
            <h2 className="heading-lg" style={{ marginBottom: '2rem' }}>Add New Company</h2>
            <form onSubmit={handleAddCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Company Name</label>
                  <input type="text" className="input-field" required value={newCompany.companyName} onChange={e => setNewCompany({...newCompany, companyName: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Role</label>
                  <input type="text" className="input-field" required value={newCompany.role} onChange={e => setNewCompany({...newCompany, role: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Package (LPA)</label>
                  <input type="number" step="0.1" className="input-field" required value={newCompany.packageOffered} onChange={e => setNewCompany({...newCompany, packageOffered: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Deadline</label>
                  <input type="date" className="input-field" required value={newCompany.deadline} onChange={e => setNewCompany({...newCompany, deadline: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Min CGPA</label>
                  <input type="number" step="0.1" className="input-field" required value={newCompany.minCGPA} onChange={e => setNewCompany({...newCompany, minCGPA: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Max Backlogs</label>
                  <input type="number" className="input-field" required value={newCompany.allowedBacklogs} onChange={e => setNewCompany({...newCompany, allowedBacklogs: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="input-label">Allowed Branches (comma separated)</label>
                <input type="text" className="input-field" placeholder="CSE, ECE, ISE" required value={newCompany.allowedBranches} onChange={e => setNewCompany({...newCompany, allowedBranches: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Submit Company</button>
            </form>
          </div>
        </div>
      )}

      {showApplicantsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="btn-ghost" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem' }} onClick={() => setShowApplicantsModal(false)}>
              <X size={20} />
            </button>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>Applicants</h2>
            
            {loadingApplicants ? (
              <div className="spinner dark" style={{ margin: '2rem auto' }}></div>
            ) : applicants.length === 0 ? (
              <p className="text-body" style={{ textAlign: 'center', padding: '2rem' }}>No applicants yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Student Name</th>
                    <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Branch & CGPA</th>
                    <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{app.student?.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {app.student?.branch} | {app.student?.cgpa} CGPA
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: 'var(--radius-sm)', 
                          fontSize: '0.75rem', 
                          background: 'var(--status-info-bg)', 
                          color: 'var(--status-info)', 
                          fontWeight: 500 
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
