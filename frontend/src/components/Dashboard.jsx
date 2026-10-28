const PROJECTS = [
  { name: 'Skyline Tower', location: 'Downtown, Mumbai', status: 'active', progress: 68, emoji: '🏙️', budget: '₹480 Cr', workers: 214, days: 142 },
  { name: 'Harbor Bridge', location: 'Coastal Road, Chennai', status: 'active', progress: 44, emoji: '🌉', budget: '₹320 Cr', workers: 98, days: 208 },
  { name: 'Green Quarter', location: 'Whitefield, Bengaluru', status: 'active', progress: 29, emoji: '🌿', budget: '₹210 Cr', workers: 66, days: 310 },
  { name: 'Metro Station Ext.', location: 'Andheri, Mumbai', status: 'planning', progress: 8, emoji: '🚇', budget: '₹90 Cr', workers: 12, days: null },
];

const KPIs = [
  { icon: '📁', label: 'Active Projects', val: '4', trend: '+2 this week', color: '#f59e0b' },
  { icon: '🛡️', label: 'Safety Score', val: '87%', trend: '↑ 8.3%', color: '#10b981' },
  { icon: '📄', label: 'Docs Processed', val: '248', trend: '+12 today', color: '#3b82f6' },
  { icon: '⚠', label: 'Active Alerts', val: '3', trend: '3 critical', color: '#ef4444' },
];

export default function Dashboard() {
  return (
    <div className="page-wrapper">
      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-tag">AI-Powered Platform</p>
          <h2>Construction Intelligence at <span className="gradient-text">Scale</span></h2>
          <p className="hero-sub">Real-time multimodal analysis — vision, documents, sensors and predictive insights in one place.</p>
          <div className="hero-actions">
            <a href="/safety" className="btn-primary">Run Safety Analysis</a>
            <a href="/crack" className="btn-ghost">Detect Cracks</a>
          </div>
        </div>
        <div className="hero-stats">
          {[['99.2%','Uptime'],['1,284','Events Today'],['94.7%','AI Accuracy']].map(([v,l]) => (
            <div key={l} className="hero-stat-card"><span className="hs-val">{v}</span><span className="hs-lbl">{l}</span></div>
          ))}
        </div>
      </div>

      <div className="kpi-grid">
        {KPIs.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon" style={{ color: k.color }}>{k.icon}</div>
              <span className={`kpi-trend ${k.color === '#ef4444' ? 'down' : 'up'}`}>{k.trend}</span>
            </div>
            <div className="kpi-val" style={{ color: k.color }}>{k.val}</div>
            <div className="kpi-lbl">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="project-grid">
        {PROJECTS.map(p => (
          <div key={p.name} className="project-card">
            <div className="project-emoji">{p.emoji}</div>
            <div className="project-body">
              <span className={`project-status-badge ${p.status}`}>{p.status}</span>
              <div className="project-name">{p.name}</div>
              <div className="project-location">📍 {p.location}</div>
              <div className="progress-label"><span>Progress</span><span>{p.progress}%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${p.progress}%` }}></div></div>
              <div className="project-meta">
                <span>💰 {p.budget}</span>
                <span>👷 {p.workers}</span>
                <span>{p.days ? `📅 ${p.days}d left` : '🗓 Planning'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
