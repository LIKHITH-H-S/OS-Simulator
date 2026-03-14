import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CpuSchedulingPage from './pages/CpuSchedulingPage';
import PageReplacementPage from './pages/PageReplacementPage';
import DeadlockPage from './pages/DeadlockPage';
import DiskSchedulingPage from './pages/DiskSchedulingPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cpu-scheduling" element={<CpuSchedulingPage />} />
          <Route path="/page-replacement" element={<PageReplacementPage />} />
          <Route path="/deadlock-avoidance" element={<DeadlockPage />} />
          <Route path="/disk-scheduling" element={<DiskSchedulingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

