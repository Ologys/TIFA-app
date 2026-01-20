
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

interface UtilityItem {
  icon: string;
  label: string;
  color: string;
  path?: string;
  isHot?: boolean;
}

const Market: React.FC = () => {
  const navigate = useNavigate();

  const utilities: UtilityItem[] = [
    { icon: 'monitoring', label: 'Phân tích kỹ thuật', color: 'text-primary', path: '/utility/technical', isHot: true },
    { icon: 'filter_alt', label: 'Lọc CP theo PTKT', color: 'text-primary', path: '/utility/filter' },
    { icon: 'database', label: 'Giá vàng', color: 'text-primary', path: '/utility/gold' },
    { icon: 'language', label: 'Chứng khoán Thế giới', color: 'text-primary', path: '/utility/world' },
    { icon: 'currency_bitcoin', label: 'Crypto', color: 'text-primary', path: '/utility/crypto', isHot: true },
    { icon: 'currency_exchange', label: 'Tỉ giá', color: 'text-primary', path: '/utility/rates' },
    { icon: 'balance', label: 'So sánh cổ phiếu', color: 'text-primary', path: '/utility/compare' },
    { icon: 'book_2', label: 'Đọc sách online', color: 'text-primary', path: '/books', isHot: true },
  ];

  return (
    <div className="bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 max-w-md mx-auto shadow-2xl relative transition-colors duration-300 font-display overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* Header Section - New Image */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop" 
          className="w-full h-full object-cover brightness-[0.4] saturate-[1.2] scale-105" 
          alt="ecosystem-bg" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-background-dark via-transparent to-black/40"></div>

        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-5">
          <Logo size="header" />
          <div className="flex items-center gap-2">
            <button className="text-white size-9 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center">
               <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>
            <button onClick={() => navigate('/profile')} className="size-9 rounded-xl overflow-hidden border border-white/20 shadow-xl bg-black/40 backdrop-blur-md">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-10 z-20">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-2">TIFA ECOSYSTEM</p>
            <h2 className="text-white text-[36px] font-black tracking-tighter drop-shadow-2xl leading-none">Tiện ích</h2>
            <div className="w-12 h-1 bg-primary mt-4 rounded-full"></div>
        </div>
      </div>

      {/* UTILITIES GRID */}
      <div className="px-6 pt-8 pb-16">
        <div className="grid grid-cols-4 gap-x-4 gap-y-10">
           {utilities.map((item, i) => (
             <div 
                key={i} 
                className="flex flex-col items-center gap-3 group cursor-pointer"
                onClick={() => item.path && navigate(item.path)}
             >
                <div className="relative size-[72px] bg-white dark:bg-slate-800/50 rounded-[24px] shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-all group-hover:shadow-xl group-hover:-translate-y-1 group-active:scale-90">
                   
                   {/* Badge Hot */}
                   {item.isHot && (
                     <div className="absolute -top-1.5 -right-1.5 z-10 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-lg shadow-lg animate-bounce">
                        HOT
                     </div>
                   )}
                   
                   <span className={`material-symbols-outlined text-[32px] font-light ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                   </span>
                </div>
                <span className="text-[10px] font-black text-slate-700 dark:text-gray-300 text-center leading-tight px-1 line-clamp-2 min-h-[2.2em] flex items-center justify-center uppercase tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">
                   {item.label}
                </span>
             </div>
           ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Market;
