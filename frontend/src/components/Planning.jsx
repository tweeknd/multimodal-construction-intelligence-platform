import { useState } from 'react';
import { estimatePlanning } from '../utils/api';

const PROJECT_TYPES = ['Residential Building','Commercial Complex','Industrial Warehouse','Bridge','Road/Highway','School/Hospital','Mixed Use Development'];

export default function Planning() {
  const [form, setForm] = useState({
    project_type: 'Residential Building',
    area_sqft: '',
    location: '',
    duration_months: '',
    description: '',
    budget_range: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.area_sqft || !form.location) { setError('Area and location are required.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await estimatePlanning({
        ...form,
        area_sqft: parseFloat(form.area_sqft),
        duration_months: parseInt(form.duration_months) || 12,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Planning estimation failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div>
          <h2>📐 AI Construction Planning & Estimation</h2>
          <p>Enter project details to get AI-generated material estimates, cost breakdown, task schedule, and risk analysis.</p>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="input-panel">
          <div className="card">
            <h3 className="card-title">Project Details</h3>
            <div className="form-group">
              <label>Project Type</label>
              <select className="form-select" value={form.project_type} onChange={e => set('project_type', e.target.value)}>
                {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Area (sq ft)</label>
                <input type="number" className="form-input" placeholder="e.g. 5000" value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Duration (months)</label>
                <input type="number" className="form-input" placeholder="e.g. 18" value={form.duration_months} onChange={e => set('duration_months', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-input" placeholder="e.g. Mumbai, Maharashtra" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Budget Range</label>
              <input type="text" className="form-input" placeholder="e.g. ₹50 Lakh - ₹1 Crore" value={form.budget_range} onChange={e => set('budget_range', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <textarea className="form-textarea" rows={4} placeholder="Describe the project — type of structure, number of floors, special requirements..."
                value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            {error && <div className="error-msg">⚠ {error}</div>}
            <button className="btn-primary full-width" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="loading-text"><span className="spinner" />Generating Plan...</span> : '📐 Generate AI Plan'}
            </button>
          </div>
        </div>

        <div className="results-panel">
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">📐</div>
              <h3>Enter Project Details</h3>
              <p>Fill in project information to generate a comprehensive AI-powered construction plan with cost estimates and schedules.</p>
            </div>
          )}
          {loading && (
            <div className="loading-state">
              <div className="ai-loader"><div className="ai-ring"></div><div className="ai-ring-2"></div></div>
              <h3>Gemini AI Planning...</h3>
              <p>Generating material estimates, cost breakdown, and task schedule</p>
            </div>
          )}
          {result && (
            <>
              <div className="card cost-hero">
                <div className="cost-hero-content">
                  <div>
                    <p className="cost-label">Total Estimated Cost</p>
                    <p className="cost-value">{result.total_estimated_cost}</p>
                    <p className="cost-sub">Duration: {result.estimated_duration_months} months · Confidence: {((result.confidence||0)*100).toFixed(0)}%</p>
                  </div>
                </div>
                <p className="analysis-summary">{result.project_overview}</p>
              </div>

              <div className="card">
                <div className="tab-bar">
                  {['overview','materials','schedule','risks'].map(t => (
                    <button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
                      {t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="list-content">
                    <h4>Cost Breakdown</h4>
                    {result.cost_breakdown && Object.entries(result.cost_breakdown).map(([k,v]) => (
                      <div key={k} className="breakdown-row">
                        <span className="breakdown-key">{k.charAt(0).toUpperCase()+k.slice(1)}</span>
                        <span className="breakdown-val">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div className="list-content">
                    <table className="data-table">
                      <thead><tr><th>Material</th><th>Qty</th><th>Unit</th><th>Unit Cost</th><th>Total</th></tr></thead>
                      <tbody>
                        {result.material_estimates?.map((m,i) => (
                          <tr key={i}>
                            <td>{m.material}</td><td>{m.quantity}</td><td>{m.unit}</td>
                            <td>{m.unit_cost}</td><td><strong>{m.total_cost}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="list-content">
                    {result.task_schedule?.map((t, i) => (
                      <div key={i} className="task-row">
                        <div className="task-header">
                          <strong>{t.task_name}</strong>
                          <span className="task-trade">{t.trade}</span>
                        </div>
                        <div className="task-bar-wrap">
                          <div className="task-bar" style={{ marginLeft: `${(t.start_week-1)*2}%`, width: `${t.duration_days/3}%`, minWidth: '40px' }}>
                            W{t.start_week} · {t.duration_days}d
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'risks' && (
                  <div className="list-content">
                    <h4>Risk Factors</h4>
                    {result.risk_factors?.map((r,i) => (
                      <div key={i} className="risk-item">⚠ {r}</div>
                    ))}
                    <h4 style={{ marginTop: '1rem' }}>Recommendations</h4>
                    {result.recommendations?.map((r,i) => (
                      <div key={i} className="action-item">
                        <span className="action-num">{i+1}</span><span>{r}</span>
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
