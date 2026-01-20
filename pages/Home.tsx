
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
import MiniBoard from '../components/MiniBoard';
import Watchlist from '../components/Watchlist';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(7);

  useEffect(() => {
    const loadNotifs = () => {
      const stored = JSON.parse(localStorage.getItem('tifa_notifications') || '[]');
      if(stored.length > 0) setUnreadCount(stored.filter((n: any) => !n.isRead).length);
    };
    loadNotifs();
    window.addEventListener('tifa_new_notification', loadNotifs);
    return () => window.removeEventListener('tifa_new_notification', loadNotifs);
  }, []);

  const quickMenu = [
    { label: 'Thị trường', icon: 'bar_chart', color: 'text-blue-600', bg: 'bg-blue-50', path: '/market' },
    { label: 'Mô phỏng', icon: 'speed', color: 'text-purple-600', bg: 'bg-purple-50', path: '/simulation' },
    { label: 'Khóa học', icon: 'school', color: 'text-amber-600', bg: 'bg-amber-50', path: '/courses' },
    { label: 'Sách', icon: 'menu_book', color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/books' },
    { label: 'Sự kiện Hot', icon: 'local_fire_department', color: 'text-rose-600', bg: 'bg-rose-50', path: '/news' },
  ];

  const hotNews = [
    { 
      id: 1, 
      title: 'Khối ngoại mua ròng 2.500 tỷ', 
      desc: 'Kỷ lục 2 năm qua tập trung mạnh vào các mã VN30.', 
      tag: 'THỊ TRƯỜNG', 
      time: '10P', 
      img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 2, 
      title: 'Lãi suất tiết kiệm chạm đáy', 
      desc: 'Dòng tiền có xu hướng dịch chuyển sang đầu tư chứng khoán.', 
      tag: 'NGÂN HÀNG', 
      time: '25P', 
      img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 3, 
      title: 'FPT công bố lợi nhuận kỷ lục', 
      desc: 'Mảng xuất khẩu phần mềm tăng trưởng 40% trong quý 4.', 
      tag: 'CÔNG NGHỆ', 
      time: '1H', 
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 4, 
      title: 'Giá vàng SJC bất ngờ quay đầu', 
      desc: 'Áp lực chốt lời khiến giá vàng giảm mạnh sau đỉnh 90 triệu.', 
      tag: 'VÀNG', 
      time: '2H', 
      img: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 5, 
      title: 'Bitcoin vượt 105.000 USD', 
      desc: 'Làn sóng ETF tiếp tục đẩy giá BTC lập đỉnh lịch sử mới.', 
      tag: 'CRYPTO', 
      time: '3H', 
      img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop' 
    }
  ];

  const experts = [
    { 
      name: 'Warren Buffett', 
      title: 'Tỷ phú đầu tư', 
      quote: 'Hãy tham lam khi người khác sợ hãi.', 
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop' 
    },
    { 
      name: 'Charlie Munger', 
      title: 'Phó chủ tịch Berkshire', 
      quote: 'Người thông minh học từ sai lầm của người khác.', 
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' 
    },
    { 
      name: 'Ray Dalio', 
      title: 'Huyền thoại quỹ đầu cơ', 
      quote: 'Nếu bạn không thất bại, bạn không đang tiến bộ.', 
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop' 
    },
    { 
      name: 'Peter Lynch', 
      title: 'Bậc thầy tăng trưởng', 
      quote: 'Hãy đầu tư vào những gì bạn hiểu rõ.', 
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' 
    }
  ];

  const marketNewsList = [
    { 
      title: 'Thị trường chứng khoán bùng nổ cuối năm 2025 với nhiều cơ hội mới', 
      time: '5 PHÚT TRƯỚC', 
      img: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=200&auto=format&fit=crop' 
    },
    { 
      title: 'Nhận định VN-Index: Vùng hỗ trợ 1250 liệu có đủ vững chắc?', 
      time: '30 PHÚT TRƯỚC', 
      img: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=200&auto=format&fit=crop' 
    },
    { 
      title: 'Nhóm cổ phiếu dầu khí dậy sóng nhờ giá dầu thô thế giới hồi phục', 
      time: '1 GIỜ TRƯỚC', 
      img: 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?q=80&w=200&auto=format&fit=crop' 
    },
    { 
      title: 'Dòng vốn FDI đổ bộ vào khu công nghiệp phía Nam tăng đột biến', 
      time: '4 GIỜ TRƯỚC', 
      img: 'https://images.unsplash.com/photo-1565120130276-dfbd9a7a3ad7?q=80&w=200&auto=format&fit=crop' 
    },
  ];

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0a1a11] h-screen max-w-md mx-auto relative transition-colors duration-300 font-body overflow-y-auto overflow-x-hidden custom-scrollbar pb-32 text-slate-900 dark:text-white">
      
      {/* HERO SECTION */}
      <div className="relative h-[260px] w-full overflow-hidden shrink-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop" 
          className="w-full h-full object-cover brightness-[0.9] saturate-[1.2] scale-105" 
          alt="Financial District Header" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#f8fafc] dark:to-[#0a1a11]"></div>
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 px-4 flex items-center justify-between z-10 pt-4">
           {/* Logo TIFA */}
           <Logo size="header" />

           <div className="flex items-center gap-2">
              <button className="size-9 rounded-xl bg-white/40 backdrop-blur-md flex items-center justify-center text-slate-800 border border-white shadow-sm hover:bg-white/60 transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
              <button className="relative size-9 rounded-xl bg-white/40 backdrop-blur-md flex items-center justify-center text-slate-800 border border-white shadow-sm hover:bg-white/60 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-3.5 bg-red-600 rounded-full border border-white text-[7px] font-black flex items-center justify-center text-white shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/profile')} className="size-9 rounded-xl overflow-hidden border border-white bg-slate-100 shadow-md active:scale-95 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
              </button>
           </div>
        </div>

        {/* Greeting */}
        <div className="absolute bottom-12 left-6 z-10 animate-fade-in">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1 font-display">CHÀO BUỔI SÁNG,</p>
            <h2 className="text-slate-900 text-[28px] font-black tracking-tighter font-display leading-tight">Nguyễn Văn A</h2>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="relative z-20 bg-white dark:bg-[#0a1a11] rounded-t-[40px] pt-6 -mt-8 min-h-screen">
        
        {/* Market Title */}
        <div className="px-6 mb-4 flex justify-between items-center">
           <h3 className="text-[13px] font-[900] text-slate-900 dark:text-white uppercase tracking-[0.1em] font-display">THỊ TRƯỜNG CHỨNG KHOÁN</h3>
           <div className="flex items-center gap-2 text-primary dark:text-emerald-400">
              <span className="text-[10px] font-black uppercase tracking-widest">BIỂU ĐỒ</span>
              <span className="material-symbols-outlined text-[20px] font-light">show_chart</span>
           </div>
        </div>

        {/* Seamless Market Section */}
        <div className="flex flex-col animate-fade-in-up mb-8 bg-white dark:bg-[#122118] border-y border-gray-100 dark:border-gray-800 shadow-sm">
           <MiniBoard />
           <div className="h-[1px] bg-gray-50 dark:bg-gray-800/50 mx-4"></div>
           <Watchlist />
        </div>

        {/* QUICK MENU */}
        <div className="px-6 mb-10 grid grid-cols-5 gap-2">
            {quickMenu.map((item, idx) => (
              <div key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 cursor-pointer group active:scale-90 transition-transform">
                  <div className={`size-12 rounded-2xl ${item.bg} flex items-center justify-center shadow-sm`}>
                      <span className={`material-symbols-outlined ${item.color} text-[24px]`}>{item.icon}</span>
                  </div>
                  <span className="text-[9.5px] font-black text-slate-600 dark:text-gray-400 text-center leading-tight uppercase tracking-tighter">
                    {item.label}
                  </span>
              </div>
            ))}
        </div>

        {/* TIN TỨC HOT */}
        <section className="mb-10">
           <div className="px-6 flex justify-between items-center mb-5">
               <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500 filled text-[18px]">local_fire_department</span>
                  <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">TIN TỨC HOT</h3>
               </div>
               <button onClick={() => navigate('/news')} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TẤT CẢ</button>
           </div>
           
           <div className="flex gap-4 overflow-x-auto no-scrollbar px-6">
              {hotNews.map((news) => (
                <div key={news.id} onClick={() => navigate('/news')} className="min-w-[200px] bg-white dark:bg-[#122118] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg shadow-slate-100/50 mb-2">
                    <div className="h-28 w-full overflow-hidden">
                        <img src={news.img} className="w-full h-full object-cover" alt="hot news" />
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{news.tag}</span>
                            <span className="text-[8px] font-black text-slate-300 uppercase">{news.time}</span>
                        </div>
                        <h4 className="text-[13px] font-bold text-slate-800 dark:text-gray-100 line-clamp-2 leading-tight mb-1">{news.title}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{news.desc}</p>
                    </div>
                </div>
              ))}
           </div>
        </section>

        {/* LỜI KHUYÊN CHUYÊN GIA - UPGRADED */}
        <section className="px-6 mb-12">
            <h3 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-5">LỜI KHUYÊN CHUYÊN GIA</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                {experts.map((expert, idx) => (
                  <div key={idx} className="min-w-[260px] bg-slate-50 dark:bg-white/5 p-4 rounded-[32px] border border-gray-100 dark:border-gray-800 shrink-0 flex flex-col gap-3 shadow-sm active:scale-[0.98] transition-transform">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                            <img src={expert.img} className="w-full h-full object-cover" alt={expert.name} />
                        </div>
                        <div>
                            <h5 className="text-[13px] font-bold text-slate-800 dark:text-white leading-none mb-1">{expert.name}</h5>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{expert.title}</span>
                        </div>
                      </div>
                      <div className="relative">
                          <span className="material-symbols-outlined text-primary/20 absolute -top-1 -left-1 text-[24px]">format_quote</span>
                          <p className="text-[11.5px] text-slate-600 dark:text-gray-300 italic leading-relaxed pl-5 font-medium">
                            {expert.quote}
                          </p>
                      </div>
                  </div>
                ))}
            </div>
        </section>

        {/* TIN TỨC THỊ TRƯỜNG LIST */}
        <section className="px-6 pb-12">
           <div className="flex justify-between items-center mb-6">
               <h3 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.3em]">TIN TỨC THỊ TRƯỜNG</h3>
               <button onClick={() => navigate('/news')} className="text-[10px] font-black text-primary dark:text-emerald-500 uppercase tracking-widest border-b border-primary/20 pb-0.5">XEM TẤT CẢ</button>
           </div>
           
           <div className="space-y-8">
              {marketNewsList.map((item, idx) => (
                <div key={idx} className="flex gap-5 group cursor-pointer" onClick={() => navigate('/news')}>
                    <div className="size-20 rounded-[24px] overflow-hidden shrink-0 shadow-lg border border-white">
                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="news" />
                    </div>
                    <div className="flex flex-col justify-center gap-1.5 flex-1">
                        <h4 className="text-[15px] font-bold text-slate-800 dark:text-gray-100 line-clamp-2 leading-tight font-display group-hover:text-primary transition-colors">
                           {item.title}
                        </h4>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.time}</span>
                    </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <BottomNav />
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 1.2s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default Home;
