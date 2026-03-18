import { useState } from 'react';
import api from '../api';
import DiskHeadChart from '../components/DiskHeadChart';

const SAMPLE_QUEUE = '82 170 43 140 24 16 190';

function parseQueue(text) {
  return text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter(v => !Number.isNaN(v));
}

function DiskSchedulingPage() {
  const [queueText, setQueueText] = useState(SAMPLE_QUEUE);
  const [initialHead, setInitialHead] = useState(50);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [direction, setDirection] = useState('right');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSample = () => {
    setQueueText(SAMPLE_QUEUE);
    setInitialHead(50);
    setAlgorithm('FCFS');
    setDirection('right');
    setResult(null);
    setError('');
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const requestQueue = parseQueue(queueText);
      const payload = {
        requestQueue,
        initialHead: Number(initialHead),
        algorithm,
        direction
      };
      const res = await api.post('/api/disk/simulate', payload);
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
      <h2 className="page-title">Disk Scheduling Simulator</h2>
      <p className="page-subtitle">
        Visualize disk head movement for FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK and compare total seek times.
      </p>

      <div className="layout-single">
        <section className="panel panel--wide">
          <div className="panel-title">Request Queue</div>
          <div className="panel-subtitle">
            Enter cylinder requests and the initial head position, then select a scheduling policy.
          </div>

          <div className="field">
            <label>Request Queue</label>
            <textarea
              value={queueText}
              onChange={e => setQueueText(e.target.value)}
              placeholder="e.g. 82 170 43 140 24 16 190"
            />
          </div>

          <div className="form-grid" style={{ marginTop: '0.7rem' }}>
            <div className="field">
              <label>Initial Head Position</label>
              <input
                type="number"
                value={initialHead}
                onChange={e => setInitialHead(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Algorithm</label>
              <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
                <option value="FCFS">FCFS</option>
                <option value="SSTF">SSTF</option>
                <option value="SCAN">SCAN</option>
                <option value="C-SCAN">C-SCAN</option>
                <option value="LOOK">LOOK</option>
                <option value="C-LOOK">C-LOOK</option>
              </select>
            </div>
            {['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].includes(algorithm) && (
              <div className="field">
                <label>Direction</label>
                <select value={direction} onChange={e => setDirection(e.target.value)}>
                  <option value="right">Towards higher cylinders</option>
                  <option value="left">Towards lower cylinders</option>
                </select>
              </div>
            )}
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

          <div style={{ marginTop: '1.5rem' }}>
            <div className="panel-title">Head Movement &amp; Seek Time</div>
            <div className="panel-subtitle">
              Inspect the order in which requests are served and the resulting total head movement.
            </div>

            {result ? (
              <>
                <div className="metrics-grid" style={{ marginTop: '1rem' }}>
                  <div className="metric-card">
                    <div className="metric-label">Algorithm</div>
                    <div className="metric-value">{result.algorithm}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Total Seek Time</div>
                    <div className="metric-value">{result.totalSeekTime}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Path Length</div>
                    <div className="metric-value">{result.path.length}</div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div className="chip">Head Path (chart)</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <DiskHeadChart path={result.path} />
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div className="chip">Head Movement Order</div>
                  <p className="list-muted" style={{ marginTop: '0.4rem' }}>
                    {result.path.join(' → ')}
                  </p>
                </div>
              </>
            ) : (
              <div className="list-muted" style={{ marginTop: '1rem' }}>
                Run a simulation to see disk head movement and total seek time.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DiskSchedulingPage;

