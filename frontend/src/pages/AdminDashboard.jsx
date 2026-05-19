import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, CheckCircle, ArrowUpRight, BarChart } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    selectedStudents: 0,
    companyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setDownloading(true);
      const response = await api.get('/admin/report', { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Placement_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Failed to generate report");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats'); // Adjust endpoint if needed
        if (response.data && response.data.stats) {
          setStats(response.data.stats);
        } else if (response.data) {
           // fallback if it's just raw object
           setStats({
            totalStudents: response.data.totalStudents || 0,
            totalCompanies: response.data.totalCompanies || 0,
            totalApplications: response.data.totalApplications || 0,
            selectedStudents: response.data.selectedStudents || 0
           });
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="spinner dark" style={{ margin: 'auto' }}></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Overview</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            Welcome back, {user?.name}. Here's what's happening.
          </p>
        </div>
        <button className="btn-primary" onClick={handleGenerateReport} disabled={downloading}>
          {downloading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      <div className="dashboard-stats">
        <Link to="/admin/students" className="stat-card glass-panel" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="stat-header">
            <span className="stat-title">Total Students</span>
            <div className="stat-icon"><Users size={20} /></div>
          </div>
          <div className="stat-value">{stats.totalStudents}</div>
        </Link>

        <Link to="/admin/companies" className="stat-card glass-panel" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="stat-header">
            <span className="stat-title">Active Companies</span>
            <div className="stat-icon"><Briefcase size={20} /></div>
          </div>
          <div className="stat-value">{stats.totalCompanies}</div>
        </Link>

        <Link to="/admin/applications" className="stat-card glass-panel" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div className="stat-header">
            <span className="stat-title">Applications</span>
            <div className="stat-icon"><FileText size={20} /></div>
          </div>
          <div className="stat-value">{stats.totalApplications}</div>
        </Link>

        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-title">Placed Students</span>
            <div className="stat-icon"><CheckCircle size={20} /></div>
          </div>
          <div className="stat-value">{stats.selectedStudents}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">Company Insights</h3>
          </div>
          <div className="activity-list">
            {!stats.companyStats || stats.companyStats.length === 0 ? (
              <p className="text-body">No application data available yet.</p>
            ) : (
              stats.companyStats.map((cs, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon"><BarChart size={16} /></div>
                  <div className="activity-content">
                    <p className="activity-text"><strong>{cs.companyName}</strong></p>
                    <span className="activity-time">{cs.totalApplicants} Applicant{cs.totalApplicants !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3 className="panel-title">Quick Actions</h3>
          </div>
          <div className="activity-list" style={{ gap: '0.75rem' }}>
             <Link to="/admin/students" className="btn-secondary" style={{ justifyContent: 'flex-start', textDecoration: 'none' }}>Manage Students</Link>
             <Link to="/admin/companies" className="btn-secondary" style={{ justifyContent: 'flex-start', textDecoration: 'none' }}>Add New Company</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
