import { useState } from 'react';
import api from '../api';

const SAMPLE_REF = '7 0 1 2 0 3 0 4 2 3 0 3 2';

function parseReferenceString(str) {
  return str
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter(v => !Number.isNaN(v));
}

function PageReplacementPage() {
  const [referenceText, setReferenceText] = useState(SAMPLE_REF);
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSample = () => {
    setReferenceText(SAMPLE_REF);
    setFrameCount(3);
    setAlgorithm('FIFO');
    setResult(null);
    setShowSteps(false);
    setError('');
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const refs = parseReferenceString(referenceText);
      const payload = {
        referenceString: refs,
        frameCount: Number(frameCount),
        algorithm
      };
      const res = await api.post('/api/page-replacement/simulate', payload);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Simulation failed.');
      setResult(null);
      setShowSteps(false);
    } finally {
      setLoading(false);
    }
  };

  const frameColumns =
    result && result.steps.length
      ? Math.max(...result.steps.map(step => step.frames.length), result.frameCount || Number(frameCount) || 0)
      : Number(frameCount) || 0;

  return (
    <div>
      <h2 className="page-title">Page Replacement Simulator</h2>
      <p className="page-subtitle">
        Step through FIFO, LRU, and Optimal algorithms and inspect the frame table, faults, and hits.
      </p>

      <div className="layout-single">
        <section className="panel panel--wide">
          <div className="panel-title">Reference String</div>
          <div className="panel-subtitle">
            Enter page numbers separated by spaces or commas and choose the number of frames.
          </div>

          <div className="field">
            <label>Reference String</label>
            <textarea
              value={referenceText}
              onChange={e => setReferenceText(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4 2 3 0 3 2"
            />
          </div>

          <div className="form-grid" style={{ marginTop: '0.7rem' }}>
            <div className="field">
              <label>Number of Frames</label>
              <input
                type="number"
                min="1"
                value={frameCount}
                onChange={e => setFrameCount(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Algorithm</label>
              <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
                <option value="FIFO">FIFO</option>
                <option value="LRU">LRU</option>
                <option value="OPTIMAL">Optimal</option>
              </select>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" type="button" onClick={loadSample}>
              Load Sample Data
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSimulate}>
              {loading ? 'Simulating…' : 'Simulate'}
            </button>
          </div>
          {error && <div style={{ marginTop: '0.75rem', color: '#fca5a5' }}>{error}</div>}

          {result ? (
            <div style={{ marginTop: '1.25rem' }}>
              <div className="metric-card" style={{ marginBottom: '0.75rem' }}>
                <div className="metric-label">Algorithm</div>
                <div className="metric-value">{result.algorithm}</div>
              </div>
              <div className="metric-card" style={{ marginBottom: '0.75rem' }}>
                <div className="metric-label">Page Faults</div>
                <div className="metric-value">{result.totalFaults}</div>
              </div>
              <div className="metric-card" style={{ marginBottom: '0.75rem' }}>
                <div className="metric-label">Page Hits</div>
                <div className="metric-value">{result.totalHits}</div>
              </div>

              <div className="btn-row" style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setShowSteps(prev => !prev)}
                >
                  {showSteps ? 'Hide' : 'Show'} step-by-step table
                </button>
              </div>

              {showSteps && (
                <div className="table-scroll" style={{ marginTop: '1rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Step</th>
                        <th>Reference</th>
                        {Array.from({ length: frameColumns }).map((_, idx) => (
                          <th key={idx}>Frame {idx}</th>
                        ))}
                        <th>Hit / Fault</th>
                        <th>Victim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.steps.map(step => (
                        <tr key={step.index}>
                          <td>{step.index + 1}</td>
                          <td>{step.reference}</td>
                          {Array.from({ length: frameColumns }).map((_, idx) => (
                            <td key={idx}>{step.frames[idx] ?? '-'}</td>
                          ))}
                          <td style={{ color: step.hit ? '#4ade80' : '#f97316' }}>
                            {step.hit ? 'Hit' : 'Fault'}
                          </td>
                          <td>{step.victim ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="list-muted" style={{ marginTop: '1rem' }}>
              Run a simulation to see the results.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default PageReplacementPage;

