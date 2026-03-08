import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Planner', icon: '\u{1F4C5}' },
  { path: '/grocery', label: 'Grocery', icon: '\u{1F6D2}' },
  { path: '/emergency', label: 'Emergency', icon: '\u26A1' },
  { path: '/fun', label: 'Fun', icon: '\u2728' },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive
                  ? 'text-amber-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-xs font-medium ${isActive ? 'text-amber-600' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
