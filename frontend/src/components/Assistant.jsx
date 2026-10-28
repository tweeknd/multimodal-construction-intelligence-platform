import { useState, useRef, useEffect } from 'react';
import { chatWithAssistant, getWeatherAdvisory } from '../utils/api';

const QUICK_PROMPTS = [
  'What PPE is mandatory on construction sites in India?',
  'How do I calculate concrete mix ratio for M20 grade?',
  'What are BIS standards for structural steel?',
  'How to handle monsoon season construction delays?',
  'What is the safe load capacity for a mobile crane?',
  'Explain the IS 456:2000 requirements for RCC',
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hello! I\'m ConstructIQ AI Assistant — your intelligent construction site advisor. I can help with safety protocols, material calculations, BIS standards, scheduling, and much more. What can I help you with today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [weatherLocation, setWeatherLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await chatWithAssistant(msg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠ Sorry, I couldn\'t connect to the AI backend. Please make sure the backend server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleWeather = async () => {
    if (!weatherLocation) { setWeatherError('Please enter a location.'); return; }
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await getWeatherAdvisory(weatherLocation);
      setWeatherData(data);
    } catch (err) {
      setWeatherError('Weather advisory failed. Check backend.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const impactColor = { go: '#10b981', caution: '#f59e0b', stop: '#ef4444' };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div>
          <h2>🤖 AI Site Assistant</h2>
          <p>Your intelligent construction advisor — ask about safety, standards, materials, planning, and get weather advisories.</p>
        </div>
      </div>

      <div className="tab-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`tab-btn ${activeTab==='chat'?'active':''}`} onClick={() => setActiveTab('chat')}>💬 Chat Assistant</button>
        <button className={`tab-btn ${activeTab==='weather'?'active':''}`} onClick={() => setActiveTab('weather')}>⛅ Weather Advisory</button>
      </div>

      {activeTab === 'chat' && (
        <div className="chat-layout">
          <div className="quick-prompts">
            <h4>Quick Prompts</h4>
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <div className="chat-panel">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.role}`}>
                  <div className="msg-avatar">{m.role === 'user' ? '👤' : '🤖'}</div>
                  <div className="msg-bubble">
                    <pre className="msg-content">{m.content}</pre>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <div className="msg-avatar">🤖</div>
                  <div className="msg-bubble thinking">
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-bar">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Ask about safety, materials, standards, costs..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={loading}
              />
              <button className="btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? '...' : '➤ Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'weather' && (
        <div className="weather-panel">
          <div className="card">
            <h3 className="card-title">⛅ Weather Advisory for Construction</h3>
            <div className="weather-input-row">
              <input type="text" className="form-input" placeholder="Enter location (e.g. Mumbai, Maharashtra)"
                value={weatherLocation} onChange={e => setWeatherLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleWeather()} />
              <button className="btn-primary" onClick={handleWeather} disabled={weatherLoading}>
                {weatherLoading ? '...' : 'Get Advisory'}
              </button>
            </div>
            {weatherError && <div className="error-msg">⚠ {weatherError}</div>}
          </div>

          {weatherLoading && (
            <div className="loading-state">
              <div className="ai-loader"><div className="ai-ring"></div><div className="ai-ring-2"></div></div>
              <h3>Generating Weather Advisory...</h3>
            </div>
          )}

          {weatherData && (
            <>
              <div className="card">
                <h3 className="card-title">📍 {weatherData.location} — {weatherData.season}</h3>
                <p className="analysis-summary">{weatherData.weather_summary}</p>
                <div className="weather-stats">
                  <div className="w-stat"><span>{weatherData.temperature_range}</span><span>Temperature</span></div>
                  <div className="w-stat"><span className={`risk-pill ${weatherData.precipitation_risk}`}>{weatherData.precipitation_risk?.toUpperCase()}</span><span>Rain Risk</span></div>
                  <div className="w-stat"><span className={`risk-pill ${weatherData.wind_advisory}`}>{weatherData.wind_advisory?.toUpperCase()}</span><span>Wind</span></div>
                </div>
              </div>

              {weatherData.construction_impact && (
                <div className="card">
                  <h3 className="card-title">🏗️ Construction Impact Assessment</h3>
                  <div className="impact-grid">
                    {Object.entries(weatherData.construction_impact).map(([activity, status]) => (
                      <div key={activity} className="impact-item">
                        <span className="activity-name">{activity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                        <span className="impact-status" style={{ color: impactColor[status] }}>
                          {status === 'go' ? '✅ GO' : status === 'caution' ? '⚠ CAUTION' : '🛑 STOP'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {weatherData.recommendations?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">💡 Recommendations</h3>
                  {weatherData.recommendations.map((r, i) => (
                    <div key={i} className="action-item">
                      <span className="action-num">{i+1}</span><span>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {weatherData.forecast_days?.length > 0 && (
                <div className="card">
                  <h3 className="card-title">📅 7-Day Forecast</h3>
                  <div className="forecast-row">
                    {weatherData.forecast_days.map((d, i) => (
                      <div key={i} className={`forecast-day suitability-${d.work_suitability}`}>
                        <div className="fc-day">{d.day}</div>
                        <div className="fc-cond">{d.condition}</div>
                        <div className="fc-temp">{d.temp}</div>
                        <div className="fc-suit">{d.work_suitability}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
