function GanttChart({ timeline }) {
  if (!timeline || timeline.length === 0) return <div className="list-muted">No timeline to display.</div>;

  const min = Math.min(...timeline.map(t => t.start));
  const max = Math.max(...timeline.map(t => t.end));
  const total = max - min || 1;

  return (
    <div>
      <div className="gantt-row">
        {timeline.map((slot, idx) => {
          const widthPct = ((slot.end - slot.start) / total) * 100;
          const shades = ['#f9fafb', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'];
          const bg = shades[idx % shades.length];
          return (
            <div
              key={`${slot.processId}-${idx}-${slot.start}`}
              className="gantt-bar"
              style={{ width: `${widthPct}%`, background: bg }}
            >
              {slot.processId}
            </div>
          );
        })}
      </div>
      <div className="gantt-time-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default GanttChart;

