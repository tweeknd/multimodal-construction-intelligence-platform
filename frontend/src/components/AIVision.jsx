import { useEffect, useRef } from 'react';

export default function AIVision() {
  const canvasRef = useRef();
  let animRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;
    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, '#0a0c10'); sky.addColorStop(1, '#141824');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1a1412'; ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height);
      ctx.fillStyle = '#1e2230'; ctx.fillRect(400, 60, 180, 300);
      for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) {
        ctx.fillStyle = Math.random() > 0.6 ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(410 + c * 40, 75 + r * 35, 25, 22);
      }
      ctx.strokeStyle = '#2d3548'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(620, 360); ctx.lineTo(620, 50); ctx.stroke();
      ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(560, 55); ctx.lineTo(720, 55); ctx.stroke();
      ctx.strokeStyle = 'rgba(245,158,11,0.6)'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(700, 55); ctx.lineTo(700 + Math.sin(t * 0.5) * 8, 200); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#2a3040'; ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(50 + i * 30, 100); ctx.lineTo(50 + i * 30, 330); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 100 + i * 40); ctx.lineTo(230, 100 + i * 40); ctx.stroke();
      }
      const wx = 150 + Math.sin(t * 0.3) * 20;
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(wx, 270, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8eaf0'; ctx.fillRect(wx - 5, 278, 10, 20);
      ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(300, 285, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8eaf0'; ctx.fillRect(295, 293, 10, 20);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px monospace';
      ctx.fillText(`REC ● ${new Date().toLocaleTimeString()} | SITE-C CAM-2`, 12, 20);
      t += 0.05;
      animRef = requestAnimationFrame(drawFrame);
    }
    drawFrame();
    return () => cancelAnimationFrame(animRef);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div><h2>👁 AI Vision Monitor</h2><p>Live construction site monitoring with AI object detection, PPE tracking, and danger zone alerts.</p></div>
        <span className="live-pill">● LIVE</span>
      </div>
      <div className="vision-layout-react">
        <div className="card vision-feed-card">
          <div style={{ position: 'relative' }}>
            <canvas ref={canvasRef} width={800} height={450} style={{ width: '100%', borderRadius: '8px' }} />
            <div className="det-box-overlay">
              <div className="det-box" style={{ left:'12%',top:'20%',width:'80px',height:'160px' }} data-label="Worker ✓ Hard Hat 98.2%" />
              <div className="det-box danger" style={{ left:'55%',top:'30%',width:'90px',height:'150px' }} data-label="Worker ✗ No PPE 96.5%" />
              <div className="danger-zone-box">⚠ DANGER ZONE</div>
            </div>
            <div className="vision-hud">
              <div className="hud-item"><span className="hud-val">3</span><span>Detected</span></div>
              <div className="hud-item"><span className="hud-val warn">1</span><span>Violation</span></div>
              <div className="hud-item"><span className="hud-val">28</span><span>FPS</span></div>
              <div className="hud-item"><span className="hud-val ok">97%</span><span>Confidence</span></div>
            </div>
          </div>
        </div>
        <div className="vision-sidebar-panel">
          <div className="card">
            <h4>PPE Compliance</h4>
            <div className="compliance-bars">
              {[['Hard Hat','88%',0.88],['Safety Vest','92%',0.92],['Gloves','75%',0.75],['Boots','95%',0.95]].map(([label,pct,val]) => (
                <div key={label} className="comp-bar-row">
                  <span>{label}</span>
                  <div className="comp-bar-track"><div className="comp-bar-fill" style={{width:`${val*100}%`, background: val < 0.8 ? '#ef4444' : '#10b981'}}></div></div>
                  <span>{pct}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h4>Violation Summary</h4>
            {[['No Hard Hat','2','critical'],['No Safety Vest','1','warn'],['Restricted Zone','0','ok']].map(([type,count,cls]) => (
              <div key={type} className={`viol-row ${cls}`}>
                <span>{type}</span><span className="viol-cnt">{count}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h4>Detection Log</h4>
            <div className="det-log">
              {['Worker ✓ Hard Hat (98.2%)','Worker ✗ No Hard Hat (96.5%)','Excavator (99.1%)','Danger zone entry (91.3%)'].map((item,i) => (
                <div key={i} className="det-log-item"><span>{item}</span><span className="log-time">{new Date().toLocaleTimeString()}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
