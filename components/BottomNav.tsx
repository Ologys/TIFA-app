
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: 'home', label: 'Trang chủ', path: '/home' },
    { icon: 'newspaper', label: 'Tin tức', path: '/news' },
    { icon: 'smart_toy', label: 'Trợ lý AI', path: '/chat', isCenter: true },
    { icon: 'school', label: 'Học', path: '/courses' },
    { icon: 'grid_view', label: 'Tiện ích', path: '/market' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0a1a11]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-safe z-[100]">
      <div className="flex justify-around items-end h-16 pb-2 max-w-md mx-auto px-1 relative">
        {navItems.map((item, index) => {
          const isActive = currentPath.startsWith(item.path);
          
          if (item.isCenter) {
            return (
              <div key={item.path} className="relative flex flex-col items-center justify-end w-full h-full pb-1">
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center size-14 rounded-2xl -translate-y-4 shadow-xl transition-all duration-300 active:scale-90 ${
                    isActive 
                    ? 'bg-primary text-white shadow-green-900/40' 
                    : 'bg-[#1a2e22] text-white shadow-slate-900/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[30px] filled">
                    {item.icon}
                  </span>
                </button>
                <span className={`text-[10px] absolute -bottom-1 ${isActive ? 'text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 w-full h-full justify-end group transition-all duration-300 pb-1 ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                <span className={`material-symbols-outlined text-[24px] ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
