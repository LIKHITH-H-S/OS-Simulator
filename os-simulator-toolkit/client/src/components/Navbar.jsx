import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('os-sim-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('os-sim-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isActive = path => (location.pathname === path ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-title">OS Simulator</div>
        </div>
        <nav className="navbar-center">
          <Link className={isActive('/')} to="/">
            Home
          </Link>
          <Link className={isActive('/cpu-scheduling')} to="/cpu-scheduling">
            CPU
          </Link>
          <Link className={isActive('/page-replacement')} to="/page-replacement">
            Memory
          </Link>
          <Link className={isActive('/deadlock-avoidance')} to="/deadlock-avoidance">
            Deadlock
          </Link>
          <Link className={isActive('/disk-scheduling')} to="/disk-scheduling">
            Disk
          </Link>
        </nav>
        <div className="navbar-right">
          <button
            type="button"
            className="theme-toggle btn-ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '◑' : '◐'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

