import React, { useState } from 'react';

export default function MapPanel({ job }) {
  const [zoom, setZoom] = useState(1);
  return <aside className="card">
    <div className="map">
      <svg viewBox="0 0 700 410" preserveAspectRatio="xMidYMid slice" role="img"
        aria-label="Illustrative neighborhood map, not live GPS" style={{ transform: `scale(${zoom})` }}>
        <defs><pattern id="blocks" width="110" height="80" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse">
          <rect width="110" height="80" fill="#e9eee3" /><rect x="8" y="9" width="88" height="58" rx="5" fill="#e0e7d9" />
          <path d="M0 0H110M0 0V80" fill="none" stroke="#fbfcf8" strokeWidth="9" />
        </pattern></defs>
        <rect width="700" height="410" fill="url(#blocks)" />
        <path d="M550 -20 Q470 100 550 205T550 450" stroke="#c8dde0" strokeWidth="52" fill="none" />
        <path d="M-20 280 Q210 190 320 230 T730 160" stroke="#fffdf2" strokeWidth="19" fill="none" />
        <path d="M350 430 Q330 290 290 170T260 -20" stroke="#fffdf2" strokeWidth="16" fill="none" />
        <rect x="70" y="60" width="120" height="88" rx="28" fill="#cfdfbf" />
      </svg>
      <div className="maptag"><span className="dot" />{job?.status === 'enroute' ? 'Marcus is on the way · Demo ETA 8 min' : '3 mechanics nearby · Demo area'}</div>
      <span className="maplabel" style={{ top: '19%', left: '16%' }}>RIVERSIDE PARK</span>
      <span className="maplabel" style={{ top: '77%', left: '28%' }}>DOWNTOWN</span>
      <div className="you" /><div className="pin p1">⚒</div><div className="pin p2">⚒</div><div className="pin p3">⚒</div>
      <div className="mapcontrols">
        <button aria-label="Zoom in" onClick={() => setZoom(Math.min(1.6, zoom + .1))}>+</button>
        <button aria-label="Zoom out" onClick={() => setZoom(Math.max(1, zoom - .1))}>−</button>
      </div>
    </div>
    <div className="nearby"><div className="nearhead"><h3>Your neighborhood, covered.</h3><span>DEMO MECHANICS</span></div>
      {[['MR', 'Marcus Rivera', '4.9 (128)', 'Battery & tire specialist', '8 min', '1.2 miles'],
        ['EC', 'Elena Chen', '4.8 (96)', 'Mobile maintenance', '12 min', '2.4 miles']].map(person =>
        <div className="mechanic" key={person[0]}><div className="avatar">{person[0]}</div>
          <div><h3>{person[1]} ✓</h3><p><span className="star">★</span> {person[2]} · {person[3]}</p></div>
          <div className="right">{person[4]} away<small>{person[5]}</small></div>
        </div>)}
    </div>
  </aside>;
}
