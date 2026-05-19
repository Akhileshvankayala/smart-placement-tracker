import React, { useState, useEffect } from 'react';
import { Users, UploadCloud, CheckCircle, AlertCircle, Search, Trash2, Ban, FileText } from 'lucide-react';
import api from '../utils/api';

const AdminStudents = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/admin/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', message: response.data.message || 'Students uploaded successfully!' });
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Upload failed", error);
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to upload students' });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleToggleBlock = async (id, isCurrentlyBlocked) => {
    const currentlyBlocked = Boolean(isCurrentlyBlocked);
    const action = currentlyBlocked ? "unblock" : "block";
    if (window.confirm(`Are you sure you want to ${action} this student?`)) {
      try {
        await api.patch(`/admin/students/${id}/block`);
        setStudents(students.map(s => s._id === id ? { ...s, isBlocked: !currentlyBlocked } : s));
      } catch (error) {
        console.error(`Failed to ${action} student`, error);
        alert(error.response?.data?.message || `Failed to ${action} student`);
      }
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you absolutely sure you want to delete this student? This action cannot be undone.")) {
      try {
        await api.delete(`/admin/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
      } catch (error) {
        console.error("Failed to delete student", error);
        alert(error.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Student Management</h1>
          <p className="text-body" style={{ marginTop: '0.25rem' }}>
            View registered students and upload in bulk via CSV.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Bulk Upload Panel */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Bulk Upload Students</h3>
          <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', background: 'var(--bg-base)' }}>
            <UploadCloud size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h4 className="heading-md" style={{ marginBottom: '0.5rem' }}>Upload CSV File</h4>
            <p className="text-sm" style={{ marginBottom: '1.5rem' }}>The file should contain name, email, password, branch, etc.</p>
            
            <input 
              type="file" 
              id="csv" 
              accept=".csv" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            
            {!file ? (
              <label htmlFor="csv" className="btn-secondary" style={{ cursor: 'pointer' }}>
                Select File
              </label>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <span className="text-sm" style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>{file.name}</span>
                <button 
                  className="btn-primary" 
                  onClick={handleBulkUpload}
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

        {/* Students List */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search students by name, email, or branch..." 
                style={{ paddingLeft: '2.5rem' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner dark"></span></div>
            ) : students.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</div>
            ) : (() => {
                const filteredStudents = students.filter(s => 
                  s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  s.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  s.branch?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                
                return filteredStudents.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No matches for "{searchTerm}".</div>
                ) : (
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                          <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Student</th>
                          <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Branch</th>
                          <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>CGPA</th>
                          <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Resume</th>
                          <th style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student._id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-base)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 600 }}>
                                  {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 500 }}>{student.name}</span>
                                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{student.email}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>
                              {student.branch || 'N/A'}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>
                              {student.cgpa || 0}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                              {student.resumeUrl ? (
                                <a 
                                  href={student.resumeUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}
                                >
                                  <FileText size={16} /> View
                                </a>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>N/A</span>
                              )}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <button 
                                className="btn-ghost" 
                                style={{ padding: '0.5rem', color: student.isBlocked ? 'var(--status-danger)' : 'var(--status-success)' }} 
                                onClick={() => handleToggleBlock(student._id, student.isBlocked)} 
                                title={student.isBlocked ? "Unblock Student" : "Block Student"}
                              >
                                {student.isBlocked ? <Ban size={18} /> : <CheckCircle size={18} />}
                              </button>
                              <button 
                                className="btn-ghost" 
                                style={{ padding: '0.5rem', color: 'var(--status-danger)' }} 
                                onClick={() => handleDeleteStudent(student._id)} 
                                title="Delete Student"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
            })()}
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
