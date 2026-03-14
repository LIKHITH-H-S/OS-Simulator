import { useNavigate } from 'react-router-dom';

const cards = [
  {
    key: 'cpu',
    title: 'CPU Scheduling',
    description: 'Visualize how processes are ordered on the CPU using FCFS, SJF, and Round Robin.',
    to: '/cpu-scheduling',
    tags: ['Gantt chart', 'Waiting / TAT', 'Time quantum']
  },
  {
    key: 'page',
    title: 'Page Replacement',
    description: 'Step through FIFO, LRU, and Optimal page replacement with a frame-by-frame view.',
    to: '/page-replacement',
    tags: ['Frame table', 'Faults / hits']
  },
  {
    key: 'deadlock',
    title: 'Deadlock Avoidance',
    description: 'Experiment with Banker’s algorithm to see when a system is safe or unsafe.',
    to: '/deadlock-avoidance',
    tags: ['Safe state', 'Safe sequence']
  },
  {
    key: 'disk',
    title: 'Disk Scheduling',
    description: 'Compare FCFS, SSTF, and SCAN by watching disk head movement.',
    to: '/disk-scheduling',
    tags: ['Head path', 'Seek time']
  }
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="home-hero">
        <h1 className="page-title">OS Simulator</h1>
        <p className="page-subtitle">
          Visualize and experiment with core Operating System algorithms in one unified workspace.
        </p>
      </div>

      <div className="card-grid">
        {cards.map(card => (
          <button
            key={card.key}
            className="feature-card"
            onClick={() => navigate(card.to)}
            type="button"
          >
            <div className="feature-card-title">{card.title}</div>
            <div className="feature-card-desc">{card.description}</div>
            <div className="feature-card-meta">
              {card.tags.map(tag => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

