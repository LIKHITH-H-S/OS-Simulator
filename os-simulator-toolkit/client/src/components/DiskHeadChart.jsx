import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function DiskHeadChart({ path }) {
  if (!path || path.length === 0) {
    return <div className="list-muted">No head movement to visualize yet.</div>;
  }

  const labels = path.map((_, idx) => `Step ${idx}`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Head Position',
        data: path,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        tension: 0.25,
        pointRadius: 3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Step'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cylinder'
        },
        ticks: {
          precision: 0
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}

export default DiskHeadChart;

