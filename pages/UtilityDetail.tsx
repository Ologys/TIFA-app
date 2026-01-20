import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, Cell, BarChart, Bar, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, LineChart, Line, Legend, ComposedChart 
} from 'recharts';

const UtilityDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [type]);

  const renderContent = () => {
    switch (type) {
      case 'filter':
        return <StockFilterView />;
      case 'gold':
        return <GoldPriceView />;
      case 'world':
        return <WorldMarketView />;
      case 'crypto':
        return <CryptoMarketView />;
      case 'rates':
        return <ExchangeRatesView />;
      case 'compare':
        return <StockComparisonView />;
      case 'technical':
        return <TechnicalAnalysisView />;
      default:
        return <div className="p-10 text-center opacity-50 font-bold font-display uppercase tracking-widest text-[10px]">Chức năng đang phát triển...</div>;
    }
  };

  // Hình ảnh bạc metallic cao cấp cho header
  const silverHeader = 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=1200&auto=format&fit=crop';
  
  // Cập nhật hình ảnh chuyên biệt cho Chứng khoán Thế giới (World Stocks)
  const worldStockHeader = 'https://sf-static.upanhlaylink.com/img/image_20260120e4643864a9ea615ac439d9255735df7d.jpg';

  // Hình ảnh chuyên biệt cho Phân tích kỹ thuật (Technical Analysis) từ link người dùng cung cấp
  const technicalAnalysisHeader = 'https://sf-static.upanhlaylink.com/img/image_2026012061e9b3826a107aa3ec028a710380dc8c.jpg';

  const utilityConfig: Record<string, { title: string; img: string; icon: string }> = {
    filter: { 
      title: 'BỘ LỌC CỔ PHIẾU', 
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      icon: 'filter_alt'
    },
    gold: { 
      title: 'GIÁ VÀNG TRỰC TUYẾN', 
      img: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1000&auto=format&fit=crop',
      icon: 'database'
    },
    world: { 
      title: 'CHỨNG KHOÁN THẾ GIỚI', 
      img: worldStockHeader,
      icon: 'public'
    },
    crypto: { 
      title: 'THỊ TRƯỜNG CRYPTO', 
      img: 'https://images.unsplash.com/photo-1518546305927-5a555bb70200?q=80&w=1000&auto=format&fit=crop',
      icon: 'currency_bitcoin'
    },
    rates: { 
      title: 'TỶ GIÁ NGOẠI TỆ', 
      img: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=1000&auto=format&fit=crop',
      icon: 'currency_exchange'
    },
    compare: { 
      title: 'SO SÁNH CỔ PHIẾU', 
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      icon: 'balance'
    },
    technical: { 
      title: 'PHÂN TÍCH KỸ THUẬT', 
      img: technicalAnalysisHeader,
      icon: 'monitoring'
    }
  };

  const config = utilityConfig[type || ''] || { title: 'TIỆN ÍCH', img: silverHeader, icon: 'grid_view' };

  // Kiểm tra xem có đang ở view metallic/dark không để chỉnh style header
  const isSpecialHeader = type === 'world' || type === 'technical';

  return (
    <div className="bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 max-w-md mx-auto shadow-2xl relative transition-colors duration-300 font-display overflow-x-hidden text-slate-900 dark:text-white text-[14px]">
      
      {/* 1. PREMIUM HEADER SECTION */}
      <div className="relative h-[220px] w-full overflow-hidden shrink-0">
        <img 
          src={config.img} 
          className={`w-full h-full object-cover ${isSpecialHeader ? 'brightness-[0.45] saturate-[1.2]' : 'brightness-[0.4] saturate-[1.2]'}`} 
          alt="utility-header" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-background-dark via-transparent to-black/30"></div>

        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-8">
          <button 
            onClick={() => navigate('/market')} 
            className="size-11 rounded-full backdrop-blur-md border bg-black/40 border-white/10 text-white flex items-center justify-center transition-all active:scale-90"
          >
             <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          
          <div className="size-11 rounded-full backdrop-blur-md border border-primary/30 bg-primary/20 text-primary flex items-center justify-center shadow-lg transition-all shadow-primary/20">
             <span className="material-symbols-outlined text-[22px] filled">{config.icon}</span>
          </div>
        </div>

        {/* Title Area */}
        <div className="absolute bottom-10 left-8 z-20">
            <h2 className="text-[30px] font-black tracking-tighter leading-none uppercase italic text-white drop-shadow-2xl">
              {config.title}
            </h2>
            <div className="w-14 h-1.5 bg-[#1d7139] mt-3 rounded-full shadow-[0_2px_8px_rgba(29,113,57,0.4)]"></div>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-0">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-5">
             <div className="size-12 border-[3px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center px-10 animate-pulse">Đang đồng bộ dữ liệu thị trường...</p>
          </div>
        ) : (
          <div className="animate-fade-in">{renderContent()}</div>
        )}
      </div>

      <BottomNav />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

