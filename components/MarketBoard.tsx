import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MarketStock {
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM' | 'VN30';
  ref: number;
  ceil: number;
  floor: number;
  bidP1: number;
  bidV1: number;
  price: number;
  changePercent: number;
  totalVol: number;
}

const generateStock = (symbol: string, ref: number, exchange: 'HOSE' | 'HNX' | 'UPCOM' | 'VN30', name: string): MarketStock => {
  const range = exchange === 'VN30' ? 0.07 : 0.1;
  const ceil = Math.floor(ref * (1 + range) * 100) / 100;
  const floor = Math.floor(ref * (1 - range) * 100) / 100;
  const changeP = (Math.random() - 0.4) * range;
  const price = Math.round((ref * (1 + changeP)) * 100) / 100;
  
  return {
    symbol,
    name,
    exchange,
    ref,
    ceil,
    floor,
    bidP1: Math.round((price - 0.05) * 100) / 100,
    bidV1: Math.floor(Math.random() * 5000) * 10,
    price,
    changePercent: changeP * 100,
    totalVol: Math.floor(Math.random() * 1000000)
  };
};

const INITIAL_STOCKS: MarketStock[] = [
  generateStock('ACB', 24.5, 'VN30', 'ACB Bank'),
  generateStock('BCM', 68.2, 'VN30', 'Becamex'),
  generateStock('BID', 40.95, 'VN30', 'BIDV Bank'),
  generateStock('BVH', 42.0, 'VN30', 'Bảo Việt'),
  generateStock('CTG', 34.0, 'VN30', 'Vietinbank'),
  generateStock('FPT', 98.2, 'VN30', 'FPT Corp'),
  generateStock('GAS', 78.0, 'VN30', 'PV Gas'),
  generateStock('GVR', 32.0, 'VN30', 'Tập đoàn Cao su'),
  generateStock('HDB', 22.5, 'VN30', 'HDBank'),
  generateStock('HPG', 28.4, 'VN30', 'Hòa Phát'),
  generateStock('MBB', 22.5, 'VN30', 'MBBank'),
  generateStock('MSN', 70.0, 'VN30', 'Masan Group'),
  generateStock('MWG', 48.0, 'VN30', 'Thế Giới Di Động'),
  generateStock('PLX', 36.0, 'VN30', 'Petrolimex'),
];

type FilterType = 'DANH MỤC' | 'VN30' | 'HOSE' | 'HNX' | 'UPCOM';

const MarketBoard: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<MarketStock[]>(INITIAL_STOCKS);
  const [filter, setFilter] = useState<FilterType>('VN30');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tifa_favorites') || '[]');
    setFavorites(saved);
  }, []);

  const getPriceColor = (s: MarketStock) => {
    if (s.price >= s.ceil) return 'text-purple-500';
    if (s.price <= s.floor) return 'text-cyan-400';
    if (s.price > s.ref) return 'text-green-500';
    if (s.price < s.ref) return 'text-red-500';
    return 'text-yellow-500';
  };

  const formatVol = (v: number) => {
    if (v > 1000) return (v/1000).toFixed(1) + 'k';
    return v;
  };

  return (
    <div className="bg-[#101622] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col h-full">
      {/* TABS HEADER */}
      <div className="flex bg-[#1e293b] p-1 border-b border-gray-800">
          {['DANH MỤC', 'VN30', 'HOSE', 'HNX', 'UPCOM'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as FilterType)}
                className={`flex-1 py-2 rounded text-[10px] font-bold uppercase transition-all ${
                    filter === f 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                  {f}
              </button>
          ))}
      </div>
      
      {/* TABLE HEADER */}
      <div className="grid grid-cols-[80px_60px_60px_60px_1fr] bg-[#101622] text-[9px] font-bold text-gray-500 uppercase border-b border-gray-800">
        <div className="p-2 border-r border-gray-800">MÃ CK</div>
        <div className="p-2 text-right">TRẦN</div>
        <div className="p-2 text-right">SÀN</div>
        <div className="p-2 text-right">TC</div>
        <div className="p-2 text-right">MUA G1</div>
      </div>

      {/* TABLE BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-800/50">
        {stocks.map((s) => {
          const isFav = favorites.includes(s.symbol);
          return (
            <div 
                key={s.symbol} 
                onClick={() => navigate(`/asset/${s.symbol.toLowerCase()}`)}
                className="grid grid-cols-[80px_60px_60px_60px_1fr] items-center text-[13px] hover:bg-white/5 transition-colors cursor-pointer"
            >
                <div className="p-2 border-r border-gray-800 flex items-center justify-between">
                    <span className={`font-bold ${getPriceColor(s)}`}>{s.symbol}</span>
                    <span className={`material-symbols-outlined text-[14px] ${isFav ? 'text-red-500 filled' : 'text-gray-600'}`}>
                        {isFav ? 'favorite' : 'favorite'}
                    </span>
                </div>
                <div className="p-2 text-right font-mono text-purple-500">{s.ceil.toFixed(2)}</div>
                <div className="p-2 text-right font-mono text-cyan-400">{s.floor.toFixed(2)}</div>
                <div className="p-2 text-right font-mono text-yellow-500">{s.ref.toFixed(2)}</div>
                <div className="p-2 text-right font-mono text-green-500">{s.bidP1.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketBoard;