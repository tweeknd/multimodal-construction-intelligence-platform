const INSIGHTS = [
  { tag: '👁 Vision', title: 'PPE Compliance Improved 8.3%', body: 'Hard hat compliance rose from 81% to 88% following automated alerts on Site C.', conf: 94.1 },
  { tag: '📡 Sensor', title: 'Crane Load Anomaly Detected', body: 'Crane 2 exceeded 90% rated load 3× this week. 14% fault probability in 30 days.', conf: 91.3 },
  { tag: '📄 Document', title: 'Contract Risk: Delay Clause', body: 'AI flagged uncapped delay penalty in Contract Rev 4. ₹2.1 Cr potential liability.', conf: 96.8 },
  { tag: '⚠ Risk', title: 'Weather-Induced Schedule Risk', body: 'Monsoon models indicate 11-day delay risk for Harbor Bridge. Recommend 14-day buffer.', conf: 88.5 },
];

export default function Reports() {
  return (
    <div className="page-wrapper">
      <div className="page-hero" style={{ justifyContent: 'space-between' }}>
        <div><h2>📊 Reports & AI Insights</h2><p>Multimodal AI analysis across vision, document, and sensor streams.</p></div>
        <button className="btn-primary">Generate Full Report</button>
      </div>
      <div className="insights-grid-react">
        {INSIGHTS.map((ins, i) => (
          <div key={i} className="insight-card-react">
            <span className="insight-tag-react">{ins.tag}</span>
            <h4>{ins.title}</h4>
            <p>{ins.body}</p>
            <div className="insight-footer-react">
              <span>Confidence: <strong>{ins.conf}%</strong></span>
              <button className="btn-ghost small">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
