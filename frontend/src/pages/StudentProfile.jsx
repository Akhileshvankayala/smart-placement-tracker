import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { User, Mail, BookOpen, Hash, UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const StudentProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    branch: '',
    cgpa: '',
    backlogs: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/student/profile');
        if (response.data && response.data.student) {
          setProfile(response.data.student);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setProfileStatus({ type: '', message: '' });

    try {
      const payload = {
        name: profile.name,
        branch: profile.branch,
        cgpa: parseFloat(profile.cgpa),
        backlogs: parseInt(profile.backlogs)
      };
      const response = await api.put('/student/profile', payload);
      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      
      if (user) {
        const updatedUser = { ...user, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      setProfileStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus({ type: '', message: '' });
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus({ type: 'success', message: 'Resume uploaded successfully!' });
      
      // Update local storage and reload to reflect changes
      if (user) {
        const updatedUser = { ...user, resumeUrl: response.data.resumeUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      }
    } catch (error) {
      console.error("Upload failed", error);
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to upload resume' });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">My Profile</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            Manage your personal information and resume.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
          
          {loading ? (
            <div className="spinner dark" style={{ margin: '2rem auto' }}></div>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} htmlFor="name"><User size={16} /> Full Name</label>
                  <input type="text" id="name" name="name" className="input-field" value={profile.name || ''} onChange={handleProfileChange} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} htmlFor="email"><Mail size={16} /> Email Address</label>
                  <input type="email" id="email" className="input-field" value={profile.email || ''} disabled style={{ background: 'var(--bg-base)', cursor: 'not-allowed' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} htmlFor="branch"><BookOpen size={16} /> Branch</label>
                  <input type="text" id="branch" name="branch" className="input-field" value={profile.branch || ''} onChange={handleProfileChange} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} htmlFor="cgpa"><Hash size={16} /> CGPA</label>
                  <input type="number" step="0.01" id="cgpa" name="cgpa" className="input-field" value={profile.cgpa || ''} onChange={handleProfileChange} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} htmlFor="backlogs"><AlertCircle size={16} /> Backlogs</label>
                  <input type="number" id="backlogs" name="backlogs" className="input-field" value={profile.backlogs === 0 ? 0 : profile.backlogs || ''} onChange={handleProfileChange} required />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={updating} style={{ marginTop: '1.5rem' }}>
                {updating ? <span className="spinner"></span> : 'Update Profile'}
              </button>

              {profileStatus.message && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  ...(profileStatus.type === 'success' ? { background: 'var(--status-success-bg)', color: 'var(--status-success)' } : { background: 'var(--status-danger-bg)', color: 'var(--status-danger)' })
                }}>
                  {profileStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {profileStatus.message}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Resume Management</h3>
          
          {user?.resumeUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <File size={24} style={{ color: 'var(--accent-primary)' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500 }}>Current Resume</p>
                <a href={user.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--status-info)', fontSize: '0.875rem' }}>View PDF Document</a>
              </div>
            </div>
          )}

          <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', background: 'var(--bg-base)' }}>
            <UploadCloud size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h4 className="heading-md" style={{ marginBottom: '0.5rem' }}>Upload New Resume</h4>
            <p className="text-sm" style={{ marginBottom: '1.5rem' }}>PDF files only. Max size 5MB.</p>
            
            <input 
              type="file" 
              id="resume" 
              accept=".pdf" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            
            {!file ? (
              <label htmlFor="resume" className="btn-secondary" style={{ cursor: 'pointer' }}>
                Select File
              </label>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <span className="text-sm" style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>{file.name}</span>
                <button 
                  className="btn-primary" 
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? <span className="spinner"></span> : 'Confirm Upload'}
                </button>
              </div>
            )}

            {status.message && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-sm)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                ...(status.type === 'success' ? { background: 'var(--status-success-bg)', color: 'var(--status-success)' } : { background: 'var(--status-danger-bg)', color: 'var(--status-danger)' })
              }}>
                {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
