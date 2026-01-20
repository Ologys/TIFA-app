import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  time: string;
  img: string;
  summary: string;
}

interface BusinessIntelligence {
  id: string;
  symbol: string;
  companyName: string;
  reportTitle: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
  growth: string;
}

const News: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isExpanded, setIsExpanded] = useState(false);
  const listTopRef = useRef<HTMLDivElement>(null);

  const categories = ['Tất cả', 'Tin hot', 'Việt Nam', 'Thế giới', 'Tài chính số'];

  const allNews: NewsItem[] = [
    {
      id: 1,
      title: "Vốn ngoại 'đổ bộ' vào thị trường chứng khoán Việt Nam đầu năm 2025",
      category: 'Việt Nam',
      categoryLabel: 'Việt Nam',
      time: '15 phút trước',
      img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop',
      summary: 'Dòng tiền từ các quỹ ETF khu vực Đông Nam Á đang có xu hướng dịch chuyển mạnh mẽ vào nhóm VN30.'
    },
    {
      id: 2,
      title: "Bitcoin vượt ngưỡng 105.000 USD: Kỷ nguyên mới của tài chính kỹ thuật số",
      category: 'Tài chính số',
      categoryLabel: 'Tài chính số',
      time: '30 phút trước',
      img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop',
      summary: 'Các chuyên gia dự báo làn sóng chấp nhận tiền điện tử từ các tổ chức tài chính lớn sẽ đẩy giá lên mốc mới.'
    },
    {
      id: 3,
      title: "Fed giữ nguyên lãi suất: Tác động gì đến tỷ giá và thị trường tài chính?",
      category: 'Thế giới',
      categoryLabel: 'Thế giới',
      time: '1 giờ trước',
      img: 'https://sf-static.upanhlaylink.com/img/image_20260120145132fabcc9928b7f66dd18376e5e38.jpg',
      summary: 'Quyết định của Cục Dự trữ Liên bang Mỹ khiến chỉ số đồng USD biến động nhẹ và thị trường chứng khoán thận trọng.'
    },
    {
      id: 4,
      title: "Sốt đất nền quay trở lại tại các khu đô thị vệ tinh xung quanh TP.HCM",
      category: 'Tin hot',
      categoryLabel: 'Bất động sản',
      time: '2 giờ trước',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop',
      summary: 'Nhiều nhà đầu tư bắt đầu tìm kiếm cơ hội khi mặt bằng giá vẫn còn hấp dẫn tại các khu vực ven đô.'
    }
  ];

  const intelligenceReports: BusinessIntelligence[] = [
    {
      id: 'intel-1',
      symbol: 'FPT',
      companyName: 'FPT Corporation',
      reportTitle: 'Báo cáo tăng trưởng mảng AI & Cloud Q4/2024',
      date: '16/01/2025',
      sentiment: 'positive',
      tags: ['Tăng trưởng nóng', 'AI Core'],
      growth: '+42%'
    },
    {
      id: 'intel-2',
      symbol: 'VCB',
      companyName: 'Vietcombank',
      reportTitle: 'Phân tích nợ xấu và trích lập dự phòng rủi ro',
      date: '15/01/2025',
      sentiment: 'neutral',
      tags: ['An toàn vốn', 'Dòng tiền lớn'],
      growth: '+12%'
    },
    {
      id: 'intel-3',
      symbol: 'HPG',
      companyName: 'Hòa Phát Group',
      reportTitle: 'Kế hoạch vận hành lò cao Dung Quất 2',
      date: '14/01/2025',
      sentiment: 'positive',
      tags: ['Đầu tư công', 'Sản lượng'],
      growth: '+28%'
    }
  ];

  const tickerStocks = [
    { s: 'VCB', p: '92.4', c: '+1.2%', up: true },
    { s: 'FPT', p: '112.5', c: '+2.5%', up: true },
    { s: 'VIC', p: '44.2', c: '-0.8%', up: false },
    { s: 'HPG', p: '28.7', c: '+0.5%', up: true },
  ];

  const filteredNews = activeCategory === 'Tất cả' ? allNews : allNews.filter(n => n.category === activeCategory);
  const visibleNews = isExpanded ? filteredNews : filteredNews.slice(0, 4);

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0a1a11] min-h-screen pb-32 max-w-md mx-auto shadow-2xl relative transition-colors duration-300 font-display overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* Header Section */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" 
          className="w-full h-full object-cover scale-110 brightness-[0.35] transition-all duration-1000" 
          alt="news-header-bg" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#f8fafc] dark:to-[#0a1a11]"></div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-5">
          <Logo size="header" />
          <button onClick={() => navigate('/profile')} className="size-9 rounded-full overflow-hidden border border-white/30 shadow-lg bg-black/40 backdrop-blur-md active:scale-95 transition-transform">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </button>
        </div>

        <div className="absolute bottom-14 left-8 z-20 pr-6">
            <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.5em] mb-1">TRUNG TÂM TIN TỨC</p>
            <h2 className="text-white text-[32px] font-black tracking-tighter drop-shadow-2xl mb-1 leading-none">
              Thị trường {activeCategory === 'Tất cả' ? 'Toàn cầu' : activeCategory}
            </h2>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/40 backdrop-blur-md py-3 border-t border-white/5 overflow-hidden">
           <div className="animate-ticker-line flex items-center">
              {[...tickerStocks, ...tickerStocks, ...tickerStocks, ...tickerStocks].map((stock, i) => (
                <div key={i} className="flex items-center gap-2 mx-5 whitespace-nowrap">
                   <span className="text-[10px] font-extrabold text-white/90 tracking-wider">{stock.s}</span>
                   <span className={`text-[10px] font-mono font-black ${stock.up ? 'text-green-400' : 'text-rose-500'}`}>{stock.p}</span>
                   <span className={`text-[8px] font-bold flex items-center gap-0.5 ${stock.up ? 'text-green-500/80' : 'text-rose-500/80'}`}>{stock.c}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="sticky top-0 z-[60] bg-[#f8fafc]/95 dark:bg-[#0a1a11]/95 backdrop-blur-2xl py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-5">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap border transition-all
                 ${activeCategory === cat ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 border-gray-100'}
               `}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div ref={listTopRef} className="space-y-6 px-5 mt-6">
        <div className="bg-white dark:bg-[#16241c] rounded-[36px] p-2 shadow-xl border border-gray-50 dark:border-gray-800 shadow-slate-200/50">
          <div className="space-y-1">
             {visibleNews.map((news) => (
                <div key={news.id} className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-[28px] border-b border-gray-50 dark:border-gray-800 last:border-0 group cursor-pointer transition-all">
                   <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0 shadow-sm relative border border-gray-100 dark:border-gray-700">
                      <img src={news.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={news.title} />
                   </div>
                   <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <h3 className="text-[14px] font-bold text-slate-800 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{news.title}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{news.summary}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{news.time}</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
          {filteredNews.length > 4 && (
            <div className="p-6 flex justify-center">
              <button onClick={() => setIsExpanded(!isExpanded)} className="w-full max-w-[240px] py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 text-[10px] font-black text-primary dark:text-emerald-500 uppercase tracking-widest active:scale-95 transition-transform">
                {isExpanded ? 'Thu gọn' : 'Xem thêm tin tức'}
              </button>
            </div>
          )}
        </div>

        {/* --- SECTION: TÌNH BÁO DOANH NGHIỆP --- */}
        <section className="mt-12 animate-fade-in">
           <div className="flex items-center justify-between mb-5 px-2">
              <div className="flex flex-col">
                 <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-[0.25em] leading-none">Tình báo Doanh nghiệp</h3>
                 <span className="text-[9px] text-primary dark:text-emerald-400 font-black uppercase mt-2 tracking-widest">Phân tích chuyên sâu từ TIFA AI</span>
              </div>
              <div className="size-9 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary text-[20px] filled">analytics</span>
              </div>
           </div>

           {/* Container gộp nền trắng */}
           <div className="bg-white dark:bg-[#16241c] border border-gray-100 dark:border-gray-800 rounded-[36px] shadow-xl overflow-hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
              {intelligenceReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                         <div className="size-11 rounded-[16px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-black text-slate-800 dark:text-white text-base shadow-sm border border-gray-100 dark:border-gray-800">
                            {report.symbol}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-[14px] leading-tight">{report.companyName}</h4>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{report.date}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className={`text-[17px] font-black font-mono tracking-tighter ${report.sentiment === 'positive' ? 'text-green-600' : 'text-amber-500'}`}>
                            {report.growth}
                         </span>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Lợi nhuận</p>
                      </div>
                   </div>

                   <p className="text-[13px] font-bold text-slate-700 dark:text-gray-300 line-clamp-2 leading-snug mb-4 group-hover:text-primary transition-colors">
                      {report.reportTitle}
                   </p>

                   <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                         {report.tags.map((tag, idx) => (
                           <span key={idx} className="text-[8px] font-black text-slate-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg uppercase tracking-wider">
                              {tag}
                           </span>
                         ))}
                      </div>
                      <button className="flex items-center gap-1.5 text-[9px] font-black text-primary dark:text-emerald-400 uppercase tracking-widest bg-primary/5 hover:bg-primary/10 px-4 py-1.5 rounded-full transition-all border border-primary/10">
                         Xem Insight <span className="material-symbols-outlined text-[13px]">trending_flat</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-6 px-6 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic text-center">
                Dữ liệu tình báo được TIFA AI tự động cập nhật từ nguồn tin chính thống 24/7.
              </p>
           </div>
        </section>
      </div>

      <BottomNav />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-line {
          display: flex;
          width: max-content;
          animation: tickerScroll 20s linear infinite;
        }
        .animate-ticker-line:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default News;
