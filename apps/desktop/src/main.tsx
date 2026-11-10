import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { NexusAPI, Snapshot } from '../../../packages/contracts';
import './style.css';
declare global { interface Window { nexus: NexusAPI } }
function Home() {
  const [sample, setSample] = useState<Snapshot>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    async function refresh() { try { const next = await window.nexus.snapshot(); if (active) { setSample(next); setError(false); } } catch { if (active) setError(true); } }
    void refresh(); const timer = setInterval(refresh, 1000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const ram = sample ? sample.memoryUsed / sample.memoryTotal * 100 : 0;
  return <main><aside><div className="brand">◈ NEXUS</div><div className="selected">⌂ &nbsp; Home</div><p className="sidebar-note">Your space.<br/>A little more considered.</p><small>FOUNDATION · 0.1</small></aside><section><header><span>PERSONAL WORKSPACE</span><span>{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span></header><div className="hero"><div className="eyebrow">WELCOME HOME</div><h1>Room to focus.</h1><p>A clear view of your workspace, and the system behind it.</p><div className="orb" aria-hidden="true"/></div><div className="section-heading"><h2>System at a glance</h2><span role="status">{error ? 'Connection unavailable' : sample ? `Live · ${sample.platform === 'darwin' ? 'macOS' : sample.platform}` : 'Connecting…'}</span></div><div className="cards"><article><div className="label">PROCESSOR <span>CPU</span></div><h3>{error || sample?.cpuPercent == null ? '—' : sample.cpuPercent.toFixed(1)}<em>%</em></h3><progress aria-label="CPU usage" max="100" value={error ? 0 : sample?.cpuPercent ?? 0}/><p>System-wide utilization</p></article><article><div className="label">MEMORY <span>RAM</span></div><h3>{error || !sample ? '—' : (sample.memoryUsed / 1073741824).toFixed(1)}<em>GiB</em></h3><progress aria-label="Memory usage" max="100" value={error ? 0 : ram}/><p>{sample ? `${(sample.memoryTotal / 1073741824).toFixed(1)} GiB installed · OS-reported usage` : 'Waiting for system data'}</p></article></div><footer>Designed for a calmer desktop.<span>Updated every second</span></footer></section></main>;
}
createRoot(document.getElementById('root')!).render(<Home/>);
