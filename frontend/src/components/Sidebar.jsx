import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  LogOut,
  Building,
  GraduationCap
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user?.role === 'admin' ? [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Companies', path: '/admin/companies', icon: <Building size={20} /> },
    { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
  ] : [
    { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Companies', path: '/student/companies', icon: <Briefcase size={20} /> },
    { name: 'Applications', path: '/student/applications', icon: <FileText size={20} /> },
    { name: 'Profile', path: '/student/profile', icon: <GraduationCap size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
          <img src="/hirebee.png" alt="Hirbee Logo" style={{ width: '84px', height: '84px', objectFit: 'contain', marginBottom: '-8px' }} />
          <h2 className="logo-text" style={{ marginBottom: '4px' }}>Hirbee</h2>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink 
                to={link.path} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout} title="Log Out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