/* --- CÁC VIEW CHI TIẾT --- */

const GoldPriceView = () => {
  const providers = [
    { name: 'SJC TP.HCM', buy: '89.00', sell: '91.00', diff: '+200k', up: true },
    { name: 'SJC HÀ NỘI', buy: '89.00', sell: '91.02', diff: '+220k', up: true },
    { name: 'DOJI TP.HCM', buy: '88.50', sell: '90.50', diff: '0.0', up: null },
    { name: 'PNJ TP.HCM', buy: '87.20', sell: '89.10', diff: '-100k', up: false },
    { name: 'VÀNG 9999', buy: '76.40', sell: '77.80', diff: '+50k', up: true },
    { name: 'VÀNG NHẪN', buy: '75.90', sell: '77.30', diff: '+30k', up: true },
  ];

  return (
    <div className="p-5 space-y-6">
       <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden h-52 flex flex-col justify-end">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" 
            alt="Gold bars"
          />
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Giá vàng thế giới</span>
                <span className="text-[11px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">Live</span>
             </div>
             <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black font-mono tracking-tighter">$2,642.50</h3>
                <span className="text-sm font-black text-green-300">/ ounce</span>
             </div>
          </div>
       </div>

       <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.3em] px-2 mb-4">Thị trường trong nước</h3>
          {providers.map((item, idx) => (
             <div key={idx} className="bg-white dark:bg-[#16241c] p-5 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                   <h4 className="text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.name}</h4>
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${item.up === true ? 'bg-green-100 text-green-600' : item.up === false ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                      {item.diff}
                   </span>
                </div>
                <div className="flex gap-4">
                   <div className="flex-1 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Mua vào</span>
                      <p className="text-[18px] font-black text-slate-900 dark:text-white font-mono tracking-tight">{item.buy}</p>
                   </div>
                   <div className="flex-1 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Bán ra</span>
                      <p className="text-[18px] font-black text-slate-900 dark:text-white font-mono tracking-tight">{item.sell}</p>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const CryptoMarketView = () => {
  const coins = [
    { s: 'BTC', n: 'Bitcoin', p: '102,450', c: '+2.45%', up: true, cap: '1.92T', color: 'bg-orange-500' },
    { s: 'ETH', n: 'Ethereum', p: '3,842.15', c: '+1.12%', up: true, cap: '462B', color: 'bg-indigo-500' },
    { s: 'SOL', n: 'Solana', p: '245.80', c: '+5.78%', up: true, cap: '115B', color: 'bg-purple-500' },
    { s: 'BNB', n: 'Binance Coin', p: '620.40', c: '-0.45%', up: false, cap: '92B', color: 'bg-yellow-500' },
    { s: 'XRP', n: 'Ripple', p: '2.14', c: '-1.20%', up: false, cap: '120B', color: 'bg-blue-500' },
  ];

  return (
    <div className="p-5 space-y-6">
       <div className="bg-[#0b0e14] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden h-40 flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=600&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-30" 
            alt="Crypto abstract"
          />
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-4">
               <span className="material-symbols-outlined text-primary text-[28px] filled">monitoring</span>
               <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.25em]">Crypto Sentiment</h3>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-3xl font-black text-white">78</span>
                     <span className="text-[10px] font-black text-green-500 uppercase">Greed</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: '78%' }}></div>
                  </div>
               </div>
            </div>
          </div>
       </div>

       <div className="space-y-4">
          <div className="flex justify-between items-center px-2 mb-2">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Top Assets</h3>
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Market Cap</span>
          </div>
          {coins.map((coin, i) => (
             <div key={i} className="bg-white dark:bg-[#16241c] p-4 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group transition-all hover:border-primary">
                <div className="flex items-center gap-4">
                   <div className={`size-12 ${coin.color} rounded-2xl flex items-center justify-center text-white font-black text-[15px] shadow-lg shadow-black/5`}>
                      {coin.s[0]}
                   </div>
                   <div>
                      <h4 className="text-[15px] font-black text-slate-800 dark:text-white leading-tight">{coin.s}</h4>
                      <span className="text-[10px] font-bold text-gray-400">{coin.n}</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[16px] font-black font-mono text-slate-900 dark:text-white tracking-tighter">${coin.p}</p>
                   <div className="flex items-center justify-end gap-1.5">
                      <span className={`text-[10px] font-black ${coin.up ? 'text-green-500' : 'text-red-500'}`}>{coin.c}</span>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const WorldMarketView = () => {
  const indices = [
    { n: 'Dow Jones', v: '38,989.12', p: '+0.12%', up: true, region: 'USA' },
    { n: 'S&P 500', v: '5,088.24', p: '+0.45%', up: true, region: 'USA' },
    { n: 'Nasdaq 100', v: '18,124.50', p: '+1.15%', up: true, region: 'USA' },
    { n: 'Nikkei 225', v: '39,120.45', p: '-0.35%', up: false, region: 'JPN' },
    { n: 'Hang Seng', v: '16,450.12', p: '+0.85%', up: true, region: 'HKG' },
  ];

  return (
    <div className="p-5 space-y-6">
       <div className="relative w-full h-40 rounded-[32px] overflow-hidden mb-8 shadow-2xl group border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            alt="Global network flow"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 backdrop-blur-[1px]">
             <div className="text-center animate-fade-in">
                <h4 className="text-white font-black text-[13px] tracking-[0.2em] uppercase opacity-70 mb-2">Thanh khoản toàn cầu</h4>
                <div className="flex items-center justify-center gap-3">
                   <span className="text-primary font-black text-4xl tracking-tighter drop-shadow-lg">$142B</span>
                   <div className="flex flex-col items-start">
                      <span className="text-green-400 font-black text-[15px] leading-none">+12%</span>
                      <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Real-time</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.4em] px-2 mb-2">Chỉ số trọng yếu</h3>
          {indices.map((m, i) => (
             <div key={i} className="bg-white dark:bg-[#16241c] p-5 rounded-[28px] border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-all active:scale-[0.98] shadow-sm hover:border-primary/30">
                <div className="flex items-center gap-4">
                   <div className="size-11 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center font-black text-[10px] text-gray-500 border border-gray-100 dark:border-gray-800 shadow-inner">
                      {m.region}
                   </div>
                   <div>
                      <h4 className="text-[16px] font-black text-slate-800 dark:text-white leading-tight tracking-tight">{m.n}</h4>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Global Indices</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[20px] font-black font-mono leading-none mb-1.5 tracking-tighter text-slate-900 dark:text-white">{m.v}</p>
                   <span className={`text-[10px] font-black px-3 py-1 rounded-full ${m.up ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {m.p}
                   </span>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const StockComparisonView = () => {
  const metrics = [
    { label: 'P/E (Lần)', a: '14.2', b: '12.8', best: 'b' },
    { label: 'EPS (VND)', a: '8,245', b: '5,120', best: 'a' },
    { label: 'ROE (%)', a: '28.5', b: '22.1', best: 'a' },
  ];

  const radarData = [
    { subject: 'Hiệu quả', A: 120, B: 110, fullMark: 150 },
    { subject: 'Định giá', A: 98, B: 130, fullMark: 150 },
    { subject: 'Tăng trưởng', A: 86, B: 130, fullMark: 150 },
    { subject: 'Tài chính', A: 99, B: 100, fullMark: 150 },
    { subject: 'Thanh khoản', A: 85, B: 90, fullMark: 150 },
  ];

  return (
    <div className="p-5 space-y-6 pb-20">
       <div className="relative w-full h-36 rounded-[32px] overflow-hidden shadow-2xl mb-4">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.4]" 
            alt="Data analysis"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
             <div className="flex items-center gap-6">
                <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-xl font-black text-white">FPT</div>
                <span className="text-white/40 font-black italic">VS</span>
                <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-xl font-black text-white">MWG</div>
             </div>
             <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-4">Phân tích đối sánh đa chiều</p>
          </div>
       </div>

       <div className="bg-white dark:bg-[#16241c] p-5 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Radar Sức mạnh Tài chính</h3>
          <div className="h-[280px] w-full flex justify-center items-center">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Radar name="FPT" dataKey="A" stroke="#1d7139" fill="#1d7139" fillOpacity={0.6} />
                  <Radar name="MWG" dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
             </ResponsiveContainer>
          </div>
       </div>

       <div className="space-y-3">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Các chỉ số then chốt</h3>
          {metrics.map((m, i) => (
             <div key={i} className="bg-white dark:bg-[#16241c] p-4 rounded-[20px] border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">{m.label}</span>
                <div className="flex items-center gap-4">
                   <div className={`flex-1 text-center py-2 rounded-xl text-[16px] font-black font-mono tracking-tight ${m.best === 'a' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-800 dark:text-white'}`}>{m.a}</div>
                   <div className={`flex-1 text-center py-2 rounded-xl text-[16px] font-black font-mono tracking-tight ${m.best === 'b' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'text-slate-800 dark:text-white'}`}>{m.b}</div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const StockFilterView = () => {
  const [activeCategory, setActiveCategory] = useState('KỸ THUẬT');
  const [results, setResults] = useState([
    { s: 'SSI', n: 'Chứng khoán SSI', p: '32.65', c: '+3.82%', v: '24.5M', match: 95 },
    { s: 'HCM', n: 'Chứng khoán HSC', p: '28.10', c: '+2.15%', v: '12.2M', match: 88 },
    { s: 'FTS', n: 'Chứng khoán FPT', p: '48.90', c: '+4.50%', v: '5.4M', match: 84 },
  ]);
  
  const filterCategories = [
    { id: 'TECH', name: 'KỸ THUẬT', items: ['RSI Quá bán (<30)', 'RSI Quá mua (>70)', 'Golden Cross (MA20/50)', 'Death Cross', 'Nến Hammer'] },
    { id: 'VALUATION', name: 'ĐỊNH GIÁ', items: ['P/E < 15', 'P/B < 2', 'Tỷ suất cổ tức > 5%'] },
    { id: 'GROWTH', name: 'TĂNG TRƯỞNG', items: ['DT tăng trưởng > 20%', 'LN tăng trưởng > 20%'] },
  ];

  return (
    <div className="p-5 space-y-6 pb-24">
       <div className="flex bg-white dark:bg-[#16241c] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 h-[280px] shadow-xl">
          <div className="w-[110px] bg-slate-50 dark:bg-black/20 border-r border-gray-100 dark:border-gray-800 flex flex-col no-scrollbar overflow-y-auto">
             {filterCategories.map(cat => (
                <button 
                   key={cat.id} 
                   onClick={() => setActiveCategory(cat.name)} 
                   className={`w-full text-left p-4 text-[9px] font-black uppercase tracking-tight transition-all border-b border-gray-100 dark:border-white/[0.03] last:border-0 ${activeCategory === cat.name ? 'bg-primary text-white shadow-lg z-10' : 'text-gray-500 hover:text-slate-800'}`}
                >
                   {cat.name}
                </button>
             ))}
          </div>
          <div className="flex-1 p-6 space-y-5 overflow-y-auto no-scrollbar">
             {filterCategories.find(c => c.name === activeCategory)?.items.map(item => (
                <label key={item} className="flex items-center gap-4 cursor-pointer group active:scale-[0.98] transition-all">
                   <div className="relative size-5 rounded-lg bg-slate-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all group-hover:border-primary">
                      <input type="checkbox" className="absolute inset-0 opacity-0 cursor-pointer peer" />
                      <div className="size-2.5 bg-primary rounded-sm scale-0 peer-checked:scale-100 transition-transform"></div>
                   </div>
                   <span className="text-[11px] font-bold text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item}</span>
                </label>
             ))}
          </div>
       </div>
       
       <button className="w-full py-4 bg-primary text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-[20px] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
          Xác nhận tiêu chí lọc
       </button>

       <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Kết quả lọc (03)</h3>
             <span className="material-symbols-outlined text-primary">sync</span>
          </div>
          {results.map((res, i) => (
             <div key={i} className="bg-white dark:bg-[#16241c] p-4 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className="size-11 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex items-center justify-center font-black text-slate-800 dark:text-white">
                      {res.s}
                   </div>
                   <div>
                      <h4 className="text-[14px] font-black leading-none mb-1.5">{res.s}</h4>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{res.n}</span>
                   </div>
                </div>
                <div className="text-right flex items-center gap-4">
                   <div>
                      <p className="text-[14px] font-black font-mono tracking-tighter text-slate-900 dark:text-white">{res.p}</p>
                      <span className="text-[10px] font-black text-green-500">{res.c}</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-primary">{res.match}%</span>
                      <span className="text-[7px] font-black text-gray-400 uppercase">Match</span>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const TechnicalAnalysisView = () => {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const arr = [];
    let base = 30;
    for (let i = 0; i < 40; i++) {
       const change = (Math.random() - 0.4) * 1.5;
       base += change;
       arr.push({
         time: i,
         price: base,
         ma20: base - 1,
         ma50: base - 2,
         vol: Math.random() * 50 + 20,
         rsi: 40 + Math.random() * 30
       });
    }
    setData(arr);
  }, []);

  return (
    <div className="bg-[#0b0e14] min-h-screen text-white font-sans overflow-x-hidden pb-24">
      {/* 1. CHART SUMMARY HEADER */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
           <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded uppercase tracking-widest border border-primary/20">HOSE</span>
              </div>
              <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-primary font-mono tracking-tighter">32.65</span>
                 <div className="flex flex-col text-[11px] font-black text-green-500 leading-none">
                    <span>+1.20</span>
                    <span className="mt-0.5">+3.82%</span>
                 </div>
              </div>
           </div>
           <div className="text-right">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Thanh khoản</span>
              <p className="text-[18px] font-black text-white font-mono tracking-tighter">24.5M <span className="text-[10px] text-gray-500">CP</span></p>
           </div>
        </div>
      </div>

      {/* 2. PRO CHART AREA */}
      <div className="h-[320px] w-full px-2 mt-4 relative">
         <div className="absolute top-0 left-6 z-10 flex gap-4 text-[9px] font-black uppercase tracking-widest">
            <span className="text-[#3b82f6]">MA20</span>
            <span className="text-[#f59e0b]">MA50</span>
            <span className="text-gray-500">Volume</span>
         </div>
         <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
               <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#1d7139" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#1d7139" stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <CartesianGrid vertical={false} stroke="#ffffff" opacity={0.05} />
               <XAxis dataKey="time" hide />
               <YAxis orientation="right" domain={['auto', 'auto']} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} width={40} />
               <YAxis yAxisId="vol" domain={[0, 150]} hide />
               <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
               
               <Bar yAxisId="vol" dataKey="vol" fill="#334155" opacity={0.3} barSize={6} />
               <Area type="monotone" dataKey="price" stroke="#1d7139" strokeWidth={3} fill="url(#colorPrice)" isAnimationActive={false} dot={false} />
               <Line type="monotone" dataKey="ma20" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
               <Line type="monotone" dataKey="ma50" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </ComposedChart>
         </ResponsiveContainer>
      </div>

      {/* 3. RSI SUB-CHART */}
      <div className="h-[80px] w-full px-2 mt-2">
         <div className="px-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
            <span>RSI (14)</span>
            <span className="text-primary">62.4</span>
         </div>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
               <YAxis domain={[0, 100]} hide />
               <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" opacity={0.2} />
               <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" opacity={0.2} />
               <Line type="monotone" dataKey="rsi" stroke="#a855f7" strokeWidth={1} dot={false} isAnimationActive={false} />
            </LineChart>
         </ResponsiveContainer>
      </div>

      {/* 4. AI TECHNICAL SUMMARY CARD */}
      <div className="p-6">
         <div className="bg-[#1e293b]/50 rounded-[32px] p-6 border border-white/5 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-6">
               <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg border border-primary/20">
                  <span className="material-symbols-outlined filled text-[28px]">smart_toy</span>
               </div>
               <div>
                  <h3 className="text-[12px] font-black text-primary uppercase tracking-[0.2em] leading-none">Ology Tech-Insight</h3>
                  <p className="text-[10px] text-gray-500 font-bold mt-1.5 uppercase">Tín hiệu tổng hợp thời gian thực</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">Technical Score</span>
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-black text-green-500">84</span>
                     <span className="text-[10px] font-black text-gray-600">/ 100</span>
                  </div>
               </div>
               <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">Khuyến nghị AI</span>
                  <span className="text-[13px] font-black text-primary uppercase tracking-widest">STRONG BUY</span>
               </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
               <p className="text-[11.5px] text-gray-300 font-medium leading-relaxed italic">
                 "Mã SSI đang duy trì xu hướng tăng mạnh trên các đường trung bình MA. RSI chưa chạm ngưỡng quá mua, cho thấy dư địa tăng trưởng vẫn còn lớn. Vùng hỗ trợ cứng quanh 31.5."
               </p>
            </div>
         </div>
      </div>

      {/* 5. TABLE METRICS */}
      <div className="px-6 space-y-4">
         <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Chỉ số kỹ thuật quan trọng</h3>
         <div className="bg-white/5 rounded-[28px] overflow-hidden border border-white/5">
            {[
               { l: 'RSI (14)', v: '62.45', s: 'Tích cực', c: 'text-green-500' },
               { l: 'MACD (12,26,9)', v: '0.42', s: 'Cắt lên', c: 'text-green-500' },
               { l: 'Stochastic', v: '78.20', s: 'Vùng mua', c: 'text-primary' },
               { l: 'ATR (14)', v: '0.85', s: 'Biến động thấp', c: 'text-gray-400' },
            ].map((row, i) => (
               <div key={i} className="flex justify-between items-center p-4 border-b border-white/[0.03] last:border-0">
                  <span className="text-[12px] font-bold text-gray-400">{row.l}</span>
                  <div className="text-right">
                     <p className="text-[13px] font-black font-mono">{row.v}</p>
                     <span className={`text-[9px] font-black uppercase ${row.c}`}>{row.s}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const ExchangeRatesView = () => {
  const rates = [
    { s: 'USD/VND', n: 'Đô la Mỹ', buy: '25,240', sell: '25,480', up: true },
    { s: 'EUR/VND', n: 'Euro', buy: '27,150', sell: '27,650', up: true },
    { s: 'JPY/VND', n: 'Yên Nhật', buy: '168.45', sell: '172.10', up: false },
  ];

  return (
    <div className="p-5 space-y-6">
       <div className="relative w-full h-32 rounded-[28px] overflow-hidden mb-4 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=600&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.5]" 
            alt="Exchange rates"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6">
             <div className="text-center">
                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Cập nhật liên tục 24/7</span>
                <h4 className="text-white font-black text-2xl tracking-tighter uppercase mt-1">Tỷ giá ngoại tệ</h4>
             </div>
          </div>
       </div>

       <div className="bg-white dark:bg-[#16241c] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          <div className="bg-primary/10 p-5 flex items-center justify-between border-b border-primary/10">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">account_balance</span>
                <span className="text-[13px] font-black text-primary uppercase tracking-widest">Bảng tỷ giá</span>
             </div>
          </div>
          <div className="p-0 divide-y divide-gray-50 dark:divide-white/[0.04]">
             {rates.map((rate, i) => (
                <div key={i} className="p-5 flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                   <div className="flex flex-col">
                      <h4 className="text-[16px] font-black text-slate-800 dark:text-white leading-tight">{rate.s}</h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{rate.n}</span>
                   </div>
                   <div className="flex gap-6">
                      <div className="text-center">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Mua</span>
                         <p className="text-[15px] font-black text-slate-800 dark:text-white font-mono tracking-tight">{rate.buy}</p>
                      </div>
                      <div className="text-center">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Bán</span>
                         <p className="text-[15px] font-black text-slate-800 dark:text-white font-mono tracking-tight">{rate.sell}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default UtilityDetail;
