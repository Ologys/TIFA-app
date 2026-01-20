
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, YAxis, Tooltip } from 'recharts';
import { GoogleGenAI } from "@google/genai";

type AIRecType = 'MUA' | 'BÁN' | 'CHỜ' | 'TÍCH LŨY' | 'GIẢM TỶ TRỌNG' | 'NẮM GIỮ';

interface IndexInfo {
  name: string;
  val: string;
  chg: string;
  pct: string;
  vol: string;
  amt: string;
  up: number;
  ref: number;
  down: number;
  isUp: boolean;
  chartData: { t: number; v: number }[];
}

interface StockRow {
  s: string; // Mã
  ceil: number; floor: number; ref: number;
  b3p: number; b3v: string; b2p: number; b2v: string; b1p: number; b1v: string;
  mp: number; mv: string; mc: string; mpct: string;
  s1p: number; s1v: string; s2p: number; s2v: string; s3p: number; s3v: string;
  totalVol: string; high: number; low: number;
  fBuy: string; fSell: string;
  status: 'up' | 'down' | 'ref' | 'ceil' | 'floor';
  aiRec?: AIRecType;
  aiScore?: number;
}

const StockBoard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('VN30');
  
  // States
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderSymbol, setOrderSymbol] = useState('ACB');
  const [orderPrice, setOrderPrice] = useState('25.10');
  const [orderVol, setOrderVol] = useState('100');
  
  // AI Detail States
  const [selectedAiStock, setSelectedAiStock] = useState<StockRow | null>(null);
  const [isAiDetailOpen, setIsAiDetailOpen] = useState(false);
  const [aiDetailContent, setAiDetailContent] = useState<string | null>(null);
  const [isAnalyzingDetail, setIsAnalyzingDetail] = useState(false);

  // General AI States
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefreshingAllAi, setIsRefreshingAllAi] = useState(false);

  const indices: IndexInfo[] = [
    { name: 'VNINDEX', val: '1,896.59', chg: '17.46', pct: '0.93%', vol: '1,163,188,480', amt: '37,554.956', up: 167, ref: 57, down: 153, isUp: true, chartData: Array.from({length: 30}, (_, i) => ({t: i, v: 1875 + Math.sin(i/3)*10 + Math.random()*5})) },
    { name: 'VN30', val: '2,094.24', chg: '13.89', pct: '0.67%', vol: '669,817,513', amt: '25,142.545', up: 18, ref: 3, down: 9, isUp: true, chartData: Array.from({length: 30}, (_, i) => ({t: i, v: 2085 + Math.cos(i/4)*8 + Math.random()*4})) },
    { name: 'HNX30', val: '563.04', chg: '7.04', pct: '1.27%', vol: '72,159,720', amt: '1,848.385', up: 14, ref: 4, down: 12, isUp: true, chartData: Array.from({length: 30}, (_, i) => ({t: i, v: 558 + i/2 + Math.random()*3})) },
    { name: 'VNXALL', val: '3,057.52', chg: '22.78', pct: '0.75%', vol: '1,207,123,500', amt: '37,495.842', up: 194, ref: 97, down: 188, isUp: true, chartData: Array.from({length: 30}, (_, i) => ({t: i, v: 3035 + Math.random()*15})) },
  ];

  const [stocks, setStocks] = useState<StockRow[]>([
    { s: 'ACB', ceil: 26.55, floor: 23.15, ref: 24.85, b3p: 24.95, b3v: '99,600', b2p: 25.00, b2v: '707,400', b1p: 25.05, b1v: '162,700', mp: 25.10, mv: '100', mc: '0.25', mpct: '1.01%', s1p: 25.10, s1v: '127,900', s2p: 25.15, s2v: '301,500', s3p: 25.20, s3v: '399,800', totalVol: '10,927,600', high: 25.15, low: 24.75, fBuy: '3,721,638', fSell: '820,400', status: 'up', aiRec: 'TÍCH LŨY', aiScore: 82 },
    { s: 'BCM', ceil: 82.90, floor: 72.10, ref: 77.50, b3p: 78.50, b3v: '1,000', b2p: 78.60, b2v: '500', b1p: 78.70, b1v: '2,100', mp: 78.80, mv: '500', mc: '1.30', mpct: '1.68%', s1p: 78.80, s1v: '15,000', s2p: 78.90, s2v: '3,400', s3p: 79.00, s3v: '7,800', totalVol: '2,061,200', high: 81.00, low: 75.40, fBuy: '340,600', fSell: '480,000', status: 'up', aiRec: 'NẮM GIỮ', aiScore: 65 },
    { s: 'BID', ceil: 54.60, floor: 47.55, ref: 51.10, b3p: 51.80, b3v: '23,500', b2p: 51.90, b2v: '48,700', b1p: 52.00, b1v: '4,000', mp: 52.00, mv: '100', mc: '0.90', mpct: '1.76%', s1p: 52.10, s1v: '48,500', s2p: 52.20, s2v: '50,900', s3p: 52.30, s3v: '117,500', totalVol: '9,409,600', high: 52.60, low: 50.50, fBuy: '1,127,950', fSell: '504,781', status: 'up', aiRec: 'MUA', aiScore: 94 },
    { s: 'CTG', ceil: 42.35, floor: 36.85, ref: 39.60, b3p: 39.90, b3v: '144,400', b2p: 39.95, b2v: '119,300', b1p: 40.00, b1v: '15,000', mp: 40.00, mv: '500', mc: '0.40', mpct: '1.01%', s1p: 40.05, s1v: '52,100', s2p: 40.10, s2v: '589,300', s3p: 40.15, s3v: '34,800', totalVol: '13,549,500', high: 40.35, low: 39.55, fBuy: '3,487,700', fSell: '555,319', status: 'up', aiRec: 'CHỜ', aiScore: 48 },
    { s: 'DGC', ceil: 70.60, floor: 61.40, ref: 66.00, b3p: 64.90, b3v: '40,200', b2p: 65.00, b2v: '255,400', b1p: 65.10, b1v: '68,100', mp: 65.10, mv: '200', mc: '-0.90', mpct: '-1.36%', s1p: 65.20, s1v: '2,000', s2p: 65.30, s2v: '29,300', s3p: 65.40, s3v: '15,900', totalVol: '3,348,700', high: 66.80, low: 65.10, fBuy: '62,740', fSell: '458,300', status: 'down', aiRec: 'GIẢM TỶ TRỌNG', aiScore: 30 },
    { s: 'FPT', ceil: 112.60, floor: 98.00, ref: 105.30, b3p: 105.50, b3v: '371,500', b2p: 105.60, b2v: '41,400', b1p: 105.70, b1v: '25,100', mp: 105.80, mv: '1,900', mc: '0.50', mpct: '0.47%', s1p: 105.80, s1v: '41,900', s2p: 105.90, s2v: '16,300', s3p: 106.00, s3v: '215,400', totalVol: '14,710,500', high: 108.70, low: 105.50, fBuy: '2,834,657', fSell: '2,834,753', status: 'up', aiRec: 'MUA', aiScore: 89 },
    { s: 'HPG', ceil: 29.50, floor: 25.70, ref: 27.60, b3p: 27.60, b3v: '1,017,600', b2p: 27.65, b2v: '828,500', b1p: 27.70, b1v: '351,400', mp: 27.70, mv: '100', mc: '0.10', mpct: '0.36%', s1p: 27.75, s1v: '24,100', s2p: 27.80, s2v: '193,800', s3p: 27.85, s3v: '129,300', totalVol: '40,465,900', high: 28.20, low: 27.65, fBuy: '5,440,542', fSell: '2,161,759', status: 'up', aiRec: 'TÍCH LŨY', aiScore: 78 },
  ]);

  const fetchAiAdvice = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAiAdvice(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Đóng vai chuyên gia chứng khoán Ology AI. Phân tích mã ${orderSymbol} tại giá ${orderPrice}. 
        Đưa ra chiến thuật hành động cụ thể (MUA, BÁN, NẮM GIỮ, TÍCH LŨY, GIẢM TỶ TRỌNG) kèm vùng giá kỳ vọng ngắn hạn. Trả lời cực kỳ súc tích.`
      });
      setAiAdvice(response.text || "Tín hiệu thị trường đang cân bằng.");
    } catch (e) {
      setAiAdvice("Hệ thống phân tích đang bảo trì.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showAiRecommendationDetail = async (stock: StockRow) => {
    setSelectedAiStock(stock);
    setIsAiDetailOpen(true);
    setIsAnalyzingDetail(true);
    setAiDetailContent(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Bạn là chuyên gia Ology AI cao cấp. Giải thích mã ${stock.s} có khuyến nghị '${stock.aiRec}' (${stock.aiScore}%). 
            Giá hiện tại: ${stock.mp}, biến động: ${stock.mpct}. 
            YÊU CẦU QUAN TRỌNG: Viết duy nhất một đoạn văn CỰC KỲ NGẮN GỌN (tối đa 30-40 từ), đúng trọng tâm vào tín hiệu kỹ thuật hoặc dòng tiền then chốt.
            Văn phong: Sắc bén, chuyên nghiệp, chuẩn mực báo cáo tài chính. 
            Bắt đầu bằng: "Dưới góc độ chuyên gia Ology AI, khuyến nghị ${stock.aiRec} đối với mã ${stock.s} dựa trên..."`
        });
        setAiDetailContent(response.text || "Đang tổng hợp dữ liệu chiến thuật...");
    } catch (e) {
        setAiDetailContent("Không thể tải phân tích chi tiết vào lúc này. Vui lòng kiểm tra lại kết nối.");
    } finally {
        setIsAnalyzingDetail(false);
    }
  };

  const handleRefreshAllAi = async () => {
    setIsRefreshingAllAi(true);
    const options: AIRecType[] = ['MUA', 'BÁN', 'CHỜ', 'TÍCH LŨY', 'GIẢM TỶ TRỌNG', 'NẮM GIỮ'];
    setTimeout(() => {
        setStocks(prev => prev.map(s => ({
            ...s,
            aiRec: options[Math.floor(Math.random() * options.length)],
            aiScore: Math.floor(Math.random() * 40) + 60
        })));
        setIsRefreshingAllAi(false);
    }, 1500);
  };

  const openOrder = (stockSymbol: string, price: string, side: 'BUY' | 'SELL') => {
    setOrderSymbol(stockSymbol);
    setOrderPrice(price);
    setOrderSide(side);
    setIsOrderOpen(true);
  };

  const getAiRecStyle = (rec?: AIRecType) => {
    switch (rec) {
      case 'MUA': return 'bg-green-600/20 text-green-500 border-green-500/30 hover:bg-green-600/30';
      case 'BÁN': return 'bg-red-600/20 text-red-500 border-red-500/30 hover:bg-red-600/30';
      case 'TÍCH LŨY': return 'bg-cyan-600/20 text-cyan-400 border-cyan-400/30 hover:bg-cyan-600/30';
      case 'GIẢM TỶ TRỌNG': return 'bg-amber-600/20 text-amber-500 border-amber-500/30 hover:bg-amber-600/30';
      case 'NẮM GIỮ': return 'bg-indigo-600/20 text-indigo-400 border-indigo-400/30 hover:bg-indigo-600/30';
      default: return 'bg-yellow-600/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-600/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      case 'ceil': return 'text-[#d946ef]';
      case 'floor': return 'text-[#22d3ee]';
      case 'ref': return 'text-yellow-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="bg-black min-h-screen w-full flex flex-col text-[#ccc] font-sans overflow-hidden select-none">
      
      {/* 1. TOP MENU BAR */}
      <nav className="flex bg-[#222] border-b border-black text-[11px] font-bold h-9 shrink-0">
        <button onClick={() => navigate('/home')} className="flex items-center justify-center px-4 border-r border-black hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-gray-400">arrow_back</span>
        </button>
        {['Bảng giá', 'Thị trường', 'Giao dịch', 'Tài sản', 'Tiện ích'].map((m, i) => (
          <div key={m} className={`flex items-center px-3 cursor-pointer hover:bg-black/20 ${i === 0 ? 'bg-[#333] text-white border-t-2 border-white' : ''}`}>{m}</div>
        ))}
        <div className="flex-1"></div>
      </nav>

      {/* 2. MARKET INDICES */}
      <div className="grid grid-cols-4 gap-px bg-black shrink-0 border-b border-black">
        {indices.map((idx) => (
          <div key={idx.name} className="bg-[#141414] p-3 h-[145px] flex flex-col relative group cursor-pointer hover:bg-[#1a1a1a] transition-colors">
             <div className="flex justify-between items-start z-10">
                <span className="text-[11px] font-black text-white/80 group-hover:text-white transition-colors">{idx.name}</span>
                <span className={`text-[14px] font-mono font-black tracking-tighter ${idx.isUp ? 'text-green-500' : 'text-red-500'}`}>{idx.val}</span>
             </div>
             
             <div className="flex-1 w-full mt-1.5 mb-1 relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={idx.chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`colorIndex-${idx.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={idx.isUp ? '#22c55e' : '#ef4444'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={idx.isUp ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ffffff" opacity={0.03} />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip 
                       content={<></>} 
                       cursor={{ stroke: idx.isUp ? '#22c55e' : '#ef4444', strokeWidth: 1, strokeDasharray: '3 3' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="v" 
                      stroke={idx.isUp ? '#22c55e' : '#ef4444'} 
                      strokeWidth={2} 
                      fill={`url(#colorIndex-${idx.name})`} 
                      isAnimationActive={false} 
                      dot={false}
                      activeDot={{ r: 3, fill: idx.isUp ? '#22c55e' : '#ef4444', stroke: '#fff', strokeWidth: 1 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-0 right-0 h-px border-t border-white/[0.05] pointer-events-none"></div>
             </div>

             <div className="flex justify-between items-end z-10">
                <div className={`text-[10px] font-black ${idx.isUp ? 'text-green-500' : 'text-red-500'}`}>
                   {idx.chg} ({idx.pct})
                </div>
                <div className="flex gap-2 text-[9px] font-bold">
                   <span className="text-green-500/80">{idx.up}</span>
                   <span className="text-yellow-500/80">{idx.ref}</span>
                   <span className="text-red-500/80">{idx.down}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 3. OLOGY AI HOT SCANNER */}
      <div className="bg-[#0a1a11] h-11 border-b border-primary/20 flex items-center px-4 shrink-0 overflow-hidden relative group">
         <div className="flex items-center gap-2 shrink-0 bg-[#0a1a11] z-10 pr-4">
            <span className="material-symbols-outlined text-primary text-[18px] filled animate-pulse">smart_toy</span>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Ology AI Scanner:</span>
         </div>
         <div className="flex-1 overflow-hidden relative">
            <div className="flex items-center gap-8 animate-ticker-line whitespace-nowrap py-1">
               {stocks.filter(s => s.aiScore && s.aiScore > 85).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors" onClick={() => openOrder(s.s, s.mp.toFixed(2), 'BUY')}>
                     <span className="text-[10px] font-black text-white">{s.s}</span>
                     <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">{s.aiRec}</span>
                     <span className="text-[8px] font-black text-gray-500">Score: {s.aiScore}%</span>
                  </div>
               ))}
            </div>
         </div>
         <button onClick={handleRefreshAllAi} className="shrink-0 ml-4 px-3 py-1 rounded-full border border-primary/30 text-[8px] font-black text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
            {isRefreshingAllAi ? 'Scanning...' : 'Re-Scan Market'}
         </button>
      </div>

      {/* 4. TOOLBAR */}
      <div className="flex items-center gap-4 bg-[#141414] p-2 border-b border-black shrink-0">
        <div className="relative w-56">
           <input type="text" placeholder="Tìm mã chứng khoán..." className="w-full h-8 bg-black border border-gray-800 rounded pl-9 text-[11px] text-white outline-none focus:border-primary" />
           <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-gray-500 text-[18px]">search</span>
        </div>
        <div className="flex items-center gap-1">
           {['VN30', 'HNX30', 'HOSE', 'UPCOM'].map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-[#222] text-white border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>
           ))}
        </div>
        <div className="flex-1"></div>
        <button onClick={() => setIsOrderOpen(true)} className="bg-primary hover:bg-primary-dark text-white h-8 px-6 rounded-md text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[18px] filled">bolt</span>
          Đặt lệnh
        </button>
      </div>

      {/* 5. TABLE */}
      <div className="flex-1 overflow-auto no-scrollbar bg-black">
        <table className="w-full border-collapse text-[11px] text-center table-fixed min-w-[1600px]">
          <thead className="bg-[#1a1a1a] sticky top-0 z-[100] border-b border-black text-gray-500 font-bold uppercase tracking-tighter">
            <tr className="h-12">
              <th className="w-24 border-r border-black sticky left-0 bg-[#1a1a1a] z-10">Mã CK</th>
              <th className="w-44 border-r border-black">Khuyến nghị Ology AI</th>
              <th className="w-14">Trần</th><th className="w-14">Sàn</th><th className="w-14 border-r border-black">TC</th>
              <th colSpan={6} className="border-r border-black">Bên mua</th>
              <th colSpan={3} className="bg-black/40 border-r border-black">Khớp lệnh</th>
              <th colSpan={6} className="border-r border-black">Bên bán</th>
              <th className="w-24">Tổng KL</th>
              <th className="w-24">NN Mua</th><th className="w-24">NN Bán</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {stocks.map((s) => (
              <tr key={s.s} className="h-12 hover:bg-[#111] cursor-pointer transition-colors group">
                <td className="sticky left-0 z-10 bg-black group-hover:bg-[#111] text-left pl-4 font-black border-r border-white/5 h-12">
                   <span className={getStatusColor(s.status)}>{s.s}</span>
                </td>
                
                {/* ADVANCED AI RECOMMENDATION COLUMN - INTERACTIVE */}
                <td className="border-r border-white/5 px-2 text-center">
                   {s.aiRec && (
                     <button 
                       onClick={() => showAiRecommendationDetail(s)}
                       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border transition-all active:scale-95 ${getAiRecStyle(s.aiRec)}`}
                     >
                        <span className={`material-symbols-outlined text-[13px] filled ${s.aiScore && s.aiScore > 80 ? 'animate-pulse' : ''}`}>smart_toy</span>
                        {s.aiRec}
                        {s.aiScore && <span className="opacity-50 ml-1 font-mono">{s.aiScore}%</span>}
                     </button>
                   )}
                </td>

                <td className="text-[#d946ef] font-mono">{s.ceil.toFixed(2)}</td>
                <td className="text-[#22d3ee] font-mono">{s.floor.toFixed(2)}</td>
                <td className="text-yellow-500 font-mono border-r border-white/5">{s.ref.toFixed(2)}</td>
                
                <td className={getStatusColor(s.status)}>{s.b3p.toFixed(2)}</td><td className="text-gray-500">{s.b3v}</td>
                <td className={getStatusColor(s.status)}>{s.b2p.toFixed(2)}</td><td className="text-gray-500">{s.b2v}</td>
                <td className={getStatusColor(s.status)}>{s.b1p.toFixed(2)}</td><td className="text-gray-500 border-r border-white/5">{s.b1v}</td>
                
                <td className={`font-black font-mono text-[14px] ${getStatusColor(s.status)} bg-white/[0.02]`}>{s.mp.toFixed(2)}</td>
                <td className="text-green-500 font-mono bg-white/[0.02]">{s.mv}</td>
                <td className={`${getStatusColor(s.status)} bg-white/[0.02] border-r border-white/5 text-[9.5px]`}>{s.mpct}</td>
                
                <td className={getStatusColor(s.status)}>{s.s1p.toFixed(2)}</td><td className="text-gray-500">{s.s1v}</td>
                <td className={getStatusColor(s.status)}>{s.s2p.toFixed(2)}</td><td className="text-gray-500">{s.s2v}</td>
                <td className={getStatusColor(s.status)}>{s.s3p.toFixed(2)}</td><td className="text-gray-500 border-r border-white/5">{s.s3v}</td>
                
                <td className="text-white/60 font-mono text-[10px] border-r border-white/5">{s.totalVol}</td>
                <td className="text-white/80 font-mono text-[9px]">{s.fBuy}</td>
                <td className="text-white/80 font-mono text-[9px]">{s.fSell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ENHANCED AI RECOMMENDATION DETAIL MODAL - PRO STYLE */}
      {isAiDetailOpen && selectedAiStock && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsAiDetailOpen(false)}></div>
           <div className="bg-[#0a1a11] w-full max-w-[480px] rounded-[44px] border border-primary/40 shadow-[0_40px_120px_rgba(0,0,0,0.95)] overflow-hidden relative animate-order-popup font-sans">
              
              {/* MODAL HEADER */}
              <div className="pt-10 pb-6 px-8 flex flex-col items-center gap-2 border-b border-white/[0.03] bg-gradient-to-b from-primary/5 to-transparent relative">
                 <button onClick={() => setIsAiDetailOpen(false)} className="absolute top-6 right-6 size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-500 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                 </button>
                 <h2 className="text-primary font-black text-[14px] uppercase tracking-[0.4em] mb-1">Giải thích khuyến nghị</h2>
                 <div className="w-12 h-1 bg-primary/40 rounded-full"></div>
              </div>

              <div className="p-10 space-y-10">
                 {/* SIGNAL INDICATORS */}
                 <div className="flex justify-between items-end gap-10 px-2">
                    <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Loại tín hiệu</span>
                        <div className={`px-5 py-2.5 rounded-2xl text-[13px] font-black uppercase tracking-[0.1em] border shadow-xl ${getAiRecStyle(selectedAiStock.aiRec)}`}>
                           {selectedAiStock.aiRec}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Độ tin cậy</span>
                        <span className="text-[42px] font-black text-white font-mono leading-none tracking-tighter">{selectedAiStock.aiScore}%</span>
                    </div>
                 </div>

                 {/* MAIN CONTENT BLOCK */}
                 <div className="relative p-8 rounded-[40px] bg-white/[0.03] border border-white/[0.05] overflow-hidden shadow-inner group">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <span className="material-symbols-outlined text-[100px] filled">smart_toy</span>
                    </div>
                    {isAnalyzingDetail ? (
                       <div className="flex flex-col items-center justify-center py-12 gap-5">
                          <div className="size-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse italic">Ology AI đang giải mã dữ liệu...</span>
                       </div>
                    ) : (
                       <p className="text-[16px] text-gray-200 font-medium italic leading-[1.7] animate-fade-in whitespace-pre-wrap tracking-tight text-center">
                          "{aiDetailContent}"
                       </p>
                    )}
                 </div>

                 {/* BOTTOM METRICS GRID */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-black/40 p-6 rounded-[28px] text-center border border-white/5 shadow-sm">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Giá hiện tại</span>
                        <span className="text-[22px] font-black text-white font-mono tracking-tighter">{selectedAiStock.mp}</span>
                    </div>
                    <div className="bg-black/40 p-6 rounded-[28px] text-center border border-white/5 shadow-sm">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Biến động</span>
                        <span className={`text-[22px] font-black font-mono tracking-tighter ${selectedAiStock.status === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                           {selectedAiStock.status === 'up' ? '+' : ''}{selectedAiStock.mpct}
                        </span>
                    </div>
                 </div>

                 {/* FINAL ACTION BUTTON */}
                 <button 
                    onClick={() => { setIsAiDetailOpen(false); openOrder(selectedAiStock.s, selectedAiStock.mp.toFixed(2), 'BUY'); }}
                    className="w-full py-6 bg-primary hover:bg-primary-dark text-white rounded-[24px] font-black text-[15px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(29,113,57,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-4 group"
                 >
                    <span className="material-symbols-outlined text-[24px] filled group-hover:rotate-12 transition-transform">bolt</span>
                    GIAO DỊCH {selectedAiStock.s} NGAY
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="h-8 bg-[#1a1a1a] border-t border-black flex items-center justify-between px-6 text-[9px] text-gray-500 font-black uppercase tracking-widest shrink-0">
         <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#d946ef]"></div> TRẦN</span>
            <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-yellow-500"></div> TC</span>
            <span className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#22d3ee]"></div> SÀN</span>
         </div>
         <div className="opacity-40 tracking-normal text-[8px]">Hệ thống bảng giá Ology v5.0 - Bản quyền TIFA Finance</div>
      </footer>

      {/* ORDER MODAL */}
      {isOrderOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsOrderOpen(false)}></div>
           <div className="bg-[#121212] w-full max-w-[480px] rounded-[40px] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden relative animate-order-popup font-sans">
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.03]">
                 <div className="flex items-center gap-4">
                    <div className={`size-14 rounded-[20px] flex items-center justify-center font-black text-2xl border border-white/10 ${orderSide === 'BUY' ? 'bg-[#22c55e] text-white' : 'bg-[#ef4444] text-white'}`}>
                        {orderSymbol[0]}
                    </div>
                    <div>
                        <h3 className="text-white font-black text-[24px] tracking-tight leading-none">{orderSymbol}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${orderSide === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>LỆNH {orderSide === 'BUY' ? 'MUA' : 'BÁN'}</span>
                           <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Trading Console</span>
                        </div>
                    </div>
                 </div>
                 <button onClick={() => setIsOrderOpen(false)} className="size-11 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="p-8 space-y-7">
                 <div className="relative p-6 rounded-[28px] bg-gradient-to-br from-[#1d7139]/20 to-black border border-[#1d7139]/30 overflow-hidden group">
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-3">
                          <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                             <span className="material-symbols-outlined text-primary text-[22px] filled animate-pulse">smart_toy</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none">Ology Strategist</span>
                             <span className="text-[8px] text-gray-500 font-bold uppercase mt-1 tracking-widest">Chiến thuật hành động AI</span>
                          </div>
                       </div>
                       {!aiAdvice && !isAnalyzing && (
                          <button onClick={fetchAiAdvice} className="text-[9px] font-black text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-full uppercase tracking-widest transition-all">Phân tích</button>
                       )}
                    </div>

                    {isAnalyzing && (
                       <div className="flex flex-col items-center justify-center py-6 gap-3">
                          <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] animate-pulse italic">Đang chạy thuật toán tối ưu...</span>
                       </div>
                    )}

                    {aiAdvice && (
                       <div className="animate-fade-in space-y-4">
                          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                             <p className="text-[13.5px] text-gray-200 font-medium italic leading-relaxed">
                                "{aiAdvice}"
                             </p>
                          </div>
                       </div>
                    )}
                 </div>

                 <button 
                    onClick={() => { alert(`Lệnh ${orderSide} ${orderSymbol} đã được gửi!`); setIsOrderOpen(false); }}
                    className={`group relative w-full py-5 rounded-[24px] font-black text-[15px] uppercase tracking-[0.3em] shadow-2xl transition-all duration-300 active:scale-[0.98] overflow-hidden ${orderSide === 'BUY' ? 'bg-[#22c55e] text-white' : 'bg-[#ef4444] text-white'}`}
                 >
                    Xác nhận {orderSide === 'BUY' ? 'MUA' : 'BÁN'} {orderSymbol}
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-line {
          display: flex;
          width: max-content;
          animation: tickerScroll 40s linear infinite;
        }
        .animate-ticker-line:hover {
          animation-play-state: paused;
        }
        @keyframes orderPopup {
          from { opacity: 0; transform: scale(0.9) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-order-popup { animation: orderPopup 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>

    </div>
  );
};

export default StockBoard;
