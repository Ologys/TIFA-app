
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaChart, Area, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const AssetDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const symbol = id ? id.toUpperCase() : 'VHM';
  
  // Market Data State
  const [price, setPrice] = useState(45.00);
  const [refPrice] = useState(44.50);
  const [data, setData] = useState<any[]>([]);
  const [volume, setVolume] = useState(100); 
  
  // User Portfolio State
  const [balance, setBalance] = useState(100000); 
  const [holdings, setHoldings] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderMode, setOrderMode] = useState<'MP' | 'LO'>('MP');
  const [limitPrice, setLimitPrice] = useState(45.00);
  const [aiAdvice, setAiAdvice] = useState<{
      decision: string; 
      reason: string;
      confidence: number;
      indicators: { rsi: number; macd: string; trend: string }
  } | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  // Market Depth Simulation
  const [depth, setDepth] = useState({
      buy: [
        { p: 44.95, v: '12,5k', w: 85 },
        { p: 44.90, v: '30,2k', w: 100 },
        { p: 44.85, v: '18,4k', w: 60 }
      ],
      sell: [
        { p: 45.05, v: '42,1k', w: 90 },
        { p: 45.10, v: '25,6k', w: 70 },
        { p: 45.15, v: '12,0k', w: 40 }
      ]
  });

  useEffect(() => {
    const savedBalance = localStorage.getItem('tifa_balance');
    const savedPortfolio = localStorage.getItem('tifa_portfolio');
    const savedFavs = JSON.parse(localStorage.getItem('tifa_favorites') || '[]');
    
    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedPortfolio) {
        const port = JSON.parse(savedPortfolio);
        setHoldings(port[symbol] || 0);
    }
    if (savedFavs.includes(symbol)) {
        setIsFavorite(true);
    }

    const initData = [];
    let p = refPrice;
    for (let i = 0; i < 50; i++) {
        p = p + (Math.random() - 0.5) * 0.2;
        initData.push({ time: i, price: p });
    }
    setData(initData);
    setPrice(p);
    setLimitPrice(p);
  }, [symbol, refPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const change = (Math.random() - 0.5) * 0.15;
        const newPrice = Number((prev + change).toFixed(2));
        setData(prevData => [...prevData.slice(1), { time: prevData[prevData.length-1].time + 1, price: newPrice }]);
        return newPrice;
      });

      // Flick depth values
      setDepth(prev => ({
        buy: prev.buy.map(b => ({ ...b, v: (Math.random() * 50).toFixed(1) + 'k', w: Math.random() * 100 })),
        sell: prev.sell.map(s => ({ ...s, v: (Math.random() * 50).toFixed(1) + 'k', w: Math.random() * 100 }))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const change = price - refPrice;
  const changePercent = (change / refPrice) * 100;
  const isUp = change >= 0;
  const color = isUp ? '#22c55e' : '#ef4444'; 

  const handleAskTIFA = async () => {
    setIsConsulting(true);
    setAiAdvice(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Mã ${symbol} giá ${price}. Đưa ra khuyến nghị MUA/BÁN ngắn gọn.`
        });
        const text = res.text || "";
        let decision = "THEO DÕI";
        if (text.toUpperCase().includes("MUA")) decision = "MUA";
        else if (text.toUpperCase().includes("BÁN")) decision = "BÁN";
        setAiAdvice({ 
            decision, 
            reason: text.slice(0, 80),
            confidence: 90,
            indicators: { rsi: 45, macd: "Tích cực", trend: "Tăng" }
        });
    } catch (e) {
        setAiAdvice({ decision: "---", reason: "AI đang bận.", confidence: 0, indicators: { rsi: 0, macd: "-", trend: "-" } });
    } finally {
        setIsConsulting(false);
    }
  };

  const handleOrder = () => {
      const execPrice = orderMode === 'MP' ? price : limitPrice;
      const totalValue = execPrice * volume;
      if (activeTab === 'buy' && totalValue > balance) { alert("Số dư không đủ!"); return; }
      if (activeTab === 'sell' && volume > holdings) { alert("Không đủ hàng!"); return; }
      
      const newBalance = activeTab === 'buy' ? balance - totalValue : balance + totalValue;
      const newHoldings = activeTab === 'buy' ? holdings + volume : holdings - volume;
      setBalance(newBalance); setHoldings(newHoldings);
      localStorage.setItem('tifa_balance', newBalance.toString());
      const port = JSON.parse(localStorage.getItem('tifa_portfolio') || '{}');
      port[symbol] = newHoldings;
      localStorage.setItem('tifa_portfolio', JSON.stringify(port));
      alert(`Khớp lệnh ${activeTab.toUpperCase()} ${volume} ${symbol} thành công!`);
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0a1a11] min-h-screen pb-safe max-w-md mx-auto shadow-2xl flex flex-col text-slate-900 dark:text-white font-body overflow-hidden transition-all duration-500">
       
       {/* 1. HEADER */}
       <div className="sticky top-0 z-50 flex items-center justify-between bg-white/90 dark:bg-[#0a1a11]/90 backdrop-blur-xl px-4 py-3 border-b border-gray-100 dark:border-gray-800">
         <div onClick={() => navigate(-1)} className="flex items-center gap-3 cursor-pointer group">
             <span className="material-symbols-outlined text-slate-800 dark:text-white text-2xl group-active:scale-90 transition-transform">arrow_back</span>
             <div className="flex flex-col">
                <h1 className="text-[17px] font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">{symbol}</h1>
                <span className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">Real-time Trading</span>
             </div>
         </div>
         <div className="flex items-center gap-3">
            <button onClick={() => setIsFavorite(!isFavorite)} className={`size-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-gray-100 dark:border-gray-800 ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'filled' : ''}`}>favorite</span>
            </button>
            <span onClick={() => navigate('/home')} className="material-symbols-outlined text-slate-400 font-light cursor-pointer hover:text-primary">home</span>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto no-scrollbar">
           {/* 2. PRICE HUD & CHART */}
           <div className="px-5 py-6 flex justify-between items-end border-b border-gray-50 dark:border-gray-800/50">
             <div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Giá khớp lệnh</div>
                <h1 className={`text-4xl font-mono font-black tracking-tighter ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {price.toFixed(2)}
                </h1>
             </div>
             <div className={`flex flex-col items-end gap-1 mb-1 font-mono font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                <div className="text-lg leading-none">{isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%</div>
                <div className="text-[11px] opacity-60">Khối lượng: 1.2M</div>
             </div>
           </div>

           <div className="h-[200px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                 <defs>
                   <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
                     <stop offset="95%" stopColor={color} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <YAxis domain={['auto', 'auto']} hide />
                 <ReferenceLine y={refPrice} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.3} />
                 <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2.5} fill="url(#colorPrice)" isAnimationActive={false} />
               </AreaChart>
             </ResponsiveContainer>
           </div>

           {/* 3. MARKET DEPTH SIMULATION */}
           <div className="px-5 mt-6 mb-4 grid grid-cols-2 gap-8 relative">
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3"><span>Bên mua</span><span>KL</span></div>
                 {depth.buy.map((b, i) => (
                    <div key={i} className="flex justify-between items-center relative h-6 overflow-hidden">
                       <div className="absolute right-0 top-0 bottom-0 bg-green-500/5" style={{ width: `${b.w}%` }}></div>
                       <span className="text-[12px] font-mono font-black text-green-500 relative z-10">{b.p.toFixed(2)}</span>
                       <span className="text-[10px] font-mono text-slate-600 dark:text-gray-400 relative z-10">{b.v}</span>
                    </div>
                 ))}
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3"><span>Giá bán</span><span>KL</span></div>
                 {depth.sell.map((s, i) => (
                    <div key={i} className="flex justify-between items-center relative h-6 overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 bg-red-500/5" style={{ width: `${s.w}%` }}></div>
                       <span className="text-[12px] font-mono font-black text-red-500 relative z-10">{s.p.toFixed(2)}</span>
                       <span className="text-[10px] font-mono text-slate-600 dark:text-gray-400 relative z-10">{s.v}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* 4. AI ANALYTICS CARD */}
           <div className="px-4 mb-10">
              <div className="bg-[#1a2e22] dark:bg-[#122118] rounded-[32px] p-6 border border-primary/20 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-3xl"></div>
                 <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-[28px] filled">smart_toy</span>
                    </div>
                    <div>
                       <h3 className="text-[12px] font-black text-primary uppercase tracking-[0.2em] leading-none">Phân tích Ology AI</h3>
                       <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Hỗ trợ quyết định 24/7</p>
                    </div>
                 </div>

                 {!aiAdvice ? (
                    <button 
                       onClick={handleAskTIFA}
                       disabled={isConsulting}
                       className="w-full py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isConsulting ? 'Ology AI đang phân tích...' : 'Xem nhận định AI'}
                    </button>
                 ) : (
                    <div className="animate-fade-in relative z-10">
                       <div className="flex gap-4 mb-4 items-center">
                          <div className={`size-16 rounded-3xl flex flex-col items-center justify-center border-2 border-white/10 ${aiAdvice.decision === 'MUA' ? 'bg-green-600' : 'bg-red-600'}`}>
                             <span className="text-[14px] font-black text-white">{aiAdvice.decision}</span>
                          </div>
                          <p className="flex-1 text-[12.5px] text-gray-300 font-medium leading-relaxed italic line-clamp-2">"{aiAdvice.reason}"</p>
                       </div>
                       <div className="flex justify-between pt-4 border-t border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          <span>Tin cậy: {aiAdvice.confidence}%</span>
                          <span className="text-primary">Tín hiệu: {aiAdvice.indicators.trend}</span>
                       </div>
                    </div>
                 )}
              </div>
           </div>
       </div>

       {/* 5. ADVANCED ORDER FORM */}
       <div className="bg-white dark:bg-[#0a1a11] p-6 rounded-t-[44px] shadow-[0_-20px_80px_rgba(0,0,0,0.15)] border-t border-slate-100 dark:border-gray-800 z-50 transition-all duration-300">
          <div className="flex gap-3 mb-6">
              <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-1.5 flex gap-1.5 border border-slate-200 dark:border-gray-800">
                  <button onClick={() => setActiveTab('buy')} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-wider ${activeTab === 'buy' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>MUA</button>
                  <button onClick={() => setActiveTab('sell')} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-wider ${activeTab === 'sell' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>BÁN</button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-1.5 flex gap-1.5 border border-slate-200 dark:border-gray-800">
                  <button onClick={() => setOrderMode('MP')} className={`px-4 py-3 rounded-xl text-[11px] font-black transition-all ${orderMode === 'MP' ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md' : 'text-slate-400'}`}>MP</button>
                  <button onClick={() => setOrderMode('LO')} className={`px-4 py-3 rounded-xl text-[11px] font-black transition-all ${orderMode === 'LO' ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md' : 'text-slate-400'}`}>LO</button>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest px-1">Mức giá đặt</label>
                  <div className="relative">
                    <input 
                       type="number" 
                       disabled={orderMode === 'MP'}
                       value={orderMode === 'MP' ? price : limitPrice}
                       onChange={(e) => setLimitPrice(Number(e.target.value))}
                       className={`w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-4 text-lg font-black text-center focus:ring-1 focus:ring-primary outline-none transition-all ${orderMode === 'MP' ? 'opacity-40 italic' : ''}`} 
                    />
                    {orderMode === 'MP' && <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-400 pointer-events-none uppercase tracking-widest">Giá thị trường</div>}
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest px-1">Khối lượng</label>
                  <input 
                     type="number" 
                     value={volume} 
                     onChange={(e) => setVolume(Number(e.target.value))}
                     className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-4 text-lg font-black text-center focus:ring-1 focus:ring-primary outline-none transition-all" 
                  />
                  <div className="flex justify-between gap-1 mt-1">
                      {[25, 50, 100].map(p => (
                         <button key={p} className="flex-1 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[9px] font-black text-slate-400 hover:text-primary transition-all">{p}%</button>
                      ))}
                  </div>
              </div>
          </div>

          <button onClick={handleOrder} className={`w-full py-5 rounded-[24px] font-black text-[14px] uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${activeTab === 'buy' ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-red-600 text-white shadow-red-900/20'}`}>
             <span className="material-symbols-outlined text-[20px] filled">bolt</span>
             XÁC NHẬN ĐẶT LỆNH
          </button>
          
          <div className="flex justify-between items-center mt-6 px-1">
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khả dụng: <span className="text-slate-800 dark:text-white font-black">${balance.toLocaleString()}</span></span>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tổng: <span className="text-primary font-black">${((orderMode === 'MP' ? price : limitPrice) * volume).toLocaleString(undefined, {maximumFractionDigits: 0})}</span></span>
          </div>
       </div>
    </div>
  );
};

export default AssetDetail;
