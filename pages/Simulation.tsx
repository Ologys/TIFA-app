
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ComposedChart, 
  Area,
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  ReferenceLine,
  Tooltip,
  Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface OHLCData {
  time: string;
  price: number;
  volume: number;
  displayTime: string;
  sma?: number;
  upper?: number;
  lower?: number;
}

const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OHLCData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(77.90);
  const [balance, setBalance] = useState(100000);
  const [holdings, setHoldings] = useState(0);
  
  // Order States
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderQty, setOrderQty] = useState(100);
  const [limitPrice, setLimitPrice] = useState<number>(77.90);
  const [isSLTPEnabled, setIsSLTPEnabled] = useState(false);
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);

  const [aiAdvice, setAiAdvice] = useState<{
      decision: string;
      reason: string;
      confidence: number;
      signal: string;
      targetPrice: string;
      entryPrice: string;
      riskLevel: string;
      sentiment: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const savedBalance = localStorage.getItem('tifa_balance');
    const savedPortfolio = JSON.parse(localStorage.getItem('tifa_portfolio') || '{}');
    if (savedBalance) setBalance(parseFloat(savedBalance));
    if (savedPortfolio['BCM']) setHoldings(savedPortfolio['BCM']);

    const generateInitialData = () => {
      const initialData: OHLCData[] = [];
      let basePrice = 75;
      const months = ['Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12', '2026'];
      const prices: number[] = [];

      for (let i = 0; i < 200; i++) {
        const volatility = 0.8;
        const trend = i > 150 ? 0.2 : (i > 100 ? -0.1 : 0.05);
        const price = basePrice + trend + (Math.random() - 0.5) * volatility;
        basePrice = price;
        prices.push(price);

        let sma = price;
        if (i >= 20) {
            const slice = prices.slice(i - 20, i);
            sma = slice.reduce((a, b) => a + b, 0) / 20;
        }

        const upper = sma * 1.03;
        const lower = sma * 0.97;

        initialData.push({
          time: `t-${i}`,
          displayTime: i % 20 === 0 ? months[Math.floor(i/20) % 11] : '',
          price: Number(price.toFixed(2)),
          volume: 1000 + Math.random() * 5000,
          sma: Number(sma.toFixed(2)),
          upper: Number(upper.toFixed(2)),
          lower: Number(lower.toFixed(2))
        });
      }
      return initialData;
    };
    setData(generateInitialData());

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const newPrice = Number((prev + (Math.random() - 0.5) * 0.1).toFixed(2));
        setLimitPrice(lp => lp === prev ? newPrice : lp);
        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchAiAdvice = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Phân tích mã cổ phiếu BCM giá hiện tại ${currentPrice}. Hãy đóng vai trợ lý Ology AI.`
      });
      const text = response.text || "";
      let decision = "CHỜ";
      if (text.toUpperCase().includes("MUA")) decision = "MUA";
      else if (text.toUpperCase().includes("BÁN")) decision = "BÁN";
      
      setAiAdvice({
        decision,
        reason: "Tín hiệu kỹ thuật đang tích lũy tốt quanh vùng giá hỗ trợ.",
        confidence: 88,
        signal: decision === "MUA" ? "Bullish" : "Neutral",
        targetPrice: (currentPrice * 1.05).toFixed(2),
        entryPrice: currentPrice.toFixed(2),
        riskLevel: "Thấp",
        sentiment: 60
      });
    } catch (e) {
      setAiAdvice({ 
        decision: "CHỜ", 
        reason: "Tín hiệu chưa rõ ràng.", 
        confidence: 70, 
        signal: "Neutral", 
        targetPrice: (currentPrice * 1.02).toFixed(2),
        entryPrice: currentPrice.toFixed(2),
        riskLevel: "Thấp",
        sentiment: 10
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => { fetchAiAdvice(); }, []);

  const handlePlaceOrder = () => {
    const execPrice = orderType === 'market' ? currentPrice : limitPrice;
    const totalCost = execPrice * orderQty;
    
    if (orderSide === 'buy' && totalCost > balance) { alert("Số dư không đủ!"); return; }
    if (orderSide === 'sell' && orderQty > holdings) { alert("Không đủ cổ phiếu!"); return; }

    const newBalance = orderSide === 'buy' ? balance - totalCost : balance + totalCost;
    const newHoldings = orderSide === 'buy' ? holdings + orderQty : holdings - orderQty;

    setBalance(newBalance);
    setHoldings(newHoldings);
    localStorage.setItem('tifa_balance', newBalance.toString());
    const port = JSON.parse(localStorage.getItem('tifa_portfolio') || '{}');
    port['BCM'] = newHoldings;
    localStorage.setItem('tifa_portfolio', JSON.stringify(port));

    const msg = orderType === 'market' 
      ? `Lệnh Thị trường ${orderSide.toUpperCase()} ${orderQty} BCM giá ${currentPrice} đã khớp!`
      : `Lệnh Giới hạn ${orderSide.toUpperCase()} ${orderQty} BCM giá ${limitPrice} đã được đặt!`;
    
    alert(msg);
    setIsOrderOpen(false);
  };

  const calculateMaxQty = () => {
    if (orderSide === 'buy') {
      return Math.floor(balance / (orderType === 'market' ? currentPrice : limitPrice));
    }
    return holdings;
  };

  const watchlist = [
    { ck: 'ACB', gia: '24.90', change: '+0.25', pct: '1.01%', vol: '14.1tr', color: 'text-green-600' },
    { ck: 'BCM', gia: currentPrice.toFixed(2), change: '+4.50', pct: '6.13%', vol: '3.7tr', color: 'text-green-600', active: true },
    { ck: 'BID', gia: '50.70', change: '-3.80', pct: '-6.97%', vol: '26.4tr', color: 'text-red-500' },
    { ck: 'CTG', gia: '40.00', change: '-1.45', pct: '-3.50%', vol: '28.1tr', color: 'text-red-500' },
    { ck: 'FPT', gia: '98.50', change: '-1.30', pct: '-1.30%', vol: '7.4tr', color: 'text-red-500' },
  ];

  return (
    <div className="bg-[#f1f5f9] h-screen w-screen flex flex-col font-sans overflow-hidden select-none text-slate-800 relative transition-colors duration-500">
      
      {/* 1. TOPMOST NAVIGATION MENU */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center px-2 gap-4 shrink-0 z-50 shadow-sm">
        <button 
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-100 mr-2 group"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="text-[11px] font-black uppercase tracking-widest">Thoát</span>
        </button>
        <button className="text-[11px] font-bold text-slate-900 border-b-2 border-primary h-full flex items-center px-2">Phòng Trade Mô Phỏng</button>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-4 text-[11px] font-bold px-4 border-l border-slate-100">
           <div className="flex flex-col items-end leading-tight">
              <span className="text-slate-400 uppercase text-[9px]">Sức mua:</span>
              <span className="text-primary font-black font-mono">${balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
           </div>
           <div className="flex flex-col items-end leading-tight border-l border-slate-100 pl-4">
              <span className="text-slate-400 uppercase text-[9px]">Đang giữ:</span>
              <span className="text-slate-800 font-black font-mono">{holdings} BCM</span>
           </div>
        </div>

        <div className="flex items-center gap-4 px-4 h-full border-l border-slate-100">
           <button 
             onClick={() => setIsOrderOpen(true)}
             className="bg-primary hover:bg-primary-dark text-white px-8 h-8 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-green-200 transition-all flex items-center gap-2"
           >
              <span className="material-symbols-outlined text-[20px] filled">bolt</span>
              ĐẶT LỆNH
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 3. LEFT DRAWING TOOLBAR */}
        <div className="w-12 border-r border-slate-200 flex flex-col items-center py-4 gap-5 bg-white shrink-0 z-40 shadow-sm">
          {[
            'near_me', 'show_chart', 'edit_note', 'square_foot', 'pentagon', 
            'format_shapes', 'text_fields', 'calculate', 'zoom_in', 'search', 'delete'
          ].map((icon, i) => (
            <button key={i} className={`p-1.5 hover:bg-slate-100 rounded-xl transition-all ${i === 0 ? 'text-primary bg-green-50' : 'text-slate-400 hover:text-slate-900'}`}>
              <span className={`material-symbols-outlined text-[22px]`}>{icon}</span>
            </button>
          ))}
        </div>

        {/* 4. MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col relative bg-white overflow-hidden">
          
          {/* TOP PRICE HUD */}
          <div className="absolute top-4 left-6 z-20 pointer-events-none">
             <div className="flex flex-col">
                <span className="text-[16px] font-black text-slate-800 uppercase tracking-tight">BCM · 1D · HOSE</span>
                <div className="flex gap-2 items-center mt-1">
                   <div className="flex gap-2 items-center px-3 py-1 rounded-lg bg-green-50 border border-green-200 backdrop-blur-md">
                     <div className="size-2 rounded-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.4)] animate-pulse"></div>
                     <span className="text-[14px] text-green-700 font-black font-mono">{currentPrice.toFixed(2)}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* MAIN CHART */}
          <div className="flex-1 w-full pt-16 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="0" />
                <XAxis dataKey="displayTime" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} height={25} interval={19} />
                <YAxis orientation="right" domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={65} />
                <YAxis yAxisId="vol" domain={[0, 40000]} hide />
                
                <Bar yAxisId="vol" dataKey="volume" isAnimationActive={false} barSize={4}>
                   {data.map((entry, index) => <Cell key={`vol-${index}`} fill={entry.price > 75 ? '#16a34a33' : '#ef444433'} />)}
                </Bar>
                
                {isAdvancedMode && (
                   <Line type="monotone" dataKey="sma" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} />
                )}

                <Area type="monotone" dataKey="price" stroke={currentPrice > 77 ? '#16a34a' : '#ef4444'} strokeWidth={2.5} fill="transparent" isAnimationActive={false} />
                
                <ReferenceLine y={currentPrice} stroke="#94a3b8" strokeDasharray="4 4" />
                <Tooltip content={<></>} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* OLOGY AI COMMAND CENTER */}
          <div className="h-44 bg-[#f8fafc] border-t border-slate-200 px-6 py-5 relative overflow-hidden shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
             <div className="flex gap-8 h-full items-stretch relative z-10">
                <div className="w-64 shrink-0 flex flex-col justify-center gap-4">
                   <div className="flex items-center gap-4 px-5 py-3 bg-primary/10 border border-primary/20 rounded-[24px] relative overflow-hidden group/intel">
                      <span className="material-symbols-outlined text-[32px] text-primary filled relative z-10">smart_toy</span>
                      <div className="flex flex-col relative z-10">
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-1">Ology Intel</span>
                         <span className="text-[15px] font-black text-slate-800 uppercase tracking-widest leading-none">AI: {aiAdvice?.decision || 'STABLE'}</span>
                      </div>
                   </div>
                   <button onClick={fetchAiAdvice} disabled={isAnalyzing} className="w-full py-2 bg-white rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm active:scale-95 transition-all">Làm mới phân tích</button>
                </div>

                <div className="flex-1 flex gap-5">
                   <div className="flex-1 bg-white rounded-[28px] p-5 border border-slate-200 flex flex-col justify-between shadow-sm">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Giá mục tiêu</span>
                      <span className={`text-3xl font-black font-mono tracking-tighter ${aiAdvice?.decision === 'MUA' ? 'text-green-600' : 'text-red-500'}`}>${aiAdvice?.targetPrice || '---'}</span>
                   </div>
                   <div className="flex-[1.5] bg-white rounded-[28px] p-5 border border-slate-200 shadow-sm flex flex-col">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Nhận định AI</span>
                      <p className="text-[13px] text-slate-700 font-bold leading-relaxed italic border-l-4 border-primary/30 pl-4 py-1 line-clamp-2">"{aiAdvice?.reason}"</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 5. RIGHT SIDEBAR */}
        <div className="w-[340px] border-l border-slate-200 flex flex-col bg-slate-50 shrink-0 z-40">
          <div className="h-12 border-b border-slate-200 flex items-center px-4 justify-between bg-white">
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                <input placeholder="Tìm mã..." className="bg-transparent border-none text-[12px] w-28 outline-none text-slate-800 font-bold"/>
             </div>
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">VN30 HOSE</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
             <div className="grid grid-cols-[85px_65px_65px_1fr] bg-slate-100 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase sticky top-0 z-10 px-1">
                <div className="p-3">Mã</div><div className="p-3 text-right">Giá</div><div className="p-3 text-right">+/-</div><div className="p-3 text-right">Khối lượng</div>
             </div>
             {watchlist.map((item, i) => (
               <div key={i} className={`grid grid-cols-[85px_65px_65px_1fr] items-center text-[12px] hover:bg-white transition-all cursor-pointer ${item.active ? 'bg-green-50 border-l-4 border-primary shadow-sm' : 'border-b border-slate-100'}`}>
                  <div className={`p-3 font-black ${item.color}`}>{item.ck}</div>
                  <div className={`p-3 text-right font-mono font-bold text-slate-700`}>{item.gia}</div>
                  <div className={`p-3 text-right font-mono font-bold ${item.color}`}>{item.change}</div>
                  <div className="p-3 text-right font-mono text-slate-400 text-[11px]">{item.vol}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      {/* ADVANCED ORDER MODAL */}
      {isOrderOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOrderOpen(false)}></div>
           <div className="bg-white w-full max-w-[480px] rounded-[40px] shadow-2xl overflow-hidden relative animate-fade-in-up border border-slate-100 flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                 <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-2xl flex items-center justify-center ${orderSide === 'buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        <span className="material-symbols-outlined text-[24px] filled">{orderSide === 'buy' ? 'add_circle' : 'do_not_disturb_on'}</span>
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-black text-lg tracking-tight leading-none">Đặt lệnh nâng cao</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Mã chứng khoán: <span className="text-slate-900 font-black">BCM</span></p>
                    </div>
                 </div>
                 <button onClick={() => setIsOrderOpen(false)} className="size-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto no-scrollbar">
                 {/* Buy / Sell Selector */}
                 <div className="flex bg-slate-100 rounded-2xl p-1.5">
                    <button onClick={() => setOrderSide('buy')} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${orderSide === 'buy' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>MUA</button>
                    <button onClick={() => setOrderSide('sell')} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${orderSide === 'sell' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>BÁN</button>
                 </div>

                 {/* Order Type Selector */}
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setOrderType('market')} className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${orderType === 'market' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>Thị trường (MP)</button>
                    <button onClick={() => setOrderType('limit')} className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${orderType === 'limit' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>Giới hạn (LO)</button>
                 </div>

                 {/* Price Input (for Limit) */}
                 <div className={`space-y-2 transition-all ${orderType === 'limit' ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'}`}>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mức giá đặt lệnh</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            step="0.05"
                            value={orderType === 'market' ? currentPrice : limitPrice}
                            onChange={(e) => setLimitPrice(Number(e.target.value))}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-xl font-black text-slate-800 text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">VND</div>
                    </div>
                 </div>

                 {/* Quantity Input with Quick Select */}
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Khối lượng giao dịch</label>
                    <input 
                        type="number" 
                        value={orderQty} 
                        onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 0))} 
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-xl font-black text-slate-800 text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                    <div className="flex gap-2">
                        {[25, 50, 100].map(pct => (
                            <button 
                                key={pct}
                                onClick={() => setOrderQty(Math.floor(calculateMaxQty() * (pct / 100)))}
                                className="flex-1 py-2 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase hover:bg-slate-200 transition-colors"
                            >
                                {pct === 100 ? 'TẤT CẢ' : `${pct}%`}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Stop Loss / Take Profit Toggle */}
                 <div className="pt-2 border-t border-slate-100">
                    <button 
                        onClick={() => setIsSLTPEnabled(!isSLTPEnabled)}
                        className="flex items-center justify-between w-full py-2 group"
                    >
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">security</span>
                            Thiết lập Cắt lỗ / Chốt lời
                        </span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isSLTPEnabled ? 'bg-primary' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${isSLTPEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                        </div>
                    </button>
                    
                    {isSLTPEnabled && (
                        <div className="grid grid-cols-2 gap-4 mt-4 animate-fade-in">
                            <div className="space-y-1.5">
                                <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Dừng lỗ (SL)</span>
                                <input type="number" placeholder="72.5" className="w-full bg-red-50/50 border border-red-100 rounded-xl p-3 text-sm font-bold text-red-600 outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Chốt lời (TP)</span>
                                <input type="number" placeholder="85.0" className="w-full bg-green-50/50 border border-green-100 rounded-xl p-3 text-sm font-bold text-green-600 outline-none" />
                            </div>
                        </div>
                    )}
                 </div>

                 {/* Order Summary */}
                 <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>Giá trị lệnh:</span>
                        <span className="text-slate-800 font-black">${((orderType === 'market' ? currentPrice : limitPrice) * orderQty).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>Số dư còn lại:</span>
                        <span className="text-primary font-black">${(balance - (orderSide === 'buy' ? (orderType === 'market' ? currentPrice : limitPrice) * orderQty : 0)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                 </div>

                 <button 
                    onClick={handlePlaceOrder} 
                    className={`w-full py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] shadow-xl text-white transition-all active:scale-[0.98] ${orderSide === 'buy' ? 'bg-green-600 shadow-green-200' : 'bg-red-600 shadow-red-200'}`}
                 >
                    Xác nhận {orderSide === 'buy' ? 'Mua' : 'Bán'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;
