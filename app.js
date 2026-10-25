// ================================================================
//   ConstructIQ — Multimodal Construction Intelligence Platform
//   Main Application Script
// ================================================================

/* ── Navigation ─────────────────────────────────── */
const pages = {
  dashboard: { title: 'Dashboard', breadcrumb: 'Overview' },
  projects:  { title: 'Projects', breadcrumb: 'Project Management' },
  vision:    { title: 'AI Vision Monitor', breadcrumb: 'Intelligence › Vision' },
  documents: { title: 'Document Intelligence', breadcrumb: 'Intelligence › Documents' },
  sensors:   { title: 'Sensor Analytics', breadcrumb: 'Intelligence › Sensors' },
  safety:    { title: 'Safety Monitor', breadcrumb: 'Operations › Safety' },
  reports:   { title: 'Reports & AI Insights', breadcrumb: 'Operations › Reports' },
};

let currentPage = 'dashboard';

function navigateTo(id) {
  if (!pages[id]) return;

  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');

  // update nav
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === id);
  });

  // update topbar
  document.getElementById('pageTitle').textContent = pages[id].title;
  document.getElementById('breadcrumb').innerHTML =
    `<span>ConstructIQ</span><span class="sep">›</span><span>${pages[id].breadcrumb}</span>`;

  currentPage = id;

  // lazy init page content
  if (id === 'vision') initVision();
  if (id === 'sensors') initSensors();
  if (id === 'safety') initSafety();
  if (id === 'reports') initReports();
}

document.querySelectorAll('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); navigateTo(el.dataset.page); });
});

/* ── Sidebar Toggle ─────────────────────────────── */
const sidebar = document.getElementById('sidebar');
document.getElementById('sidebarToggle').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

/* ── Theme Toggle ────────────────────────────────── */
document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'light' ? '' : 'light';
});

/* ── Toast Helper ────────────────────────────────── */
function showToast(msg, type = 'success') {
  const icons = { success: '✓', warn: '⚠', error: '✕' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ════════════════════════════════════════════════
   DASHBOARD PAGE
════════════════════════════════════════════════ */

// Progress Chart
function initProgressChart() {
  const ctx = document.getElementById('progressChart').getContext('2d');
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Skyline Tower', data: [65, 72, 68, 75, 80, 78, 82], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6 },
        { label: 'Harbor Bridge', data: [50, 54, 58, 55, 60, 63, 66], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 },
        { label: 'Green Quarter', data: [30, 35, 38, 40, 44, 42, 47], backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 6 },
        { label: 'Metro Station', data: [10, 14, 18, 22, 25, 24, 28], backgroundColor: 'rgba(139,92,246,0.7)', borderRadius: 6 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8b95a8', font: { size: 11 } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' }, max: 100 }
      }
    }
  });
}

// Safety Donut
function initSafetyChart() {
  const ctx = document.getElementById('safetyChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Compliant', 'Minor Risk', 'Critical'],
      datasets: [{ data: [72, 18, 10], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      cutout: '72%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#8b95a8', font: { size: 11 }, padding: 12 } }
      }
    }
  });
}

// Live event feed
const eventTypes = [
  { type: 'critical', icon: '🔴', msgs: ['PPE violation detected — Site C Gate 2', 'Crane overload alert — Site B Zone 3', 'Unauthorized zone entry — Site A'] },
  { type: 'warn', icon: '🟡', msgs: ['Air quality threshold exceeded — Site D', 'Delay risk identified in foundation work', 'Document approval pending — Contract Rev 4'] },
  { type: 'info', icon: '🔵', msgs: ['AI analyzed 12 new documents', 'Sensor batch sync complete (48 nodes)', 'Daily safety briefing logged — Site A'] },
];

function randomEvent() {
  const grp = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  return { type: grp.type, icon: grp.icon, msg: grp.msgs[Math.floor(Math.random() * grp.msgs.length)] };
}

