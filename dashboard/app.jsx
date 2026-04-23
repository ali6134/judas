const { useEffect, useMemo, useState } = React;

const DATA_URL = "../data/analyzed/ag1-verdicts-2026-04-22.json";

// Column order for the matrix and hero row
const MODELS = ["chatgpt", "perplexity", "google-ai-overview"];
const MODEL_LABEL = {
  "chatgpt": "ChatGPT",
  "perplexity": "Perplexity",
  "google-ai-overview": "Google AI Overview",
};

const CATEGORY_LABELS = {
  founding_year: "Founding year",
  founder: "Founder",
  current_ceo: "Current CEO",
  ceo_change_date: "CEO change date",
  former_name: "Former name",
  monthly_subscription_price_usd: "Monthly subscription (USD)",
  monthly_subscription_price_eur: "Monthly subscription (EUR)",
  one_time_purchase_price_usd: "One-time price (USD)",
  ingredient_count: "Ingredient count",
  current_formula_name: "Current formula name",
  headquarters: "Headquarters",
  company_registration: "Company registration",
  valuation_usd: "Valuation (USD)",
  total_funding_raised_usd: "Total funding (USD)",
  founder_nationality: "Founder nationality",
  primary_certification: "Primary certification",
  money_back_guarantee_days: "Money-back guarantee",
  main_competitors: "Main competitors",
  notable_endorsers: "Notable endorsers",
  other: "Other",
};

const VERDICT_RANK = { hallucinated: 4, false: 3, outdated: 2, unverifiable: 1, correct: 0 };

function HelmetLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-label="Judas">
      <path d="M10 17 C 16 6, 26 3, 32 3 C 38 3, 48 6, 54 17 C 46 14, 38 13, 32 13 C 26 13, 18 14, 10 17 Z" />
      <path d="M12 17 L 12 38 C 12 42, 15 45, 18 46 L 22 47 L 22 55 C 22 58, 24 60, 26 60 L 38 60 C 40 60, 42 58, 42 55 L 42 47 L 46 46 C 49 45, 52 42, 52 38 L 52 17 Z" />
      <path d="M18 25 L 29 25 L 29 29 L 35 29 L 35 25 L 46 25 L 46 30 L 35 30 L 35 44 L 29 44 L 29 30 L 18 30 Z" fill="#0d4f3c" />
    </svg>
  );
}

function Header({ brand, pulledAt }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-badge"><HelmetLogo /></div>
        <div>
          <div className="header-wordmark">Judas</div>
          <div className="header-tagline">What LLMs really say about your brand.</div>
        </div>
      </div>
      <div className="header-controls">
        <span className="pill mono">{brand || "AG1"}</span>
        <span className="pill">{pulledAt || "—"}</span>
      </div>
    </header>
  );
}

function HeroCard({ model, accuracy, totalClaims, discrepancies }) {
  const low = accuracy !== null && accuracy < 70;
  const label = MODEL_LABEL[model] || model;
  return (
    <div className={`hero-card ${low ? "low" : ""}`}>
      {low && <span className="flag-dot" title="Accuracy below 70%" />}
      <div className="model">{label}</div>
      <div className="score">{accuracy === null ? "—" : `${accuracy}%`}</div>
      <div className="meta">
        {totalClaims} claim{totalClaims === 1 ? "" : "s"} checked · {discrepancies} discrepanc{discrepancies === 1 ? "y" : "ies"} found
      </div>
    </div>
  );
}

function HeroRow({ perModel }) {
  return (
    <section className="section">
      <h3 className="section-title">Fact accuracy score — per LLM</h3>
      <div className="hero-grid">
        {MODELS.map((m) => {
          const s = perModel[m] || {};
          return (
            <HeroCard
              key={m}
              model={m}
              accuracy={s.accuracy_pct ?? null}
              totalClaims={s.total_claims ?? 0}
              discrepancies={s.wrong ?? 0}
            />
          );
        })}
      </div>
    </section>
  );
}

