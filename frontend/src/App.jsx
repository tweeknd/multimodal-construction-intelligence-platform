import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AIVision from './components/AIVision';
import CrackAnalysis from './components/CrackAnalysis';
import SafetyMonitor from './components/SafetyMonitor';
import SensorAnalytics from './components/SensorAnalytics';
import DocIntelligence from './components/DocIntelligence';
import Planning from './components/Planning';
import Valuation from './components/Valuation';
import Assistant from './components/Assistant';
import Reports from './components/Reports';
import './App.css';

const NAV = [
  { group: 'Overview', items: [
    { path: '/', icon: '⊞', label: 'Dashboard' },
    { path: '/projects', icon: '📁', label: 'Projects', badge: '4' },
  ]},
  { group: 'AI Intelligence', items: [
    { path: '/safety', icon: '🛡️', label: 'Safety Analysis', badge: 'AI', badgeType: 'ai' },
    { path: '/crack', icon: '🔍', label: 'Crack Detection', badge: 'AI', badgeType: 'ai' },
    { path: '/vision', icon: '👁', label: 'AI Vision', badge: 'LIVE', badgeType: 'live' },
    { path: '/documents', icon: '📄', label: 'Doc Intelligence' },
    { path: '/sensors', icon: '📡', label: 'Sensor Analytics' },
  ]},
  { group: 'Planning', items: [
    { path: '/planning', icon: '📐', label: 'Project Planning', badge: 'AI', badgeType: 'ai' },
    { path: '/valuation', icon: '🏠', label: 'RE Valuation', badge: 'AI', badgeType: 'ai' },
    { path: '/reports', icon: '📊', label: 'Reports & Insights' },
  ]},
  { group: 'Assistant', items: [
    { path: '/assistant', icon: '🤖', label: 'Site Assistant', badge: 'AI', badgeType: 'ai' },
  ]},
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🏗️</div>
          {!collapsed && <span className="logo-text">ConstructIQ</span>}
        </div>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(group => (
          <div key={group.group} className="nav-group">
            {!collapsed && <span className="nav-label">{group.group}</span>}
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label-text">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className={`badge ${item.badgeType || ''}`}>{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <span className="user-name">John Dawson</span>
              <span className="user-role">Site Director</span>
            </div>
            <div className="status-dot"></div>
          </div>
        </div>
      )}
    </aside>
  );
}

function TopBar({ title }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <span>🔍</span>
          <input type="text" placeholder="Search..." />
        </div>
        <button className="icon-btn" title="Notifications">🔔</button>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

const PAGE_TITLES = {
  '/': 'Dashboard', '/projects': 'Projects', '/safety': 'Safety Analysis',
  '/crack': 'Crack Detection', '/vision': 'AI Vision Monitor',
  '/documents': 'Document Intelligence', '/sensors': 'Sensor Analytics',
  '/planning': 'Project Planning', '/valuation': 'Real Estate Valuation',
  '/reports': 'Reports & Insights', '/assistant': 'Site Assistant',
};

function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'ConstructIQ';

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <TopBar title={title} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/safety" element={<SafetyMonitor />} />
            <Route path="/crack" element={<CrackAnalysis />} />
            <Route path="/vision" element={<AIVision />} />
            <Route path="/documents" element={<DocIntelligence />} />
            <Route path="/sensors" element={<SensorAnalytics />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/valuation" element={<Valuation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
