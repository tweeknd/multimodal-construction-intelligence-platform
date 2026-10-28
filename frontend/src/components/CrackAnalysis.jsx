import { useState, useRef } from 'react';
import { analyzeCrack } from '../utils/api';

const SEVERITY_COLOR = { minor: '#10b981', moderate: '#f59e0b', severe: '#ef4444', critical: '#dc2626', none: '#6b7280' };
const CRACK_TYPES = ['hairline','structural','surface','diagonal','horizontal','vertical','map_cracking','spalling'];
const STRUCTURE_TYPES = ['Building Wall','Foundation','Column','Beam','Slab','Bridge Deck','Retaining Wall','Pavement'];

export default function CrackAnalysis() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState('');
  const [structureType, setStructureType] = useState('Building Wall');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
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
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageFile) { setError('Please upload an image first.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeCrack(imageFile, location || 'Construction Site', structureType);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const SeverityBadge = ({ severity }) => (
    <span className="severity-badge" style={{ background: SEVERITY_COLOR[severity] || '#6b7280' }}>
      {severity?.toUpperCase()}
    </span>
  );

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div>
          <h2>🔍 Crack Detection & Structural Analysis</h2>
          <p>Upload a construction image to detect cracks, assess severity, and get corrective recommendations powered by Gemini AI.</p>
        </div>
      </div>

      <div className="two-col-layout">
        {/* LEFT: Input Panel */}
        <div className="input-panel">
          <div className="card">
            <h3 className="card-title">Upload Structure Image</h3>
            <div
              className={`drop-zone ${imagePreview ? 'has-image' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="drop-zone-placeholder">
                  <div className="drop-icon">🏗️</div>
                  <p>Drop structure image here or <span className="link">browse</span></p>
                  <p className="sub">JPG, PNG, WEBP supported</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileRef} style={{ display: 'none' }} accept="image/*"
              onChange={e => handleFile(e.target.files[0])} />

            <div className="form-group">
              <label>Location / Site</label>
              <input type="text" placeholder="e.g. Site A, Block B, Floor 3"
                value={location} onChange={e => setLocation(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label>Structure Type</label>
              <select value={structureType} onChange={e => setStructureType(e.target.value)} className="form-select">
                {STRUCTURE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {error && <div className="error-msg">⚠ {error}</div>}

            <button className="btn-primary full-width" onClick={handleAnalyze} disabled={loading}>
              {loading ? <span className="loading-text"><span className="spinner" />Analyzing with AI...</span> : '🔍 Analyze for Cracks'}
            </button>
          </div>

          {result && (
            <div className="card">
              <h3 className="card-title">Structural Risk Level</h3>
              <div className="risk-gauge">
                <div className="risk-value" style={{ color: SEVERITY_COLOR[result.overall_severity] || '#10b981' }}>
                  {result.structural_risk?.toUpperCase()}
                </div>
                <div className="risk-label">Structural Risk</div>
                <div className="risk-flags">
                  {result.immediate_action_required && (
                    <span className="flag critical">⚡ Immediate Action Required</span>
                  )}
                  {result.engineer_inspection_required && (
                    <span className="flag warn">👷 Engineer Inspection Needed</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Results Panel */}
        <div className="results-panel">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Analysis Yet</h3>
              <p>Upload a structure image and click Analyze to get AI-powered crack detection results.</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="ai-loader">
                <div className="ai-ring"></div>
                <div className="ai-ring-2"></div>
              </div>
              <h3>Gemini AI Analyzing...</h3>
              <p>Detecting cracks, assessing severity and structural risk</p>
            </div>
          )}

          {result && (
            <>
              {/* Summary Card */}
              <div className="card result-summary">
                <div className="result-header">
                  <div>
                    <h3>Analysis Complete</h3>
                    <p className="confidence">AI Confidence: <strong>{((result.confidence || 0) * 100).toFixed(1)}%</strong></p>
                  </div>
                  <div className="crack-count-badge">
                    <span className="count">{result.crack_count}</span>
                    <span className="count-label">Cracks Found</span>
                  </div>
                </div>
                <p className="analysis-summary">{result.analysis_summary}</p>
                {result.estimated_repair_cost_range && (
                  <div className="cost-badge">
                    💰 Estimated Repair: <strong>{result.estimated_repair_cost_range}</strong>
                  </div>
                )}
              </div>

              {/* Crack Details */}
              {result.cracks?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">Detected Cracks ({result.cracks.length})</h3>
                  <div className="crack-list">
                    {result.cracks.map((crack, i) => (
                      <div key={i} className="crack-item">
                        <div className="crack-item-header">
                          <span className="crack-type">{crack.crack_type?.replace(/_/g, ' ').toUpperCase()}</span>
                          <SeverityBadge severity={crack.severity} />
                        </div>
                        <p className="crack-location">📍 {crack.location_description}</p>
                        <div className="crack-dims">
                          {crack.width_estimate && <span>Width: {crack.width_estimate}</span>}
                          {crack.length_estimate && <span>Length: {crack.length_estimate}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Probable Causes */}
              {result.probable_causes?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">⚠ Probable Causes</h3>
                  <ul className="cause-list">
                    {result.probable_causes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Corrective Actions */}
              {result.corrective_actions?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">✅ Corrective Actions</h3>
                  <div className="action-list">
                    {result.corrective_actions.map((a, i) => (
                      <div key={i} className="action-item">
                        <span className="action-num">{i + 1}</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