// Reduce the flat claim stream into matrix[category][model] = { verdicts: {correct: n, ...}, claims: [...] }
function buildMatrix(responses) {
  const matrix = {};
  for (const r of responses) {
    for (const c of r.claims) {
      const cat = c.fact_category;
      const model = r.model;
      if (!matrix[cat]) matrix[cat] = {};
      if (!matrix[cat][model]) matrix[cat][model] = { verdicts: {}, claims: [] };
      const bucket = matrix[cat][model];
      bucket.verdicts[c.verdict] = (bucket.verdicts[c.verdict] || 0) + 1;
      bucket.claims.push({ ...c, _response: r });
    }
  }
  return matrix;
}

function worstVerdict(verdicts) {
  const keys = Object.keys(verdicts);
  if (!keys.length) return null;
  return keys.reduce((a, b) => (VERDICT_RANK[b] > VERDICT_RANK[a] ? b : a));
}

function FactMatrix({ matrix, onCellClick }) {
  // Sort rows so categories with worst issues bubble to the top
  const rows = Object.keys(matrix).map((cat) => {
    let rowRank = 0;
    for (const m of MODELS) {
      const v = matrix[cat][m]?.verdicts || {};
      for (const k of Object.keys(v)) rowRank = Math.max(rowRank, VERDICT_RANK[k] * 10 + v[k]);
    }
    return { cat, rowRank };
  });
  rows.sort((a, b) => b.rowRank - a.rowRank || a.cat.localeCompare(b.cat));

  return (
    <section className="section">
      <h3 className="section-title">Fact matrix — category × LLM</h3>
      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th>Fact category</th>
              {MODELS.map((m) => (
                <th key={m} className="num">{MODEL_LABEL[m]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ cat }) => (
              <tr key={cat}>
                <td className="category">
                  {CATEGORY_LABELS[cat] || cat}
                  <span className="key">{cat}</span>
                </td>
                {MODELS.map((m) => {
                  const bucket = matrix[cat]?.[m];
                  if (!bucket) {
                    return (
                      <td className="cell" key={m}>
                        <span className="cell-square empty" title="no claim made">—</span>
                      </td>
                    );
                  }
                  const worst = worstVerdict(bucket.verdicts);
                  const total = Object.values(bucket.verdicts).reduce((a, b) => a + b, 0);
                  return (
                    <td className="cell" key={m}>
                      <button
                        className={`cell-square v-${worst}`}
                        onClick={() => onCellClick(cat, m, bucket)}
                        title={Object.entries(bucket.verdicts).map(([k, v]) => `${k}: ${v}`).join(", ")}
                      >
                        {total}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <div className="legend-item"><span className="legend-swatch v-correct" /> correct</div>
        <div className="legend-item"><span className="legend-swatch v-outdated" /> outdated</div>
        <div className="legend-item"><span className="legend-swatch v-false" /> false</div>
        <div className="legend-item"><span className="legend-swatch v-hallucinated" /> hallucinated</div>
        <div className="legend-item"><span className="legend-swatch v-unverifiable" /> unverifiable</div>
        <div className="legend-item"><span className="legend-swatch" style={{ border: "1px dashed var(--judas-border)", background: "transparent" }} /> no claim</div>
      </div>
    </section>
  );
}

function SeverityDots({ n }) {
  return (
    <div className="severity" title={`Severity ${n}/5`}>
      <span>severity</span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`severity-dot ${i <= n ? "on" : ""}`} />
      ))}
    </div>
  );
}

function ClaimCard({ claim }) {
  const r = claim._response;
  return (
    <div className="claim-card">
      <div className="claim-head">
        <span className={`verdict-badge v-${claim.verdict}`}>{claim.verdict}</span>
        <SeverityDots n={claim.severity} />
      </div>
      <div className="claim-body">
        <div className="claim-excerpt">"{claim.claim_text}"</div>
        <div className="row">
          <div className="label">Claimed</div>
          <div className="val">{claim.claimed_value}</div>
        </div>
        <div className="row">
          <div className="label">Ground truth</div>
          <div className="val">{String(claim.ground_truth_value ?? "—")}</div>
        </div>
        <div className="row">
          <div className="label">Reasoning</div>
          <div className="val reasoning">{claim.reasoning}</div>
        </div>
        <div className="row">
          <div className="label">Prompt</div>
          <div className="val">{r.prompt}</div>
        </div>
        <div className="row">
          <div className="label">Sources</div>
          <div>
            {r._sources && r._sources.length > 0 ? (
              <ul className="sources-list">
                {r._sources.slice(0, 8).map((s, i) => (
                  <li key={i}>
                    <span className="domain">{s.domain || "source"}</span>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
                  </li>
                ))}
                {r._sources.length > 8 && (
                  <li style={{ color: "var(--judas-text-muted)", fontStyle: "italic" }}>
                    +{r._sources.length - 8} more sources
                  </li>
                )}
              </ul>
            ) : (
              <span className="val reasoning">no sources cited by this model</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ selection, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!selection) return null;
  const { category, model, bucket } = selection;
  return (
    <>
      <div className="detail-backdrop" onClick={onClose} />
      <aside className="detail-panel">
        <div className="detail-header">
          <div>
            <div className="eyebrow">{MODEL_LABEL[model]} · {bucket.claims.length} claim{bucket.claims.length === 1 ? "" : "s"}</div>
            <h2>{CATEGORY_LABELS[category] || category}</h2>
          </div>
          <button className="detail-close" onClick={onClose}>Close · Esc</button>
        </div>
        <div className="detail-body">
          {bucket.claims.map((c, i) => <ClaimCard key={i} claim={c} />)}
        </div>
      </aside>
    </>
  );
}

function TrendStrip({ pulledAt }) {
  return (
    <section className="section">
      <h3 className="section-title">Trend — last 30 days</h3>
      <div className="trend-strip">
        <div>
          Trend view populates once Judas has run on multiple days. First pull: <strong className="mono">{pulledAt}</strong>.
        </div>
        <div className="mono" style={{ color: "var(--judas-text-muted)" }}>1 data point</div>
      </div>
    </section>
  );
}

// Load the raw file too, so we can surface cited_sources per claim in the detail panel.
function mergeRawSources(verdicts, raw) {
  if (!raw) return verdicts;
  const lookup = {};
  for (const r of raw.responses) lookup[r.chat_id] = r.cited_sources || [];
  for (const r of verdicts.responses) r._sources = lookup[r.chat_id] || [];
  return verdicts;
}

function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(DATA_URL).then((r) => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)),
      fetch("../data/raw/ag1-2026-04-22.json").then((r) => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([verdicts, raw]) => setData(mergeRawSources(verdicts, raw)))
      .catch((e) => setErr(String(e)));
  }, []);

  const matrix = useMemo(() => data ? buildMatrix(data.responses) : {}, [data]);

  if (err) {
    return (
      <>
        <Header />
        <div className="error">
          <p>Could not load data: <code>{err}</code></p>
          <p style={{ color: "var(--judas-text-muted)" }}>
            Serve the project root with <code>python3 -m http.server 8000</code> and open <code>http://localhost:8000/dashboard/</code>.
          </p>
        </div>
      </>
    );
  }
  if (!data) {
    return (
      <>
        <Header />
        <div className="loading">Loading Judas verdicts…</div>
      </>
    );
  }

  return (
    <>
      <Header brand={data.brand} pulledAt={data.analyzed_at} />
      <main className="page">
        <HeroRow perModel={data.per_model_accuracy || {}} />
        <FactMatrix matrix={matrix} onCellClick={(cat, m, bucket) => setSelection({ category: cat, model: m, bucket })} />
        <TrendStrip pulledAt={data.analyzed_at} />
      </main>
      <DetailPanel selection={selection} onClose={() => setSelection(null)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
