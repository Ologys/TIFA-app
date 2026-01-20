
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Đang theo dõi", "Top tăng trưởng", "Giá vàng"];
  
  const getTabData = () => {
    switch (activeTab) {
      case 1:
        return [
          { symbol: 'HPG', price: '28.45', diff: '+1.25', pct: '(+4.59%)', isUp: true },
          { symbol: 'SSI', price: '36.80', diff: '+1.50', pct: '(+4.25%)', isUp: true },
          { symbol: 'MWG', price: '62.10', diff: '+2.40', pct: '(+4.02%)', isUp: true },
          { symbol: 'DGC', price: '124.5', diff: '+4.80', pct: '(+3.95%)', isUp: true },
          { symbol: 'TCB', price: '34.20', diff: '+0.50', pct: '(+1.48%)', isUp: true },
          { symbol: 'MBB', price: '24.15', diff: '+0.45', pct: '(+1.90%)', isUp: true },
          { symbol: 'STB', price: '31.20', diff: '+0.65', pct: '(+2.13%)', isUp: true },
        ];
      case 2:
        return [
          { symbol: 'SJC', price: '89.50', diff: '+0.50', pct: '(+0.56%)', isUp: true },
          { symbol: '9999', price: '76.20', diff: '+0.80', pct: '(+1.06%)', isUp: true },
          { symbol: 'NHẪN', price: '75.40', diff: '-0.20', pct: '(-0.26%)', isUp: false },
          { symbol: 'PNJ', price: '105.35', diff: '+0.30', pct: '(+0.40%)', isUp: true },
          { symbol: 'DOJI', price: '76.15', diff: '+0.25', pct: '(+0.33%)', isUp: true },
          { symbol: 'BẢO T.', price: '77.10', diff: '+0.40', pct: '(+0.52%)', isUp: true },
        ];
      default:
        return [
          { symbol: 'VCB', price: '76.00', diff: '+2.00', pct: '(+2.70%)', isUp: true },
          { symbol: 'GAS', price: '107.00', diff: '+3.30', pct: '(+3.18%)', isUp: true },
          { symbol: 'VIC', price: '160.20', diff: '-7.70', pct: '(-4.59%)', isUp: false },
          { symbol: 'FPT', price: '112.50', diff: '+1.20', pct: '(+1.08%)', isUp: true },
          { symbol: 'VHM', price: '42.30', diff: '-0.50', pct: '(-1.17%)', isUp: false },
          { symbol: 'VRE', price: '22.80', diff: '+0.15', pct: '(+0.66%)', isUp: true },
          { symbol: 'PLX', price: '38.45', diff: '+0.35', pct: '(+0.92%)', isUp: true },
          { symbol: 'BID', price: '48.90', diff: '-0.10', pct: '(-0.20%)', isUp: false },
        ];
    }
  };

  const currentData = getTabData();

  return (
    <div className="flex flex-col bg-white dark:bg-[#122118]">
      {/* Tabs Menu */}
      <div className="flex px-4 pt-2.5 border-b border-gray-100 dark:border-gray-800/50 overflow-x-auto no-scrollbar gap-5">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`pb-2 text-[13px] font-black whitespace-nowrap transition-all relative ${
              activeTab === idx 
              ? 'text-primary dark:text-emerald-400' 
              : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === idx && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary dark:bg-emerald-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Grid mã chứng khoán - Được tối ưu để "lướt" mượt mà */}
      <div className="flex items-center py-4 overflow-x-auto no-scrollbar scroll-smooth">
        {currentData.map((item, idx) => (
          <div 
            key={item.symbol} 
            onClick={() => {
              if (activeTab !== 2) navigate(`/asset/${item.symbol.toLowerCase()}`);
            }}
            className={`flex-1 min-w-[95px] px-3.5 cursor-pointer active:opacity-70 transition-all ${
              idx !== 0 ? 'border-l border-gray-100 dark:border-gray-800/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1 gap-1.5">
              <span className="text-[13px] font-black text-slate-900 dark:text-white leading-none tracking-tighter">{item.symbol}</span>
              <span className="text-[13px] font-black text-slate-900 dark:text-white leading-none">{item.price}</span>
            </div>
            <div className={`text-[10px] font-black ${item.isUp ? 'text-green-500' : 'text-rose-500'} leading-tight`}>
              <div>{item.diff}</div>
              <div>{item.pct}</div>
            </div>
          </div>
        ))}
        {/* Padding cuối để lướt mượt hơn */}
        <div className="min-w-[16px] h-4"></div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center px-4 py-2 border-t border-gray-50 dark:border-gray-800">
        <button className="flex items-center gap-1 text-primary dark:text-emerald-400 font-black text-[13px] active:scale-95 transition-transform">
          Thêm mã <span className="material-symbols-outlined text-[17px] filled">add_circle</span>
        </button>
        <button 
          onClick={() => navigate('/market')}
          className="flex items-center gap-0.5 text-gray-400 dark:text-gray-500 font-bold text-[13px] hover:text-primary transition-colors"
        >
          Tất cả <span className="material-symbols-outlined text-[17px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Watchlist;
