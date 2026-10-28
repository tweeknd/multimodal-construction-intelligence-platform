import { useState, useRef } from 'react';
import { analyzeSafety } from '../utils/api';

const SEVERITY_COLOR = { critical: '#dc2626', high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

export default function SafetyMonitor() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('violations');
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!imageFile) { setError('Please upload a site image first.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSafety(imageFile, siteName || 'Construction Site', description);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div>
          <h2>🛡️ AI Safety Analysis</h2>
          <p>Upload a construction site photo to detect PPE violations, hazards, and get AI-generated corrective recommendations.</p>
        </div>
      </div>

      <div className="two-col-layout">
        {/* Input */}
        <div className="input-panel">
          <div className="card">
            <h3 className="card-title">Upload Site Image</h3>
            <div className={`drop-zone ${imagePreview ? 'has-image' : ''}`}
              onDragOver={e => e.preventDefault()} onDrop={handleDrop}
              onClick={() => fileRef.current.click()}>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="image-preview" />
                : (
                  <div className="drop-zone-placeholder">
                    <div className="drop-icon">📷</div>
                    <p>Drop site image here or <span className="link">browse</span></p>
                    <p className="sub">JPG, PNG, WEBP supported</p>
                  </div>
                )}
            </div>
            <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*"
              onChange={e => handleFile(e.target.files[0])} />

            <div className="form-group">
              <label>Site Name</label>
              <input type="text" placeholder="e.g. Site A – Tower Block 3" value={siteName}
                onChange={e => setSiteName(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label>Additional Context</label>
              <textarea placeholder="Any additional notes about this site section..."
                value={description} onChange={e => setDescription(e.target.value)}
                className="form-textarea" rows={3} />
            </div>
            {error && <div className="error-msg">⚠ {error}</div>}
            <button className="btn-primary full-width" onClick={handleAnalyze} disabled={loading}>
              {loading ? <span className="loading-text"><span className="spinner" />Analyzing...</span> : '🛡️ Run Safety Analysis'}
            </button>
          </div>

          {result && (
            <div className="card">
              <h3 className="card-title">Safety Score</h3>
              <div className="score-circle-wrap">
                <div className="score-circle" style={{ background: `conic-gradient(${scoreColor(result.overall_safety_score)} ${result.overall_safety_score * 3.6}deg, #1e2230 0deg)` }}>
                  <div className="score-inner">
                    <span className="score-num" style={{ color: scoreColor(result.overall_safety_score) }}>
                      {result.overall_safety_score}
                    </span>
                    <span className="score-label">/100</span>
                  </div>
                </div>
                <div className="score-meta">
                  <div className={`compliance-badge ${result.compliance_status}`}>{result.compliance_status?.toUpperCase()}</div>
                  <p>👷 {result.workers_detected} workers detected, {result.workers_compliant} compliant</p>
                  <p>AI Confidence: {((result.confidence || 0) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="results-panel">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🛡️</div>
              <h3>No Analysis Yet</h3>
              <p>Upload a construction site image to get AI-powered safety analysis.</p>
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="ai-loader"><div className="ai-ring"></div><div className="ai-ring-2"></div></div>
              <h3>Gemini AI Scanning...</h3>
              <p>Detecting PPE violations, hazards, and safety risks</p>
            </div>
          )}
          {result && (
            <>
              <div className="card">
                <p className="analysis-summary">{result.analysis_summary}</p>
              </div>

              <div className="card">
                <div className="tab-bar">
                  {['violations', 'hazards', 'actions'].map(tab => (
                    <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}>
                      {tab === 'violations' ? `PPE Violations (${result.ppe_violations?.length || 0})`
                        : tab === 'hazards' ? `Hazards (${result.hazards?.length || 0})`
                        : 'Actions'}
                    </button>
                  ))}
                </div>

                {activeTab === 'violations' && (
                  <div className="list-content">
                    {result.ppe_violations?.length === 0
                      ? <p className="ok-msg">✅ No PPE violations detected!</p>
                      : result.ppe_violations?.map((v, i) => (
                        <div key={i} className="violation-card">
                          <span className="viol-type">{v.type}</span>
                          <span className="viol-sev" style={{ color: SEVERITY_COLOR[v.severity] }}>{v.severity?.toUpperCase()}</span>
                          {v.location_in_image && <p className="viol-loc">📍 {v.location_in_image}</p>}
                        </div>
                      ))}
                  </div>
                )}

                {activeTab === 'hazards' && (
                  <div className="list-content">
                    {result.hazards?.length === 0
                      ? <p className="ok-msg">✅ No hazards detected!</p>
                      : result.hazards?.map((h, i) => (
                        <div key={i} className="hazard-card" style={{ borderLeft: `3px solid ${SEVERITY_COLOR[h.severity]}` }}>
                          <div className="hazard-header">
                            <strong>{h.hazard_type}</strong>
                            <span style={{ color: SEVERITY_COLOR[h.severity] }}>{h.severity?.toUpperCase()}</span>
                          </div>
                          <p>{h.description}</p>
                          <p className="corrective">✅ {h.corrective_action}</p>
                        </div>
                      ))}
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="list-content">
                    {result.immediate_actions?.length > 0 && (
                      <>
                        <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>⚡ Immediate Actions</h4>
                        {result.immediate_actions.map((a, i) => (
                          <div key={i} className="action-item">
                            <span className="action-num critical">{i + 1}</span><span>{a}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <h4 style={{ color: '#f59e0b', margin: '1rem 0 0.5rem' }}>📋 Recommendations</h4>
                    {result.general_recommendations?.map((r, i) => (
                      <div key={i} className="action-item">
                        <span className="action-num">{i + 1}</span><span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
