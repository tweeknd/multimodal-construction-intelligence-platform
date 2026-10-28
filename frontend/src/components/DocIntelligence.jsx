const DOCS = [
  { name: 'Site Blueprint v3.dwg', type: '📐', color: '#3b82f6', size: '8.4 MB', date: 'Oct 23', tags: ['Blueprint','CAD','Structural'] },
  { name: 'Contract_Rev4.pdf', type: '📄', color: '#ef4444', size: '2.1 MB', date: 'Oct 21', tags: ['Contract','Legal','Risk'] },
  { name: 'Safety_Compliance.docx', type: '🛡️', color: '#10b981', size: '1.3 MB', date: 'Oct 19', tags: ['Safety','Compliance'] },
  { name: 'Material_BOM.csv', type: '📊', color: '#f59e0b', size: '0.6 MB', date: 'Oct 18', tags: ['BOM','Materials'] },
  { name: 'Foundation_Report.pdf', type: '🏗️', color: '#8b5cf6', size: '5.2 MB', date: 'Oct 15', tags: ['Report','Geotechnical'] },
];

export default function DocIntelligence() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div><h2>📄 Document Intelligence</h2><p>AI-powered document analysis — extract entities, flag risks, and summarize construction documents.</p></div>
      </div>
      <div className="doc-drop-zone">
        <div className="drop-icon">📤</div>
        <p>Drop documents here or <span className="link">browse</span></p>
        <p className="sub">PDF, DOCX, DWG, IFC, CSV — AI will analyze instantly</p>
      </div>
      <div className="doc-grid-react">
        {DOCS.map(d => (
          <div key={d.name} className="doc-card-react">
            <div className="doc-icon" style={{ color: d.color }}>{d.type}</div>
            <div className="doc-info">
              <div className="doc-name">{d.name}</div>
              <div className="doc-meta">{d.size} · {d.date}</div>
              <div className="doc-tags">{d.tags.map(t => <span key={t} className="doc-tag">{t}</span>)}</div>
            </div>
            <button className="btn-ghost small">Analyze</button>
          </div>
        ))}
      </div>
    </div>
  );
}
