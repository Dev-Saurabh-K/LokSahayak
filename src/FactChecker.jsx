import React, { useState } from 'react';

// FactCheckerPage.jsx
// Single-file React component (Tailwind CSS utility classes assumed available)
// Exports a default React component that renders a modern, responsive fact-checker UI.

export default function FactCheckerPage() {
  const [claim, setClaim] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  // Mock fact-checking function — replace with real API/backend integration
  function fakeCheckFact(claimText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple deterministic mock: use claim length to vary outcome
        const length = claimText.trim().length;
        const score = Math.max(0, Math.min(100, Math.floor((length % 37) * 2.7)));
        const verdict = score > 65 ? 'Likely True' : score < 35 ? 'Likely False' : 'Unclear';
        const sources = [
          {
            id: 1,
            title: 'Trusted News — Example headline',
            excerpt: 'Short excerpt that either supports or questions the claim.',
            url: '#',
            stance: score > 50 ? 'supports' : 'contradicts',
            reliability: score > 50 ? 'High' : 'Medium'
          },
          {
            id: 2,
            title: 'FactCheck.Org style report',
            excerpt: 'Independent fact-check that analyzes the claim in detail.',
            url: '#',
            stance: score > 50 ? 'supports' : 'contradicts',
            reliability: 'High'
          }
        ];

        resolve({ score, verdict, sources, checkedAt: new Date().toISOString() });
      }, 800);
    });
  }

  async function handleCheck(e) {
    e?.preventDefault();
    if (!claim.trim()) return;
    setChecking(true);
    setResult(null);

    try {
      const res = await fakeCheckFact(claim);
      setResult(res);
      setQueryHistory((h) => [{ claim, ...res }, ...h].slice(0, 10));
    } catch (err) {
      console.error(err);
      setResult({ error: 'Something went wrong — try again.' });
    } finally {
      setChecking(false);
    }
  }

  function renderVerdictBadge(verdict) {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    if (!verdict) return null;
    if (verdict === 'Likely True') return <span className={`${base} bg-green-100 text-green-600`}>✔ {verdict}</span>;
    if (verdict === 'Likely False') return <span className={`${base} bg-red-100 text-red-800`}>✖ {verdict}</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>? {verdict}</span>;
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl text-emerald-900 font-semibold">FactChecker</h1>
            <p className="text-sm text-slate-600">Paste a claim, press Check — get a quick verdict and sources.</p>
          </div>
        </header>

        <main className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left: input + controls */}
          <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <form onSubmit={handleCheck}>
              <label className="block text-sm font-medium text-slate-700 mb-2">Claim to check</label>
              <textarea
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Type or paste a full claim — e.g. 'Vaccines cause autism' or a news quote"
                rows={5}
                className="w-full rounded-lg border border-slate-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="submit"
                  disabled={checking}
                  className="inline-flex items-center gap-2 bg-emerald-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  {checking ? 'Checking…' : 'Check Claim'}
                </button>

                <button
                  type="button"
                  onClick={() => { setClaim(''); setResult(null); }}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                >
                  Clear
                </button>

                <div className="ml-auto text-sm text-slate-500">Tip: include full sentences for better results</div>
              </div>
            </form>

            {/* Results area */}
            <div className="mt-6">
              {!result && (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-slate-500">No result yet — enter a claim and press <strong>Check Claim</strong>.</div>
              )}

              {result && result.error && (
                <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-red-700">{result.error}</div>
              )}

              {result && !result.error && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-600">Verdict</div>
                      <div>{renderVerdictBadge(result.verdict)}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Score</div>
                      <div className="text-lg font-medium">{result.score}%</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <div className="text-sm text-slate-600">Short explanation</div>
                    <div className="mt-2 text-sm text-slate-700">This summary is generated from the best matching sources and an automated classifier. Integrate your real model to show deeper analysis here.</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Sources</h3>
                    <div className="grid gap-3">
                      {result.sources.map((s) => (
                        <a key={s.id} href={s.url} className="block p-3 rounded-lg border hover:shadow" target="_blank" rel="noreferrer">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold">{s.title}</div>
                              <div className="text-xs text-slate-500 mt-1">{s.excerpt}</div>
                            </div>
                            <div className="text-right text-xs">
                              <div className="uppercase text-[10px] text-slate-500">{s.reliability}</div>
                              <div className="mt-2">
                                {s.stance === 'supports' ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700">Supports</span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-red-50 text-red-700">Contradicts</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-slate-500">Checked at: {new Date(result.checkedAt).toLocaleString()}</div>
                </div>
              )}
            </div>

          </section>

          {/* Right: history + quick tools */}
          <aside className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">History</h4>
              <button onClick={() => setQueryHistory([])} className="text-xs text-slate-500">Clear</button>
            </div>

            {queryHistory.length === 0 && (
              <div className="text-xs text-slate-400">No recent checks. Your 10 most recent checks will appear here.</div>
            )}

            <div className="space-y-3 mt-2">
              {queryHistory.map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-slate-50">
                  <div className="text-xs text-slate-700 font-medium truncate">{q.claim}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <div>{q.verdict}</div>
                    <div>{new Date(q.checkedAt).toLocaleTimeString()}</div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => { setClaim(q.claim); setResult(q); }} className="text-xs px-2 py-1 rounded border">Load</button>
                    <button onClick={() => setQueryHistory(h => h.filter((_, i) => i !== idx))} className="text-xs px-2 py-1 rounded border">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Quick tools</h5>
              <div className="flex flex-col gap-2">
                <button onClick={() => setClaim('The Earth is flat.')} className="text-xs px-3 py-2 rounded border text-left">Example: The Earth is flat.</button>
                <button onClick={() => setClaim('COVID-19 vaccines change your DNA.')} className="text-xs px-3 py-2 rounded border text-left">Example: COVID-19 vaccines change your DNA</button>
              </div>
            </div>
          </aside>
        </main>

      </div>
    </div>
  );
}
