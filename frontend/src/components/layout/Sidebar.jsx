
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useEffect } from 'react';

export default function Sidebar({ isOpen, onClose }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setSettingsOpen((open) => !open);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">Task Manager</h2>
              <button
                onClick={onClose}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
            {/* Settings Dropdown */}
            <div className="relative mt-2">
              <button
                onClick={handleSettingsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-slate-700 hover:bg-slate-100 font-semibold"
              >
                <span className="text-xl">⚙️</span>
                <span>Settings</span>
              </button>
              {settingsOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50">
                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {navigate('/login'); onClose();}}>Login</button>
                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {navigate('/dashboard'); onClose();}}>Tasks</button>
                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={handleLogout}>Logout</button>

                  <div className="w-full">
                    <button
                      className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                      onClick={() => setShowAddAccount((prev) => !prev)}
                    >
                      <span>Account</span>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${showAddAccount ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {showAddAccount && (
                      <div className="w-full animate-slideDown overflow-hidden">
                        <button className="w-full text-left px-6 py-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {alert('Add Account feature coming soon!');}}>Add Account</button>
                      </div>
                    )}
                  </div>

                  <button className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {alert('About: Task Manager App v1.0');}}>About</button>
                  <button className="w-full text-left px-4 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDarkMode(dm => !dm)}>
                    <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Settings Section removed */}
        </div>
      </aside>
    </>
  );
}

