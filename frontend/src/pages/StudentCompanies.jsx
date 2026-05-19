import React, { useEffect, useState } from 'react';
import { Building, MapPin, IndianRupee, Calendar, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const StudentCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    const fetchEligibleCompanies = async () => {
      try {
        const response = await api.get('/company/eligible');
        setCompanies(response.data.companies || []);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEligibleCompanies();
  }, []);

  const handleApply = async (companyId) => {
    try {
      setApplying(companyId);
      await api.post(`/application/apply/${companyId}`);
      // Refresh list or update local state
      setCompanies(companies.map(c => 
        c._id === companyId ? { ...c, hasApplied: true } : c
      ));
    } catch (error) {
      console.error("Failed to apply", error);
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <div className="spinner dark" style={{ margin: 'auto' }}></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Eligible Companies</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            Opportunities specifically matched to your academic profile.
          </p>
        </div>
      </div>

      <div className="company-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {companies.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <Building size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 className="heading-md">No Companies Found</h3>
            <p className="text-body">Currently, there are no eligible companies based on your profile.</p>
          </div>
        ) : (
          companies.map(company => (
            <div key={company._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 className="heading-md" style={{ marginBottom: '0.25rem' }}>{company.companyName}</h3>
                  <p className="text-sm" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{company.role}</p>
                </div>
                <div style={{ padding: '0.5rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-sm)' }}>
                  <Building size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <IndianRupee size={16} />
                  <span className="text-sm">{company.packageOffered} LPA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} />
                  <span className="text-sm">Deadline: {new Date(company.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                {!company.isOpen ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--status-danger)', padding: '0.75rem', background: 'var(--status-danger-bg)', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                    <XCircle size={18} />
                    Closed
                  </div>
                ) : company.hasApplied ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--status-success)', padding: '0.75rem', background: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                    <CheckCircle size={18} />
                    Applied
                  </div>
                ) : (
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%' }}
                    onClick={() => handleApply(company._id)}
                    disabled={applying === company._id}
                  >
                    {applying === company._id ? <span className="spinner"></span> : 'Apply Now'}
                    {!applying && <ArrowRight size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentCompanies;
