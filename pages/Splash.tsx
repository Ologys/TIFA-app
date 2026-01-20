
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-white dark:bg-[#0a1a11] font-display antialiased h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Hiệu ứng bo góc mờ ở các cạnh */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 dark:bg-white/5 rounded-full blur-[80px]"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 dark:bg-white/5 rounded-full blur-[80px]"></div>

      {/* Khu vực trung tâm: Logo + Spinner */}
      <div className="flex flex-col items-center gap-16 animate-fade-in z-10">
        <div className="p-8 bg-white dark:bg-slate-900/50 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800">
          <Logo size="xl" />
        </div>
        
        {/* Vòng quay loading */}
        <div className="relative">
          <div className="w-10 h-10 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Slogan nằm ở dưới cùng */}
      <div className="absolute bottom-12 flex flex-col items-center z-10 px-6 w-full">
        <p className="text-[#94a3b8] dark:text-gray-500 text-[11px] font-black uppercase tracking-[0.5em] text-center whitespace-nowrap">
            Kiến thức • Tài chính • Thịnh vượng
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Splash;
