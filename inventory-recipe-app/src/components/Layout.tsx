import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isInventory = location.pathname === '/inventory';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between max-w-6xl mx-auto w-full">
        <h1
          className="text-lg font-bold text-gray-900 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Donaldson Dinners
        </h1>
        <button
          onClick={() => navigate('/inventory')}
          className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
            isInventory
              ? 'bg-amber-100 text-amber-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Inventory
        </button>
      </header>

      <main className="pb-20 pt-2 max-w-6xl mx-auto">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
