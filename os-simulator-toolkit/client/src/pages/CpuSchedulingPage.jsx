import { useState } from 'react';
import axios from 'axios';
import GanttChart from '../components/GanttChart';

const SAMPLE_PROCESSES = [
  { id: 'P1', arrivalTime: 0, burstTime: 7, priority: 0 },
  { id: 'P2', arrivalTime: 2, burstTime: 4, priority: 1 },
  { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 2 },
  { id: 'P4', arrivalTime: 5, burstTime: 4, priority: 1 }
];

function CpuSchedulingPage() {
  const [processes, setProcesses] = useState(SAMPLE_PROCESSES);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateProcess = (index, field, value) => {
    const next = processes.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setProcesses(next);
  };

  const addProcess = () => {
    const id = `P${processes.length + 1}`;
    setProcesses([...processes, { id, arrivalTime: 0, burstTime: 1, priority: 0 }]);
  };

  const removeProcess = index => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const loadSample = () => {
    setProcesses(SAMPLE_PROCESSES);
    setAlgorithm('FCFS');
    setTimeQuantum(2);
    setResult(null);
    setError('');
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        processes: processes.map(p => ({
          id: p.id,
          arrivalTime: Number(p.arrivalTime),
          burstTime: Number(p.burstTime),
          priority: Number(p.priority ?? 0)
        })),
        algorithm,
        timeQuantum: Number(timeQuantum)
      };
      const res = await axios.post('/api/cpu/simulate', payload);
      setResult(res.data);
    } catch (e) {
      const message =
        e.response?.data?.error ||
        e.response?.data?.message ||
        e.message ||
        'Simulation failed.';
      setError(message);
      console.error('Simulation error:', e);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">CPU Scheduling Simulator</h2>
      <p className="page-subtitle">
        Compare FCFS, SJF, SRTF, Round Robin, and Priority scheduling by exploring how processes are ordered on the CPU.
      </p>

      <div className="layout-single">
        <section className="panel panel--wide">
          <div className="panel-title">Process Input</div>
          <div className="panel-subtitle">
            Define processes with arrival and burst times, then choose a scheduling algorithm.
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Algorithm</label>
              <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
                <option value="FCFS">FCFS (First-Come, First-Served)</option>
                <option value="SJF">SJF (Shortest Job First)</option>
                <option value="SRTF">SRTF (Shortest Remaining Time First)</option>
                <option value="RR">Round Robin</option>
                <option value="PRIORITY_NON_PREEMPTIVE">Priority (Non-Preemptive)</option>
                <option value="PRIORITY_PREEMPTIVE">Priority (Preemptive)</option>
              </select>
            </div>
            {algorithm === 'RR' && (
              <div className="field">
                <label>Time Quantum</label>
                <input
                  type="number"
                  min="1"
                  value={timeQuantum}
                  onChange={e => setTimeQuantum(e.target.value)}
                />
              </div>
            )}
          </div>

          <div
            className={`data-list data-list--process ${algorithm.startsWith('PRIORITY') ? 'priority' : ''}`}
            style={{ marginTop: '0.9rem' }}
          >
            <div className="data-row data-row-header">
              <span>Process ID</span>
              <span>Arrival Time</span>
              <span>Burst Time</span>
              {algorithm.startsWith('PRIORITY') && <span>Priority</span>}
              <span />
            </div>
            {processes.map((p, index) => (
              <div className="data-row" key={`${p.id}-${index}`}>
                <input
                  type="text"
                  value={p.id}
                  onChange={e => updateProcess(index, 'id', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  value={p.arrivalTime}
                  onChange={e => updateProcess(index, 'arrivalTime', e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={p.burstTime}
                  onChange={e => updateProcess(index, 'burstTime', e.target.value)}
                />
                {algorithm.startsWith('PRIORITY') && (
                  <input
                    type="number"
                    min="0"
                    value={p.priority ?? 0}
                    onChange={e => updateProcess(index, 'priority', e.target.value)}
                  />
                )}
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => removeProcess(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" type="button" onClick={addProcess}>
              + Add Process
            </button>
            <button className="btn btn-ghost" type="button" onClick={loadSample}>
              Load Sample Data
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSimulate}>
              {loading ? 'Simulating…' : 'Simulate'}
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}

          {result && (
            <>
              <hr className="panel-divider" />
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Algorithm</div>
                  <div className="metric-value">{result.algorithm}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Avg Waiting Time</div>
                  <div className="metric-value">
                    {result.averageWaitingTime.toFixed(2)}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Avg Turnaround Time</div>
                  <div className="metric-value">
                    {result.averageTurnaroundTime.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div className="chip">Gantt Chart</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <GanttChart timeline={result.timeline} />
                </div>
              </div>

              {(() => {
                const showPriority = algorithm.toUpperCase().startsWith('PRIORITY');
                return (
                  <div
                    className={`data-list data-list--result ${
                      showPriority ? 'priority' : ''
                    }`}
                    style={{ marginTop: '1rem' }}
                  >
                    <div className="data-row data-row-header">
                      <span>Process</span>
                      <span>Arrival Time</span>
                      <span>Burst Time</span>
                      {showPriority && <span>Priority</span>}
                      <span>Completion Time</span>
                      <span>Turnaround Time</span>
                      <span>Waiting Time</span>
                    </div>
                    {result.detailed.map(p => (
                      <div className="data-row" key={p.id}>
                        <span>{p.id}</span>
                        <span>{p.arrivalTime}</span>
                        <span>{p.burstTime}</span>
                        {showPriority && <span>{p.priority}</span>}
                        <span>{p.finishTime}</span>
                        <span>{p.turnaroundTime}</span>
                        <span>{p.waitingTime}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default CpuSchedulingPage;

