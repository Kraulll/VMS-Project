import React, { useState } from 'react';
import { money } from '../api.js';

const statusLabels = {
  requested: 'Waiting for a mechanic’s quote', quoted: 'Your estimate is ready',
  enroute: 'On the way · Demo ETA 8 min', arrived: 'Your mechanic has arrived',
  working: 'Service is in progress', done: 'Ready to get back on the road?',
  completed: 'You’re all set.', canceled: 'Request canceled'
};

export default function JobCard({ job, role, services, onAction, busy, onContact, onNew }) {
  const [confirmed, setConfirmed] = useState(false);
  const [rating, setRating] = useState(5);
  const service = services.find(item => item.id === job.serviceId);
  const quote = job.quote;
  function sendQuote(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onAction('quote', { labor: Number(data.get('labor')), parts: Number(data.get('parts')) });
  }
  const nextActions = { enroute: ['arrive', 'Mark arrival'], arrived: ['start', 'Start service'], working: ['finish', 'Mark service finished'] };
  return <>
    <div className="eyebrow">{job.mode === 'home' ? 'AT-HOME SERVICE' : 'ROADSIDE ASSISTANCE'} · #{job.id.slice(0, 6)}</div>
    <h2 style={{ marginTop: 12 }}>{job.service}</h2><p className="sub">{job.vehicle}</p>
    <div className="status"><h3>⌖ {job.location}</h3><p>{job.issue}</p></div>
    <h3>{statusLabels[job.status]}</h3>
    {job.status === 'requested' && role === 'mechanic' && <>
      <p className="sub">Demo distance: {job.distance} miles · Travel: {money(Math.round(job.distance * 500))}</p>
      <form onSubmit={sendQuote}>
        <label className="label" htmlFor="labor">Labor / service ($)</label>
        <input id="labor" name="labor" type="number" min="0" max="10000" step="0.01" required defaultValue={service?.labor || 65} />
        <label className="label" htmlFor="parts">Parts ($)</label>
        <input id="parts" name="parts" type="number" min="0" max="10000" step="0.01" required defaultValue={job.serviceId === 'battery' ? 110 : 0} />
        <button className="primary" disabled={busy}>Send estimate <span>→</span></button>
      </form>
    </>}
    {quote && <>
      <div className="mechanic"><div className="avatar">MR</div><div><h3>Marcus Rivera</h3><p>★ 4.9 · Your demo mechanic</p></div></div>
      {[['Labor / service', quote.laborCents], ['Parts', quote.partsCents], ['Travel', quote.travelCents]].map(([name, cost]) =>
        <div className="row" key={name}><span>{name}</span><b>{money(cost)}</b></div>)}
      <div className="row total"><span>{job.status === 'quoted' ? 'Proposed total' : 'Agreed service total'}</span><b>{money(quote.totalCents)}</b></div>
    </>}
    {!['completed', 'canceled'].includes(job.status) && <div className="actions">
      <button className="secondary" onClick={() => onContact('Phone consultation')}>Call {role === 'driver' ? 'mechanic' : 'driver'}</button>
      <button className="secondary" onClick={() => onContact('Video consultation')}>Video consult</button>
    </div>}
    {role === 'driver' && job.status === 'quoted' && <button className="primary" disabled={busy} onClick={() => onAction('accept')}>Accept quote & book <span>→</span></button>}
    {role === 'mechanic' && nextActions[job.status] && <button className="primary" disabled={busy} onClick={() => onAction(nextActions[job.status][0])}>{nextActions[job.status][1]} <span>→</span></button>}
    {role === 'driver' && job.status === 'done' && <>
      <p className="sub">Confirm the agreed work is complete before the simulated payment.</p>
      <label className="confirmation"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />My vehicle is running and the service is complete.</label>
      <label className="label" htmlFor="rating">Rate your service</label>
      <select id="rating" value={rating} onChange={event => setRating(Number(event.target.value))}>
        {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} stars</option>)}
      </select>
      <button className="primary" disabled={busy || !confirmed} onClick={() => onAction('complete', { confirmed, rating })}>Complete demo payment <span>{money(quote.totalCents)}</span></button>
      <button className="secondary full" onClick={() => onContact('Service needs attention')}>Service isn’t resolved yet</button>
    </>}
    {role === 'driver' && ['requested', 'quoted'].includes(job.status) && <button className="secondary full" disabled={busy} onClick={() => onAction('cancel')}>Cancel request</button>}
    {['completed', 'canceled'].includes(job.status) ? <>
      <p className="sub">{job.status === 'completed' ? 'Demo receipt saved in My services. No real charge.' : 'No demo charge.'}</p>
      <button className="primary" onClick={onNew}>Request another service <span>→</span></button>
    </> : <div className="hint">Switch between Driver and Mechanic to act out both sides. Roles are demo controls, not real user accounts.</div>}
  </>;
}
