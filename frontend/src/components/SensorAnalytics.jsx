import { useEffect, useRef, useState } from 'react';

const SENSORS = [
  { id: 'sv1', name: 'Crane Load Cell', unit: 'T', base: 12, range: 5, color: '#f59e0b' },
  { id: 'sv2', name: 'Air Quality PM2.5', unit: 'µg/m³', base: 48, range: 20, color: '#3b82f6', warn: 55 },
  { id: 'sv3', name: 'Vibration (Pile)', unit: 'mm/s', base: 2.1, range: 2, color: '#8b5cf6' },
  { id: 'sv4', name: 'Temperature', unit: '°C', base: 34, range: 4, color: '#ef4444' },
  { id: 'sv5', name: 'Noise Level', unit: 'dB', base: 88, range: 10, color: '#10b981', warn: 90 },
  { id: 'sv6', name: 'Soil Moisture', unit: '%', base: 18, range: 8, color: '#6366f1' },
];

export default function SensorAnalytics() {
  const [values, setValues] = useState(SENSORS.map(s => s.base));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(SENSORS.map(s => +(s.base + (Math.random() - 0.5) * s.range).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div><h2>📡 Sensor Analytics</h2><p>Real-time IoT sensor data from all active construction sites.</p></div>
        <span className="live-pill">● LIVE</span>
      </div>
      <div className="sensor-cards">
        {SENSORS.map((s, i) => {
          const val = values[i];
          const isWarn = s.warn && val > s.warn;
          return (
            <div key={s.id} className={`sensor-card ${isWarn ? 'warn' : ''}`}>
              <div className="sensor-indicator" style={{ background: isWarn ? '#ef4444' : s.color }}></div>
              <div className="sensor-body">
                <div className="sensor-name">{s.name}</div>
                <div className="sensor-val" style={{ color: isWarn ? '#ef4444' : s.color }}>
                  {val} <span className="sensor-unit">{s.unit}</span>
                </div>
                {isWarn && <div className="sensor-warn">⚠ Above threshold</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">Sensor Status Overview</h3>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>All sensors are live and streaming. Values update every 2 seconds. Anomaly alerts are triggered when readings exceed threshold limits.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div className="stat-chip green">✅ 5 Normal</div>
          <div className="stat-chip amber">⚠ 1 Warning</div>
          <div className="stat-chip">📡 48 Nodes Online</div>
        </div>
      </div>
    </div>
  );
}
