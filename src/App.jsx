import React, { useMemo, useState } from "react";
import { BarChart3, Building2, Search, ShieldCheck, SlidersHorizontal, TrendingUp } from "lucide-react";
import { companies } from "./data/companies";

function money(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency", currency: "ZAR", maximumFractionDigits: 0
  }).format(value);
}

function App() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [selectedId, setSelectedId] = useState(companies[0].id);

  const sectors = ["All", ...new Set(companies.map(c => c.sector))];

  const filtered = useMemo(() => companies.filter(c => {
    const text = `${c.name} ${c.sector} ${c.description}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (sector === "All" || c.sector === sector);
  }), [query, sector]);

  const selected = companies.find(c => c.id === selectedId) || filtered[0] || companies[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">PRIVATE MARKET INTELLIGENCE</div>
          <h1>Investor Intelligence</h1>
          <p>Discover businesses through evidence, analytics and valuation scenarios — not pitch decks alone.</p>
        </div>
        <div className="status"><span className="dot" /> MVP research environment</div>
      </header>

      <main>
        <section className="stats-grid">
          <Stat icon={<Building2 />} label="Companies" value={companies.length} />
          <Stat icon={<TrendingUp />} label="Growth signals" value={companies.filter(c => c.growth >= 20).length} />
          <Stat icon={<ShieldCheck />} label="Evidence tracked" value={`${companies.reduce((a,c) => a+c.verifiedMetrics,0)} metrics`} />
          <Stat icon={<BarChart3 />} label="Valuation models" value="3 scenarios" />
        </section>

        <section className="workspace">
          <aside className="directory">
            <div className="section-head">
              <div>
                <div className="eyebrow">DISCOVERY</div>
                <h2>Find opportunities</h2>
              </div>
              <SlidersHorizontal size={18} />
            </div>
            <label className="search">
              <Search size={17} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search companies..." />
            </label>
            <div className="filters">
              {sectors.map(s => <button key={s} className={sector === s ? "active" : ""} onClick={() => setSector(s)}>{s}</button>)}
            </div>
            <div className="company-list">
              {filtered.map(c => (
                <button key={c.id} className={`company-row ${selected.id === c.id ? "selected" : ""}`} onClick={() => setSelectedId(c.id)}>
                  <div className="company-mark">{c.name.slice(0,1)}</div>
                  <div className="company-copy">
                    <strong>{c.name}</strong>
                    <span>{c.sector} · {c.stage}</span>
                  </div>
                  <div className="match">{c.match}%</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="detail">
            <div className="detail-header">
              <div>
                <div className="eyebrow">COMPANY INTELLIGENCE PROFILE</div>
                <h2>{selected.name}</h2>
                <p>{selected.description}</p>
              </div>
              <div className="match-card"><span>Criteria match</span><strong>{selected.match}%</strong></div>
            </div>

            <div className="metric-grid">
              <Metric label="Annual revenue" value={money(selected.revenue)} note="reported input" />
              <Metric label="Revenue growth" value={`${selected.growth}%`} note="YoY" />
              <Metric label="Active customers" value={selected.customers.toLocaleString()} note="current period" />
              <Metric label="Retention" value={`${selected.retention}%`} note="reported" />
            </div>

            <div className="analysis-grid">
              <Panel title="Evidence coverage">
                {selected.evidence.map(item => (
                  <div className="evidence" key={item.label}>
                    <div className="row"><span>{item.label}</span><strong>{item.status}</strong></div>
                    <div className="bar"><span style={{width: `${item.coverage}%`}} /></div>
                    <small>{item.coverage}% supported</small>
                  </div>
                ))}
              </Panel>

              <Panel title="Valuation scenarios">
                {selected.valuations.map(v => (
                  <div className="valuation" key={v.label}>
                    <div><strong>{v.label}</strong><span>{v.method}</span></div>
                    <b>{money(v.value)}</b>
                  </div>
                ))}
                <p className="disclaimer">Illustrative scenarios only. The model exposes assumptions rather than declaring an objective company value.</p>
              </Panel>
            </div>

            <Panel title="Investor view">
              <div className="investor-grid">
                <Insight label="Traction" value={selected.traction} />
                <Insight label="Efficiency" value={selected.efficiency} />
                <Insight label="Market signal" value={selected.market} />
                <Insight label="Data confidence" value={selected.confidence} />
              </div>
            </Panel>
          </section>
        </section>
      </main>
    </div>
  );
}

function Stat({icon,label,value}) {
  return <div className="stat"><div className="icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
function Metric({label,value,note}) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}
function Panel({title,children}) {
  return <div className="panel"><div className="panel-title">{title}</div>{children}</div>;
}
function Insight({label,value}) {
  return <div className="insight"><span>{label}</span><strong>{value}</strong></div>;
}

export default App;