function seedEventFeed() {
  const feed = document.getElementById('eventFeed');
  const seeds = [
    { type: 'critical', icon: '🔴', msg: 'PPE violation detected — Site C Gate 2', time: '20:54' },
    { type: 'warn', icon: '🟡', msg: 'Noise level at 92 dB — Site D Z2', time: '20:51' },
    { type: 'info', icon: '🔵', msg: 'AI Blueprint analysis complete', time: '20:48' },
    { type: 'info', icon: '🔵', msg: 'Sensor sync — 48 nodes online', time: '20:40' },
    { type: 'warn', icon: '🟡', msg: 'Weather alert: High winds forecast', time: '20:30' },
  ];
  seeds.forEach(e => addEventItem(feed, e));
}

function addEventItem(feed, ev) {
  const now = new Date();
  const time = ev.time || `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  const el = document.createElement('div');
  el.className = `event-item ${ev.type}`;
  el.innerHTML = `<span class="event-icon">${ev.icon}</span><span class="event-msg">${ev.msg}</span><span class="event-time">${time}</span>`;
  feed.insertBefore(el, feed.firstChild);
  if (feed.children.length > 10) feed.lastChild.remove();
}

function startLiveFeed() {
  setInterval(() => {
    if (currentPage === 'dashboard') {
      const ev = randomEvent();
      addEventItem(document.getElementById('eventFeed'), ev);
    }
  }, 4500);
}

/* ── Animated KPI counters ────────────────────── */
function animateCounters() {
  document.querySelectorAll('.kpi-val').forEach(el => {
    const txt = el.textContent.replace(/[^0-9]/g, '');
    if (!txt) return;
    const target = parseInt(txt, 10);
    let current = 0;
    const step = Math.ceil(target / 30);
    const int = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = el.innerHTML.replace(/[\d,]+/, current.toLocaleString());
      if (current >= target) clearInterval(int);
    }, 30);
  });
}

/* ════════════════════════════════════════════════
   PROJECTS PAGE
════════════════════════════════════════════════ */
const PROJECTS = [
  { id: 1, name: 'Skyline Tower', location: 'Downtown, Mumbai', status: 'active', progress: 68, emoji: '🏙️', gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)', budget: '₹ 480 Cr', workers: 214, days: 142 },
  { id: 2, name: 'Harbor Bridge', location: 'Coastal Road, Chennai', status: 'active', progress: 44, emoji: '🌉', gradient: 'linear-gradient(135deg,#0d1b2a,#1b2838)', budget: '₹ 320 Cr', workers: 98, days: 208 },
  { id: 3, name: 'Green Quarter', location: 'Whitefield, Bengaluru', status: 'active', progress: 29, emoji: '🌿', gradient: 'linear-gradient(135deg,#0a1628,#0f2d1e)', budget: '₹ 210 Cr', workers: 66, days: 310 },
  { id: 4, name: 'Metro Station Ext.', location: 'Andheri, Mumbai', status: 'planning', progress: 8, emoji: '🚇', gradient: 'linear-gradient(135deg,#1a0a2e,#2e0a1e)', budget: '₹ 90 Cr', workers: 12, days: null },
];

const progressColors = { active: 'linear-gradient(90deg,#f59e0b,#fbbf24)', planning: 'linear-gradient(90deg,#3b82f6,#60a5fa)', completed: 'linear-gradient(90deg,#10b981,#34d399)' };

function renderProjects(list) {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = list.map(p => `
    <div class="project-card" onclick="showToast('Opening ${p.name}...','success')">
      <div class="project-thumb">
        <div class="project-thumb-bg" style="background:${p.gradient}">${p.emoji}</div>
        <span class="project-status-badge ${p.status}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
      </div>
      <div class="project-body">
        <div class="project-name">${p.name}</div>
        <div class="project-location">📍 ${p.location}</div>
        <div class="project-progress-label"><span>Progress</span><span>${p.progress}%</span></div>
        <div class="project-progress-bar"><div class="project-progress-fill" style="width:${p.progress}%;background:${progressColors[p.status]}"></div></div>
        <div class="project-meta">
          <span class="proj-meta-item">💰 ${p.budget}</span>
          <span class="proj-meta-item">👷 ${p.workers} workers</span>
          ${p.days ? `<span class="proj-meta-item">📅 ${p.days}d left</span>` : '<span class="proj-meta-item">🗓 Planning</span>'}
        </div>
      </div>
    </div>
  `).join('');
}

function initProjects() {
  renderProjects(PROJECTS);
  document.getElementById('projectFilter').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderProjects(PROJECTS.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)));
  });
  document.getElementById('projectStatus').addEventListener('change', e => {
    const s = e.target.value;
    renderProjects(!s ? PROJECTS : PROJECTS.filter(p => p.status === s));
  });
  document.getElementById('addProjectBtn').addEventListener('click', () => showToast('New project dialog coming soon!', 'warn'));
}

/* ════════════════════════════════════════════════
   AI VISION PAGE
════════════════════════════════════════════════ */
let visionInited = false;
let visionAnimFrame;

function initVision() {
  if (visionInited) return;
  visionInited = true;

  // Draw construction site background on canvas
  const canvas = document.getElementById('visionCanvas');
  const ctx = canvas.getContext('2d');

  function drawSiteFrame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#0a0c10');
    sky.addColorStop(1, '#141824');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#1a1412';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height);

    // Building structure
    ctx.fillStyle = '#1e2230';
    ctx.fillRect(400, 60, 180, 300);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 4; c++) {
        const lit = Math.random() > 0.6;
        ctx.fillStyle = lit ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(410 + c * 40, 75 + r * 35, 25, 22);
      }
    }

    // Crane
    ctx.strokeStyle = '#2d3548';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(620, 360); ctx.lineTo(620, 50); ctx.stroke();
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(560, 55); ctx.lineTo(720, 55); ctx.stroke();
    ctx.strokeStyle = 'rgba(245,158,11,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(700, 55); ctx.lineTo(700 + Math.sin(t * 0.5) * 8, 200); ctx.stroke();
    ctx.setLineDash([]);

    // Scaffolding
    ctx.strokeStyle = '#2a3040';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(50 + i * 30, 100); ctx.lineTo(50 + i * 30, 330); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(50, 100 + i * 40); ctx.lineTo(230, 100 + i * 40); ctx.stroke();
    }

    // Ground vehicles
    ctx.fillStyle = '#2a3248';
    ctx.fillRect(80, 330, 120, 50);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(90, 310, 60, 25);

    // Moving worker (simple figure)
    const wx = 150 + Math.sin(t * 0.3) * 20;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(wx, 270, 8, 0, Math.PI * 2); ctx.fill(); // hard hat
    ctx.fillStyle = '#e8eaf0';
    ctx.fillRect(wx - 5, 278, 10, 20);

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.arc(300, 285, 8, 0, Math.PI * 2); ctx.fill(); // no hat
    ctx.fillStyle = '#e8eaf0';
    ctx.fillRect(295, 293, 10, 20);

    // Timestamp
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px monospace';
    ctx.fillText(`REC ● ${new Date().toLocaleTimeString()} | SITE-C CAM-2`, 12, 20);
  }

  let t = 0;
  function animate() {
    drawSiteFrame(t);
    t += 0.05;
    visionAnimFrame = requestAnimationFrame(animate);
  }
  animate();

  // PPE chart
  const ppeCtx = document.getElementById('ppeChart').getContext('2d');
  new Chart(ppeCtx, {
    type: 'bar',
    data: {
      labels: ['Hard Hat', 'Vest', 'Gloves', 'Boots'],
      datasets: [{ data: [88, 92, 75, 95], backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#10b981'], borderRadius: 6 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8b95a8', font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8', font: { size: 10 } }, max: 100 }
      }
    }
  });

  // Detection log
  const logItems = [
    'Worker ✓ Hard Hat (98.2%)', 'Worker ✗ No Hard Hat (96.5%)',
    'Excavator detected (99.1%)', 'Worker ✓ Safety Vest (94%)',
    'Danger zone entry (91.3%)',
  ];
  const log = document.getElementById('detLog');
  logItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'det-log-item';
    el.innerHTML = `<span>${item}</span><span class="det-log-time">${new Date().toLocaleTimeString()}</span>`;
    log.appendChild(el);
  });

  // Animate HUD
  setInterval(() => {
    document.getElementById('fpsVal').textContent = Math.floor(26 + Math.random() * 4);
    document.getElementById('detCount').textContent = Math.floor(2 + Math.random() * 3);
  }, 1800);
}

/* ════════════════════════════════════════════════
   DOCUMENT INTELLIGENCE PAGE
════════════════════════════════════════════════ */
const DOCS = [
  { name: 'Site Blueprint v3.dwg', type: '📐', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', size: '8.4 MB', date: 'Oct 23', tags: ['Blueprint', 'CAD', 'Structural'] },
  { name: 'Contract_Rev4.pdf', type: '📄', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', size: '2.1 MB', date: 'Oct 21', tags: ['Contract', 'Legal', 'Risk'] },
  { name: 'Safety_Compliance.docx', type: '🛡️', color: '#10b981', bg: 'rgba(16,185,129,0.12)', size: '1.3 MB', date: 'Oct 19', tags: ['Safety', 'Compliance'] },
  { name: 'Material_BOM.csv', type: '📊', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', size: '0.6 MB', date: 'Oct 18', tags: ['BOM', 'Materials'] },
  { name: 'Foundation_Report.pdf', type: '🏗️', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', size: '5.2 MB', date: 'Oct 15', tags: ['Report', 'Geotechnical'] },
  { name: 'Progress_Oct2026.pptx', type: '📋', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', size: '3.8 MB', date: 'Oct 25', tags: ['Report', 'Monthly'] },
];

const DOC_ANALYSES = {
  'Contract_Rev4.pdf': {
    summary: `<p><strong>AI Summary:</strong> This contract (Rev 4) covers the civil construction scope for Skyline Tower Phase II. Key clauses include a <span style="color:var(--red)">penalty clause</span> of ₹5L/day for delays beyond 15 days, IP ownership of designs retained by client, and mandatory ICC arbitration for disputes above ₹50L.</p><br/><p>Identified <strong style="color:var(--red)">3 high-risk clauses</strong> and <strong style="color:var(--amber)">5 medium-risk clauses</strong> for legal review.</p>`,
    entities: `<table style="width:100%;border-collapse:collapse;font-size:0.82rem"><tr style="border-bottom:1px solid var(--border)"><th style="text-align:left;padding:6px;color:var(--text2)">Entity</th><th style="text-align:left;padding:6px;color:var(--text2)">Value</th></tr><tr><td style="padding:6px">Client</td><td style="padding:6px">Mumbai Metro Developers Ltd.</td></tr><tr><td style="padding:6px">Contractor</td><td style="padding:6px">BuildCo Infra Pvt. Ltd.</td></tr><tr><td style="padding:6px">Value</td><td style="padding:6px">₹ 480 Crore</td></tr><tr><td style="padding:6px">Duration</td><td style="padding:6px">36 months from Oct 2025</td></tr><tr><td style="padding:6px">Arbitration Seat</td><td style="padding:6px">Mumbai, India (ICC)</td></tr></table>`,
    clauses: `<ul style="list-style:none;display:flex;flex-direction:column;gap:8px"><li style="padding:8px 10px;background:var(--red-dim);border-radius:8px;border-left:3px solid var(--red)">⚠ <strong>Clause 12.4 — Delay Penalty:</strong> ₹5 Lakh/day after 15-day grace period. No cap defined.</li><li style="padding:8px 10px;background:var(--amber-dim);border-radius:8px;border-left:3px solid var(--amber)">⚠ <strong>Clause 18.2 — Force Majeure:</strong> Does not explicitly cover pandemic/lockdown scenarios.</li><li style="padding:8px 10px;background:var(--amber-dim);border-radius:8px;border-left:3px solid var(--amber)">⚠ <strong>Clause 9.1 — IP Ownership:</strong> All design IP passes to client upon first payment.</li></ul>`,
  },
  default: {
    summary: `<p><strong>AI Summary:</strong> Document processed successfully. Extracted <strong>47 entities</strong>, <strong>12 tables</strong>, and <strong>3 diagrams</strong>. No high-risk clauses detected. Content classified as <span style="color:var(--green)">Low Risk</span>.</p><br/><p>AI Confidence: <strong style="color:var(--green)">94.3%</strong></p>`,
    entities: `<p style="color:var(--text2)">No significant named entities requiring review found in this document.</p>`,
    clauses: `<p style="color:var(--green)">✓ No risk clauses identified in this document.</p>`,
  }
};

function initDocuments() {
  const grid = document.getElementById('docGrid');
  grid.innerHTML = DOCS.map(d => `
    <div class="doc-card" onclick="openDocAnalysis('${d.name}')">
      <div class="doc-type-icon" style="background:${d.bg};color:${d.color}">${d.type}</div>
      <div class="doc-name">${d.name}</div>
      <div class="doc-meta">${d.size} · ${d.date}</div>
      <div class="doc-tags">${d.tags.map(t => `<span class="doc-tag">${t}</span>`).join('')}</div>
    </div>
  `).join('');

  // Upload zone
  const zone = document.getElementById('dropZone');
  zone.addEventListener('click', () => document.getElementById('docFileInput').click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    showToast(`Uploaded ${e.dataTransfer.files.length} file(s) — AI analysis starting...`, 'success');
  });
  document.getElementById('docFileInput').addEventListener('change', e => {
    if (e.target.files.length) showToast(`Uploaded ${e.target.files.length} file(s) — AI analyzing...`, 'success');
  });

  // DA tabs
  document.querySelectorAll('.da-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const docName = document.getElementById('daTitle').textContent;
      document.querySelectorAll('.da-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDocTab(tab.dataset.tab, docName);
    });
  });
}

function openDocAnalysis(name) {
  const panel = document.getElementById('docAnalysis');
  document.getElementById('daTitle').textContent = name;
  panel.style.display = 'block';
  document.querySelectorAll('.da-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  renderDocTab('summary', name);
  panel.scrollIntoView({ behavior: 'smooth' });
  showToast(`AI analyzing: ${name}`, 'success');
}

function renderDocTab(tab, name) {
  const data = DOC_ANALYSES[name] || DOC_ANALYSES.default;
  document.getElementById('daBody').innerHTML = data[tab] || data.summary;
}

/* ════════════════════════════════════════════════
   SENSOR ANALYTICS PAGE
════════════════════════════════════════════════ */
let sensorChartInst, anomalyChartInst, sensorInited = false;
const sensorHistory = { labels: [], crane: [], air: [], vib: [], noise: [] };
for (let i = 29; i >= 0; i--) {
  const d = new Date(); d.setSeconds(d.getSeconds() - i * 2);
  sensorHistory.labels.push(d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  sensorHistory.crane.push(+(10 + Math.random() * 5).toFixed(1));
  sensorHistory.air.push(+(40 + Math.random() * 20).toFixed(0));
  sensorHistory.vib.push(+(1 + Math.random() * 2).toFixed(2));
  sensorHistory.noise.push(+(80 + Math.random() * 20).toFixed(0));
}

function initSensors() {
  if (sensorInited) return;
  sensorInited = true;

  const sCtx = document.getElementById('sensorChart').getContext('2d');
  sensorChartInst = new Chart(sCtx, {
    type: 'line',
    data: {
      labels: sensorHistory.labels,
      datasets: [
        { label: 'Crane Load (T)', data: sensorHistory.crane, borderColor: '#f59e0b', tension: 0.4, borderWidth: 2, pointRadius: 0, fill: false },
        { label: 'Air Quality (PM2.5)', data: sensorHistory.air, borderColor: '#3b82f6', tension: 0.4, borderWidth: 2, pointRadius: 0, fill: false },
        { label: 'Noise (dB)', data: sensorHistory.noise, borderColor: '#ef4444', tension: 0.4, borderWidth: 2, pointRadius: 0, fill: false },
      ]
    },
    options: {
      responsive: true, animation: false,
      plugins: { legend: { labels: { color: '#8b95a8', font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8b95a8', maxTicksLimit: 6, font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' } }
      }
    }
  });

  const aCtx = document.getElementById('anomalyChart').getContext('2d');
  anomalyChartInst = new Chart(aCtx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Anomalies',
        data: Array.from({ length: 20 }, (_, i) => ({ x: i, y: +(Math.random() * 100).toFixed(1) })),
        backgroundColor: d => d.raw && d.raw.y > 80 ? '#ef4444' : '#3b82f6',
        pointRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' } }
      }
    }
  });

  // Live sensor update
  setInterval(updateSensors, 2000);
}

function updateSensors() {
  const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const crane = +(10 + Math.random() * 5).toFixed(1);
  const air = +(40 + Math.random() * 20).toFixed(0);
  const vib = +(1 + Math.random() * 2).toFixed(2);
  const noise = +(80 + Math.random() * 20).toFixed(0);
  const temp = +(32 + Math.random() * 4).toFixed(1);

  document.getElementById('sv1').textContent = crane + ' T';
  document.getElementById('sv2').textContent = air + ' µg/m³';
  document.getElementById('sv3').textContent = vib + ' mm/s';
  document.getElementById('sv4').textContent = temp + ' °C';
  document.getElementById('sv5').textContent = noise + ' dB';
  document.getElementById('sv5').className = 'ss-val' + (noise > 88 ? ' warn' : '');

  sensorHistory.labels.push(now); sensorHistory.crane.push(crane);
  sensorHistory.air.push(air); sensorHistory.noise.push(noise);
  if (sensorHistory.labels.length > 30) {
    ['labels', 'crane', 'air', 'noise'].forEach(k => sensorHistory[k].shift());
  }
  sensorChartInst.data.labels = sensorHistory.labels;
  sensorChartInst.data.datasets[0].data = sensorHistory.crane;
  sensorChartInst.data.datasets[1].data = sensorHistory.air;
  sensorChartInst.data.datasets[2].data = sensorHistory.noise;
  sensorChartInst.update();
}

/* ════════════════════════════════════════════════
   SAFETY PAGE
════════════════════════════════════════════════ */
let safetyInited = false;

function initSafety() {
  if (safetyInited) return;
  safetyInited = true;

  const alerts = [
    { sev: 'critical', cls: 'critical', title: 'Worker Without Hard Hat — Site C Gate 2', desc: 'AI Vision detected 2 workers in active zone without mandatory PPE. Auto-alert sent to site supervisor.', time: '5 min ago' },
    { sev: 'HIGH', cls: 'high', title: 'Noise Level Exceeded Safety Limit — Site D Zone 2', desc: 'Noise sensor recorded 92 dB for >15 min. OSHA limit is 90 dB for 8-hour exposure.', time: '12 min ago' },
    { sev: 'HIGH', cls: 'high', title: 'Unauthorized Zone Entry Detected — Site A Excavation', desc: 'Motion sensor + camera confirm entry into restricted excavation zone by non-authorized personnel.', time: '28 min ago' },
    { sev: 'MEDIUM', cls: 'medium', title: 'Air Quality Warning — PM2.5 at 68 µg/m³ — Site B', desc: 'PM2.5 exceeded WHO guideline of 55 µg/m³. Recommend dust suppression measures.', time: '45 min ago' },
  ];

  document.getElementById('safetyAlerts').innerHTML = alerts.map(a => `
    <div class="alert-card ${a.cls}">
      <span class="alert-sev">${a.sev}</span>
      <div class="alert-content">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
      <span class="alert-time">${a.time}</span>
      <button class="alert-action" onclick="showToast('Alert acknowledged','success')">Acknowledge</button>
    </div>
  `).join('');

  // Incident trend chart
  const iCtx = document.getElementById('incidentChart').getContext('2d');
  new Chart(iCtx, {
    type: 'line',
    data: {
      labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      datasets: [
        { label: 'Near Misses', data: [8, 6, 9, 5, 4, 3, 5, 4], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', fill: true, tension: 0.4, borderWidth: 2 },
        { label: 'Incidents', data: [3, 2, 4, 1, 2, 1, 1, 0], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, borderWidth: 2 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8b95a8', font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8b95a8' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' } }
      }
    }
  });

  // Hazard chart
  const hCtx = document.getElementById('hazardChart').getContext('2d');
  new Chart(hCtx, {
    type: 'polarArea',
    data: {
      labels: ['PPE', 'Fall Risk', 'Machinery', 'Electrical', 'Chemical'],
      datasets: [{ data: [35, 25, 20, 12, 8], backgroundColor: ['#f59e0b88', '#ef444488', '#3b82f688', '#8b5cf688', '#10b98188'], borderWidth: 0 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#8b95a8', font: { size: 10 }, padding: 8 } } }
    }
  });

  // Safety team
  const team = [
    { init: 'RK', name: 'Rajesh Kumar', role: 'Safety Officer', color: '#f59e0b', status: 'on' },
    { init: 'PM', name: 'Priya M.', role: 'HSE Lead', color: '#10b981', status: 'on' },
    { init: 'AS', name: 'Amit Singh', role: 'Site Inspector', color: '#3b82f6', status: 'on' },
    { init: 'DT', name: 'Divya Thomas', role: 'Risk Analyst', color: '#8b5cf6', status: 'off' },
  ];
  const st = document.getElementById('safetyTeam');
  st.innerHTML = `<div class="card-header"><h3>Safety Team</h3></div><div class="team-grid">${team.map(m => `<div class="team-card"><div class="team-avatar" style="background:${m.color}">${m.init}</div><div class="team-name">${m.name}</div><div class="team-role">${m.role}</div><span class="team-status ${m.status}">${m.status === 'on' ? '● On Site' : '○ Off Site'}</span></div>`).join('')}</div>`;
}

/* ════════════════════════════════════════════════
   REPORTS PAGE
════════════════════════════════════════════════ */
let reportsInited = false;

function initReports() {
  if (reportsInited) return;
  reportsInited = true;

  const insights = [
    { tag: 'vision', label: '👁 AI Vision', title: 'PPE Compliance Improved 8.3%', body: 'Over the last 7 days, hard hat compliance rose from 81% to 88% following automated alerts and team briefings on Site C.' },
    { tag: 'sensor', label: '📡 Sensors', title: 'Crane Load Anomaly Risk Detected', body: 'Crane 2 exceeded 90% rated load capacity 3× this week. Predictive model flags 14% probability of mechanical fault within 30 days.' },
    { tag: 'doc', label: '📄 Documents', title: 'Contract Risk: Delay Clause Exposure', body: 'AI flagged uncapped delay penalty in Contract Rev 4. Current schedule variance projects ₹2.1 Cr potential liability if delays continue.' },
    { tag: 'risk', label: '⚠ Risk AI', title: 'Weather-Induced Schedule Risk', body: 'Monsoon forecast models indicate 11-day delay risk for Harbor Bridge pile work. Recommend pre-emptive schedule buffer of 14 days.' },
    { tag: 'vision', label: '👁 AI Vision', title: 'Machinery Utilization at 74%', body: 'Excavator fleet utilization averages 74% vs. 85% target. Computer vision tracking suggests idle windows of 2–3 hrs daily on Site A.' },
    { tag: 'sensor', label: '📡 Sensors', title: 'Air Quality Improving — Site B', body: 'PM2.5 dropped from avg 68 to 52 µg/m³ after dust suppression protocols were activated 3 days ago. Trend positive.' },
  ];

  document.getElementById('insightsGrid').innerHTML = insights.map(i => `
    <div class="insight-card">
      <span class="insight-tag ${i.tag}">${i.label}</span>
      <div class="insight-title">${i.title}</div>
      <div class="insight-body">${i.body}</div>
      <div class="insight-footer">
        <span class="insight-conf">Confidence: <span>${(88 + Math.random() * 10).toFixed(1)}%</span></span>
        <button class="btn-ghost small" onclick="showToast('Insight saved to report','success')">Save</button>
      </div>
    </div>
  `).join('');

  const rCtx = document.getElementById('reportChart').getContext('2d');
  new Chart(rCtx, {
    type: 'line',
    data: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        { label: 'Productivity Index', data: [72, 75, 74, 79, 82, 80, 85], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', fill: true, tension: 0.4, borderWidth: 2, yAxisID: 'y' },
        { label: 'Safety Score', data: [78, 80, 79, 82, 85, 84, 87], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, borderWidth: 2, yAxisID: 'y' },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8b95a8', font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8b95a8' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8b95a8' }, min: 60, max: 100 }
      }
    }
  });

  document.getElementById('genReportBtn').addEventListener('click', () => {
    showToast('Generating full AI report — PDF will be ready in 30s', 'success');
  });
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initProgressChart();
  initSafetyChart();
  seedEventFeed();
  startLiveFeed();
  animateCounters();
  initProjects();
  initDocuments();

  // Hero counter animation
  let count = 0;
  const int = setInterval(() => {
    count++;
    document.getElementById('hs-events').textContent = (1200 + count * 7).toLocaleString();
    if (count > 12) clearInterval(int);
  }, 100);

  // Show welcome toast
  setTimeout(() => showToast('ConstructIQ Platform loaded — All systems operational', 'success'), 800);
});
