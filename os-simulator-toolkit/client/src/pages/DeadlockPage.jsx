import { useState } from 'react';
import axios from 'axios';

const SAMPLE_ALLOCATION = `0 1 0
2 0 0
3 0 2
2 1 1
0 0 2`;

const SAMPLE_MAX = `7 5 3
3 2 2
9 0 2
2 2 2
4 3 3`;

const SAMPLE_AVAILABLE = '3 3 2';

function parseMatrix(text) {
  const rows = text
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean);
  return rows.map(r =>
    r
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
      .filter(v => !Number.isNaN(v))
  );
}

function parseVector(text) {
  return text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter(v => !Number.isNaN(v));
}

function DeadlockPage() {
  const [allocationText, setAllocationText] = useState(SAMPLE_ALLOCATION);
  const [maxText, setMaxText] = useState(SAMPLE_MAX);
  const [availableText, setAvailableText] = useState(SAMPLE_AVAILABLE);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSample = () => {
    setAllocationText(SAMPLE_ALLOCATION);
    setMaxText(SAMPLE_MAX);
    setAvailableText(SAMPLE_AVAILABLE);
    setResult(null);
    setError('');
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const allocation = parseMatrix(allocationText);
      const maximum = parseMatrix(maxText);
      const available = parseVector(availableText);

      const payload = { allocation, maximum, available };
      const res = await axios.post('/api/deadlock/simulate', payload);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Simulation failed.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Deadlock Avoidance (Banker&apos;s Algorithm)</h2>
      <p className="page-subtitle">
        Explore the Banker&apos;s algorithm to determine whether the system state is safe and
        inspect a safe sequence if one exists.
      </p>

      <div className="layout-single">
        <section className="panel panel--wide">
          <div className="panel-title">System State Input</div>
          <div className="panel-subtitle">
            Enter matrices row by row. Separate values with spaces; each line is a process.
          </div>

          <div className="field">
            <label>Allocation Matrix</label>
            <textarea
              value={allocationText}
              onChange={e => setAllocationText(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Maximum Matrix</label>
            <textarea value={maxText} onChange={e => setMaxText(e.target.value)} />
          </div>

          <div className="field">
            <label>Available Resources</label>
            <input
              type="text"
              value={availableText}
              onChange={e => setAvailableText(e.target.value)}
              placeholder="e.g. 3 3 2"
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" type="button" onClick={loadSample}>
              Load Sample Data
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSimulate}>
              {loading ? 'Checking…' : 'Check Safety'}
            </button>
          </div>
          {error && <div style={{ marginTop: '0.75rem', color: '#fca5a5' }}>{error}</div>}

          {result ? (
            <>
              <div className="metrics-grid" style={{ marginTop: '1rem' }}>
                <div className="metric-card">
                  <div className="metric-label">System Safety</div>
                  <div
                    className="metric-value"
                    style={{ color: result.isSafe ? '#4ade80' : '#f97316' }}
                  >
                    {result.isSafe ? 'Safe' : 'Unsafe'}
                  </div>
                </div>
                {result.isSafe && (
                  <div className="metric-card">
                    <div className="metric-label">Safe Sequence</div>
                    <div className="metric-value">
                      {result.safeSequence.map(p => `P${p}`).join(' → ')}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div className="chip">Need Matrix</div>
                <div className="table-scroll" style={{ marginTop: '0.5rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Process</th>
                        {result.need[0].map((_, j) => (
                          <th key={j}>R{j}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.need.map((row, i) => (
                        <tr key={i}>
                          <td>{`P${i}`}</td>
                          {row.map((val, j) => (
                            <td key={j}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="list-muted" style={{ marginTop: '1rem' }}>
              Run the algorithm to see whether the current system state is safe.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DeadlockPage;

