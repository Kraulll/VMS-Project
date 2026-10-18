import React, { useEffect, useState } from 'react';
import { api, money } from './api.js';
import RequestForm from './components/RequestForm.jsx';
import JobCard from './components/JobCard.jsx';
import MapPanel from './components/MapPanel.jsx';

export default function App() {
  const [role, setRole] = useState('driver');
  const [view, setView] = useState('request');
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [storage, setStorage] = useState('');
  const [dialog, setDialog] = useState(null);
  const job = jobs.find(item => item.id === selectedId);

  async function refresh(initial = false) {
    const records = await api('/jobs');
    setJobs(records);
    if (initial) setSelectedId(records.find(item => !['completed', 'canceled'].includes(item.status))?.id || null);
  }
  useEffect(() => {
    // Establish the HTTP-only session cookie before fetching this browser's jobs.
    async function load() {
      try {
        const health = await api('/health');
        setStorage(health.storage);
        setServices(await api('/services'));
        await refresh(true);
      } catch (failure) { setError(failure.message); }
      finally { setBusy(false); }
    }
    load();
  }, []);

  async function perform(path, method, body) {
    setBusy(true); setError('');
    try {
      const updated = await api(path, { method, headers: { 'X-Demo-Role': role }, body: JSON.stringify(body) });
      setSelectedId(updated.id);
      await refresh();
    } catch (failure) {
      setError(failure.message);
      try { await refresh(); } catch { /* Preserve the original, useful error. */ }
    } finally { setBusy(false); }
  }
  function contact(title) {
    setDialog({ title, message: title === 'Service needs attention'
      ? 'Payment stays pending. In a live service, contact the mechanic to resolve the issue before confirming completion.'
      : 'This consultation is simulated. No camera, microphone, telephone call, or FaceTime connection is started.' });
  }
  return <>
    <header>
      <div className="brand"><span className="brandmark">↗</span>vms<span className="brand-caption">VEHICLE MOBILE<br />SERVICE</span></div>
      <nav aria-label="Main navigation">{[['request', 'Get assistance'], ['history', 'My services'], ['how', 'How it works']].map(([key, label]) =>
        <button key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)}>{label}</button>)}</nav>
      <div className="role" aria-label="Demo role">{['driver', 'mechanic'].map(value => <button key={value}
        className={role === value ? 'active' : ''} aria-pressed={role === value} onClick={() => setRole(value)}>{value === 'driver' ? 'Driver' : 'Mechanic'}</button>)}</div>
    </header>
    <main className="wrap">
      <div className="top"><div><div className="eyebrow">{role === 'driver' ? 'A LITTLE CAR TROUBLE. A LOT LESS STRESS.' : 'THE MOBILE MECHANIC WORKSPACE'}</div>
        <h1>{role === 'driver' ? 'Help is around the corner.' : 'Your skills. Their way forward.'}</h1>
        <p>{role === 'driver' ? 'Local mechanics. Upfront prices. Right where you are.' : 'Review requests, set your quote, and get on the road.'}</p>
      </div><div className="pill"><span className="dot" />Full-stack capstone demo</div></div>
      <div className="storage-note">{storage === 'mongodb' ? 'MongoDB storage connected' : storage === 'memory' ? 'Demo memory storage · resets when the server restarts' : 'Connecting to the API…'}</div>
      {error && <div className="error" role="alert">{error}<button className="secondary" onClick={() => window.location.reload()}>Reload</button></div>}
      {view === 'request' && <div className="grid"><section className="card panel" aria-busy={busy}>
        {busy && !services.length ? <p role="status">Loading services…</p> : job ?
          <JobCard key={job.id} job={job} role={role} services={services} busy={busy} onContact={contact} onNew={() => setSelectedId(null)}
            onAction={(action, data = {}) => perform(`/jobs/${job.id}/${action}`, 'PATCH', { ...data, version: job.version })} /> :
          role === 'driver' ? <RequestForm services={services} busy={busy} onSubmit={data => perform('/jobs', 'POST', data)} /> :
          <><h2>Your request board</h2><p className="sub">Demo requests from this browser session.</p>
            {jobs.filter(item => !['completed', 'canceled'].includes(item.status)).map(item => <button className="secondary full" key={item.id} onClick={() => setSelectedId(item.id)}>{item.service} · {item.vehicle}</button>)}
            {!jobs.some(item => !['completed', 'canceled'].includes(item.status)) && <p className="hint">No active requests. Switch to Driver to create one.</p>}</>}
      </section><MapPanel job={job} /></div>}
      {view === 'history' && <section className="card panel"><div className="nearhead"><h2>My services</h2><button className="secondary" disabled={busy} onClick={async () => { try { await refresh(); setError(''); } catch (failure) { setError(failure.message); } }}>Refresh</button></div>
        {!jobs.length && <p className="empty">Your service requests will appear here.</p>}
        {jobs.map(item => <div className="mechanic" key={item.id}><div className="avatar">{item.status === 'completed' ? '✓' : '↗'}</div>
          <div><h3>{item.service}</h3><p>{item.vehicle} · {item.status} {item.rating ? `· ${item.rating}/5 stars` : ''}</p></div>
          <div className="right">{item.quote && money(item.quote.totalCents)}<small>{item.payment === 'simulated' ? 'Demo payment completed' : 'No payment completed'}</small>
            <button className="secondary" onClick={() => { setSelectedId(item.id); setView('request'); }}>View request</button></div>
        </div>)}
      </section>}
      {view === 'how' && <section className="card panel"><h2>A mechanic, right where you need one.</h2><div className="timeline">
        {['Tell us about your vehicle, location, and issue.', 'The mechanic reviews the request and sends a quote.', 'Discuss the issue and agree on the price.', 'Follow arrival and service progress.', 'Confirm the fix, rate the service, and complete demo payment.'].map((step, i) => <div key={step}>0{i + 1} · {step}</div>)}
        </div><p>This React app calls a Node/Express REST API. Use the role switch to act out both sides within your browser session. MongoDB can persist requests; the default memory store resets with the server. Maps, mechanics, distances, calls, and payments are simulations.</p>
        <button className="primary" onClick={() => setView('request')}>Try the experience <span>→</span></button></section>}
      <div className="benefits">{[['✓', 'Know who’s on the way', 'View profiles, experience, and reviews.'], ['＄', 'Agree before they arrive', 'Review the quote before booking.'], ['↗', 'Back to your day', 'Confirm the fix, then complete payment.']].map(([icon, title, detail]) =>
        <div className="benefit" key={title}><span className="ico">{icon}</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div>
      <footer><span>© 2026 VMS · Vehicle Mobile Service</span><span>Demo roles · Simulated matching, location, calls & payments</span></footer>
    </main>
    {dialog && <ConsultationDialog dialog={dialog} onClose={() => setDialog(null)} />}
  </>;
}

function ConsultationDialog({ dialog, onClose }) {
  const ref = React.useRef(null);
  useEffect(() => { ref.current.showModal(); }, []);
  return <dialog ref={ref} onCancel={onClose} aria-labelledby="consultation-title">
    <h2 id="consultation-title">{dialog.title}</h2><p>{dialog.message}</p>
    <button className="primary" autoFocus onClick={onClose}>Got it <span>×</span></button>
  </dialog>;
}
