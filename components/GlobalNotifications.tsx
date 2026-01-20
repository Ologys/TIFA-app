import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'up' | 'down' | 'vol' | 'news';
  isRead: boolean;
  symbol?: string;
  timestamp: number;
}

const GlobalNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites
  const loadFavorites = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('tifa_favorites') || '[]');
      setFavorites(saved);
    } catch (e) {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();
    const handleStorageChange = () => loadFavorites();
    window.addEventListener('favoritesUpdated', handleStorageChange);
    return () => window.removeEventListener('favoritesUpdated', handleStorageChange);
  }, []);

  // Simulation Loop
  useEffect(() => {
    if (favorites.length === 0) return;

    const interval = setInterval(() => {
      // 30% chance to trigger an alert every 3 seconds
      if (Math.random() > 0.7) {
        const randomSymbol = favorites[Math.floor(Math.random() * favorites.length)];
        const typeRand = Math.random();
        
        let type: 'up' | 'down' | 'vol' = 'up';
        let title = '';
        let message = '';

        // Generate realistic market scenarios
        if (typeRand < 0.4) {
            type = 'up';
            const pct = (Math.random() * 3 + 1).toFixed(1);
            title = `${randomSymbol} tăng mạnh +${pct}%`;
            message = `Lực cầu chủ động đẩy giá ${randomSymbol} vượt kháng cự ngắn hạn.`;
        } else if (typeRand < 0.8) {
            type = 'down';
            const pct = (Math.random() * 3 + 1).toFixed(1);
            title = `${randomSymbol} giảm mạnh -${pct}%`;
            message = `Áp lực bán chốt lời khiến ${randomSymbol} mất mốc hỗ trợ quan trọng.`;
        } else {
            type = 'vol';
            const vol = (Math.random() * 5 + 1).toFixed(1);
            title = `${randomSymbol} đột biến khối lượng`;
            message = `Thanh khoản tăng gấp ${vol} lần trung bình 20 phiên. Dòng tiền lớn tham gia.`;
        }

        const newNotif: AppNotification = {
          id: Date.now(),
          title,
          message,
          time: 'Vừa xong',
          type,
          isRead: false,
          symbol: randomSymbol,
          timestamp: Date.now()
        };

        // 1. Show Toast
        setToasts(prev => [newNotif, ...prev].slice(0, 3));

        // 2. Persist to History (Local Storage for Home screen)
        const currentHistory = JSON.parse(localStorage.getItem('tifa_notifications') || '[]');
        const updatedHistory = [newNotif, ...currentHistory].slice(0, 50); // Keep last 50
        localStorage.setItem('tifa_notifications', JSON.stringify(updatedHistory));

        // 3. Dispatch Event for Home screen to update badge
        window.dispatchEvent(new Event('tifa_new_notification'));

        // Auto remove toast after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(a => a.id !== newNotif.id));
        }, 5000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [favorites]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-3 pointer-events-none max-w-[90vw] sm:max-w-sm w-full">
      {toasts.map((toast) => (
        <div 
            key={toast.id}
            onClick={() => {
                if (toast.symbol) navigate(`/asset/${toast.symbol.toLowerCase()}`);
            }}
            className="pointer-events-auto w-full bg-white/95 dark:bg-[#1e2229]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-3 flex items-start gap-3 animate-slide-in-right cursor-pointer hover:border-blue-500 transition-colors group"
        >
            <div className={`mt-1 size-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                toast.type === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 
                toast.type === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
            }`}>
                <span className="material-symbols-outlined text-xl">
                    {toast.type === 'up' ? 'trending_up' : toast.type === 'down' ? 'trending_down' : 'bar_chart'}
                </span>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">{toast.title}</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">{toast.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-snug mt-0.5 line-clamp-2">
                    {toast.message}
                </p>
            </div>

            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                }}
                className="text-gray-400 hover:text-slate-900 dark:hover:text-white -mr-1 -mt-1"
            >
                <span className="material-symbols-outlined text-base">close</span>
            </button>
        </div>
      ))}
    </div>
  );
};

export default GlobalNotifications;