import React, { useState } from 'react';

export default function RequestForm({ services, onSubmit, busy }) {
  const [mode, setMode] = useState('roadside');
  const [serviceId, setServiceId] = useState('battery');
  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    onSubmit({ mode, serviceId, location: fields.get('location'), vehicle: fields.get('vehicle'), issue: fields.get('issue') });
  }
  return <>
    <div className="stepbar"><span className="on" /><span /><span /><span /></div>
    <h2>Let’s get you moving.</h2>
    <p className="sub">Tell us what you need. We’ll take it from here.</p>
    <div className="tabs">{['roadside', 'home'].map(value =>
      <button key={value} className={mode === value ? 'active' : ''} onClick={() => setMode(value)}>
        {value === 'roadside' ? '↗ Roadside assistance' : '⌂ At-home service'}
      </button>)}</div>
    <form onSubmit={submit}>
      <label className="label" htmlFor="location">Where do you need us?</label>
      <input id="location" name="location" required maxLength={200} placeholder="Street address or highway & mile marker" />
      <div className="label" id="service-label">What can we help with?</div>
      <div className="services" role="group" aria-labelledby="service-label">
        {services.map(service => <button type="button" key={service.id}
          className={`service ${serviceId === service.id ? 'active' : ''}`}
          aria-pressed={serviceId === service.id} onClick={() => setServiceId(service.id)}>
          <span className="ico">{service.icon}</span><span>{service.name}<small>{service.detail}</small></span>
        </button>)}
      </div>
      <label className="label" htmlFor="vehicle">Your vehicle</label>
      <input id="vehicle" name="vehicle" required maxLength={100} placeholder="e.g. 2018 Honda Civic" />
      <label className="label" htmlFor="issue">Tell us what’s going on</label>
      <textarea id="issue" name="issue" required maxLength={1000} placeholder="Share symptoms and anything a mechanic should know." />
      <button className="primary" disabled={busy || !services.length}>Find nearby mechanics <span>→</span></button>
      <p className="notice">Demo request. No real dispatch or charges.</p>
    </form>
  </>;
}
