import { useState } from 'react';
import { estimateValuation } from '../utils/api';

const PROPERTY_TYPES = ['Residential Apartment','Independent House/Villa','Commercial Office','Retail Shop','Industrial Plot','Agricultural Land','Mixed Use'];
const CONDITIONS = ['Excellent','Good','Fair','Poor','Under Construction'];

export default function Valuation() {
  const [form, setForm] = useState({
    property_type: 'Residential Apartment',
    location: '', area_sqft: '', property_age: '',
    floors: '1', amenities: '', condition: 'Good'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.location || !form.area_sqft) { setError('Location and area are required.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await estimateValuation({
        ...form,
        area_sqft: parseFloat(form.area_sqft),
        property_age: parseInt(form.property_age) || 0,
        floors: parseInt(form.floors) || 1,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Valuation failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const trendIcon = { rising: '📈', stable: '➡️', declining: '📉' };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div>
          <h2>🏠 AI Real Estate Valuation</h2>
          <p>Enter property details to get AI-driven market valuation, comparable analysis, and investment scoring.</p>
        </div>
      </div>
      <div className="two-col-layout">
        <div className="input-panel">
          <div className="card">
            <h3 className="card-title">Property Details</h3>
            <div className="form-group">
              <label>Property Type</label>
              <select className="form-select" value={form.property_type} onChange={e => set('property_type', e.target.value)}>
                {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-input" placeholder="e.g. Whitefield, Bengaluru" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Built-up Area (sq ft)</label>
                <input type="number" className="form-input" placeholder="e.g. 1200" value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Property Age (years)</label>
                <input type="number" className="form-input" placeholder="e.g. 5" value={form.property_age} onChange={e => set('property_age', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>No. of Floors</label>
                <input type="number" className="form-input" placeholder="e.g. 3" value={form.floors} onChange={e => set('floors', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select className="form-select" value={form.condition} onChange={e => set('condition', e.target.value)}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Amenities</label>
              <textarea className="form-textarea" rows={3} placeholder="e.g. Parking, Gym, Swimming Pool, 24/7 Security, Garden..."
                value={form.amenities} onChange={e => set('amenities', e.target.value)} />
            </div>
            {error && <div className="error-msg">⚠ {error}</div>}
            <button className="btn-primary full-width" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="loading-text"><span className="spinner" />Valuating...</span> : '🏠 Get AI Valuation'}
            </button>
          </div>
        </div>

        <div className="results-panel">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>Enter Property Details</h3>
              <p>Fill in property information to get AI-powered market valuation and investment analysis.</p>
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="ai-loader"><div className="ai-ring"></div><div className="ai-ring-2"></div></div>
              <h3>Gemini AI Analyzing Market...</h3>
              <p>Generating valuation, comparables, and investment score</p>
            </div>
          )}
          {result && (
            <>
              <div className="card val-hero">
                <div className="val-main">
                  <div>
                    <p className="val-label">Estimated Market Value</p>
                    <p className="val-value">{result.estimated_value}</p>
                    <p className="val-range">{result.value_range_low} — {result.value_range_high}</p>
                  </div>
                  <div className="investment-score">
                    <div className="score-ring" style={{ background: `conic-gradient(#f59e0b ${result.investment_score*3.6}deg, #1e2230 0deg)` }}>
                      <div className="score-inner-sm">{result.investment_score}</div>
                    </div>
                    <p>Investment Score</p>
                  </div>
                </div>
                <div className="val-stats">
                  <div className="val-stat"><span>{result.price_per_sqft}</span><span>Per Sq Ft</span></div>
                  <div className="val-stat"><span>{trendIcon[result.market_trend]} {result.market_trend?.toUpperCase()}</span><span>Market Trend</span></div>
                </div>
                <p className="analysis-summary">{result.analysis_summary}</p>
              </div>

              {result.comparable_properties?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">📊 Comparable Properties</h3>
                  <div className="comp-list">
                    {result.comparable_properties.map((p, i) => (
                      <div key={i} className="comp-item">
                        <p className="comp-desc">{p.description}</p>
                        <div className="comp-meta">
                          <span>{p.area_sqft}</span>
                          <span>{p.price_per_sqft}/sqft</span>
                          <strong>{p.estimated_price}</strong>
                          {p.distance && <span>📍 {p.distance}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card">
                <h3 className="card-title">📋 Valuation Factors</h3>
                <ul className="factor-list">
                  {result.valuation_factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              {result.recommendations?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">💡 Recommendations</h3>
                  {result.recommendations.map((r, i) => (
                    <div key={i} className="action-item">
                      <span className="action-num">{i+1}</span><span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
