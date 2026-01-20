
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const IndexDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const indexName = (id || 'VN-INDEX').toUpperCase().replace('INDEX', '-INDEX');
  const [activeTab, setActiveTab] = useState<'T.QUAN' | 'TỰ DOANH' | 'KHỐI NGOẠI' | 'NGÀNH'>('T.QUAN');
  const [timeRange, setTimeRange] = useState('1D');
  
  // Fake Data State for UI Matching
  const [marketData, setMarketData] = useState<any>({
      price: '1879.13', change: '14.33', pct: '0.77%',
      vol: '1,021,323,506', val: '35,636',
      updateTime: '15:10:15 16/01'
  });

  const [foreignData, setForeignData] = useState<any>({
      buyVal: '3,300.24', sellVal: '4,426.72', netVal: '-1,126.48',
      buyVol: '69,209,010', sellVol: '116,232,440',
      chart: []
  });

  const [propData, setPropData] = useState<any[]>([]);
  const [overviewData, setOverviewData] = useState<any[]>([]);
  const [marketDistribution, setMarketDistribution] = useState([
     { symbol: 'VCB', val: -100, color: '#f43f5e' }, 
     { symbol: 'VIC', val: 41.59, color: '#22c55e' }, 
     { symbol: 'HPG', val: -22.55, color: '#f43f5e' },
     { symbol: 'VPB', val: -47.06, color: '#f43f5e' },
     { symbol: 'VIX', val: -153.98, color: '#f43f5e' }
  ]);

  useEffect(() => {
     const genOverview = () => {
         const arr = [];
         let base = 1860;
         for(let i=0; i<60; i++) {
             base += (Math.random() - 0.4) * 5;
             arr.push({ time: i, price: base });
         }
         setOverviewData(arr);
     };

     const genProp = () => {
         const dates = ['19/12', '24/12', '29/12', '05/01', '08/01', '13/01', '16/01'];
         const arr = dates.map(d => ({
             date: d,
             value: Math.floor((Math.random() - 0.5) * 2000)
         }));
         setPropData(arr);
     };

     const genForeign = () => {
         const arr = [];
         let buyAcc = 0;
         let sellAcc = 0;
         for(let i=0; i<20; i++) {
             buyAcc += Math.random() * 100;
             sellAcc += Math.random() * 120;
             arr.push({ time: i, buy: buyAcc, sell: sellAcc });
         }
         setForeignData((prev: any) => ({ ...prev, chart: arr }));
     };

     genOverview();
     genProp();
     genForeign();
  }, []);

  const renderOverview = () => (
      <div className="space-y-6 animate-fade-in bg-white dark:bg-background-dark min-h-screen">
          <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
              {['1D', '10D', '1M', '3M', '6M', '1Y', '5Y'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all ${timeRange === t ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-500'}`}
                  >
                      {t}
                  </button>
              ))}
              <button className="px-3 py-1 rounded-lg bg-[#1d7139] text-white text-[12px] font-black flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">candlestick_chart</span> PTKT
              </button>
          </div>

          <div className="h-[240px] w-full px-0">
              <div className="px-4 mb-2 flex justify-between items-center text-[10px] text-gray-400 uppercase font-black">
                  <span>Giá (nghìn đồng)</span>
                  <span>Chỉ số</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overviewData}>
                      <defs>
                          <linearGradient id="colorOverview" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" hide />
                      <YAxis orientation="right" domain={['auto', 'auto']} tick={{fontSize: 10}} axisLine={false} tickLine={false}/>
                      <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} fill="url(#colorOverview)" isAnimationActive={false} />
                  </AreaChart>
              </ResponsiveContainer>
          </div>

          <div className="h-[80px] w-full px-4">
               <p className="text-[10px] text-gray-400 font-black uppercase mb-1">KL (triệu CP)</p>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewData.slice(0, 40)}>
                      <Bar dataKey="price" fill="#cbd5e1" isAnimationActive={false} />
                  </BarChart>
               </ResponsiveContainer>
          </div>

          <div className="px-4 pb-6 mt-8">
              <h3 className="font-black text-[15px] text-slate-800 dark:text-white mb-1">So sánh giao dịch so với phiên trước {indexName}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Biểu đồ cho thấy dòng tiền khoẻ hay yếu với cùng thời điểm phiên trước</p>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                  <div className="w-[65%] bg-[#1d7139]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2 uppercase">
                  <span>Hôm nay</span>
                  <span>Phiên trước</span>
              </div>
          </div>
      </div>
  );

  const renderProprietary = () => (
      <div className="animate-fade-in bg-white dark:bg-background-dark min-h-screen">
          <div className="px-4 pt-4 flex justify-end">
              <span className="text-[10px] text-gray-400 font-bold uppercase italic">*Đơn vị GTGD: x 1 tỷ vnđ</span>
          </div>
          <div className="h-[280px] w-full px-2 mt-2 relative">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis orientation="right" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <ReferenceLine y={0} stroke="#94a3b8" />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" isAnimationActive={false}>
                        {propData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>

          <div className="px-4 mt-8 space-y-4">
             <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">Giá trị tự doanh mua/bán ròng</h3>
                <p className="text-sm font-bold text-slate-600 dark:text-gray-400 mt-1">Dữ liệu ngày 16/01/2026</p>
             </div>
             <div className="space-y-3 pt-2">
                 <div className="flex justify-between items-center">
                     <span className="text-gray-700 dark:text-gray-300 text-[14px]">Giá trị mua ròng(khớp lệnh):</span>
                     <span className="font-black text-green-500 text-[14px]">+ 85.08 tỷ</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <span className="text-gray-700 dark:text-gray-300 text-[14px]">Giá trị mua ròng(thỏa thuận):</span>
                     <span className="font-black text-red-500 text-[14px]">-291.35 tỷ</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                     <span className="font-black text-slate-900 dark:text-white text-lg">Tổng GT mua ròng:</span>
                     <span className="font-black text-red-500 text-lg">-206.28 tỷ</span>
                 </div>
             </div>
          </div>
          
          <div className="px-4 mt-12 pb-10">
              <h3 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Biểu đồ thị trường - Tự doanh</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Cập nhật lúc: 17:33:58 16/01. Dữ liệu từ ngày 16/01/2026</p>
          </div>
      </div>
  );

  const renderForeign = () => (
      <div className="animate-fade-in bg-white dark:bg-background-dark min-h-screen">
          <div className="divide-y divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800">
             <div className="flex justify-between items-center py-4 px-4">
                 <span className="font-bold text-slate-700 dark:text-gray-300">Giá trị Khối ngoại mua (tỷ)</span>
                 <span className="font-black font-mono text-slate-900 dark:text-white">{foreignData.buyVal}</span>
             </div>
             <div className="flex justify-between items-center py-4 px-4">
                 <span className="font-bold text-slate-700 dark:text-gray-300">Giá trị Khối ngoại bán (tỷ)</span>
                 <span className="font-black font-mono text-slate-900 dark:text-white">{foreignData.sellVal}</span>
             </div>
             <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-white/5">
                 <span className="font-bold text-slate-700 dark:text-gray-300">Giá trị mua bán ròng (tỷ)</span>
                 <span className="font-black font-mono text-red-500">{foreignData.netVal}</span>
             </div>
             <div className="flex justify-between items-center py-4 px-4">
                 <span className="font-bold text-slate-700 dark:text-gray-300">KL Khối ngoại mua (CP)</span>
                 <span className="font-black font-mono text-slate-900 dark:text-white">{foreignData.buyVol}</span>
             </div>
             <div className="flex justify-between items-center py-4 px-4">
                 <span className="font-bold text-slate-700 dark:text-gray-300">KL Khối ngoại bán (CP)</span>
                 <span className="font-black font-mono text-slate-900 dark:text-white">{foreignData.sellVol}</span>
             </div>
          </div>

          <div className="mt-8 px-4">
              <h3 className="font-black text-slate-800 dark:text-white mb-4">Giá trị GD Khối ngoại <span className="text-gray-400 font-normal">(Luỹ kế - Tỷ)</span></h3>
              <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={foreignData.chart}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb"/>
                          <XAxis dataKey="time" hide />
                          <YAxis orientation="right" hide />
                          <Area type="monotone" dataKey="buy" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.3} isAnimationActive={false} />
                          <Area type="monotone" dataKey="sell" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.3} isAnimationActive={false} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-[11px] font-black uppercase tracking-tight">
                  <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-green-500 rounded-full"></span> GT Khối ngoại Mua</div>
                  <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-red-500 rounded-full"></span> GT Khối ngoại Bán</div>
              </div>
          </div>

          <div className="mt-12 px-4 pb-12">
               <h3 className="font-black text-xl text-slate-800 dark:text-white mb-6 leading-none">Biểu đồ thị trường</h3>
               <div className="flex w-full h-16 rounded-[12px] overflow-hidden text-white text-[10px] font-black uppercase">
                  {marketDistribution.map((item, idx) => (
                      <div key={idx} style={{ flex: Math.abs(item.val) || 10, backgroundColor: item.color }} className="flex flex-col items-center justify-center border-r border-white/20 last:border-0 relative px-1">
                           <span className="truncate w-full text-center">{item.symbol}</span>
                           <span className="truncate w-full text-center">{item.val} tỷ</span>
                           {idx === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-red-500 rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg">1000</div>}
                      </div>
                  ))}
               </div>
          </div>
      </div>
  );

  return (
    <div className="bg-white dark:bg-background-dark min-h-screen pb-20 max-w-md mx-auto shadow-2xl flex flex-col font-display text-slate-900 dark:text-white">
      
      {/* 1. HEADER - TIFA STYLED BACK NAVIGATION */}
      <div className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 backdrop-blur-xl">
         <div className="flex items-center justify-between px-4 py-3">
             <div onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer group">
                 <span className="material-symbols-outlined text-slate-800 dark:text-white text-2xl group-active:scale-90 transition-transform">chevron_left</span>
                 <h1 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">{indexName}</h1>
             </div>
             <div className="flex items-center gap-4">
                 <span className="material-symbols-outlined text-slate-800 dark:text-white">search</span>
                 <span className="material-symbols-outlined text-slate-800 dark:text-white">notifications</span>
                 <span onClick={() => navigate('/home')} className="material-symbols-outlined text-slate-800 dark:text-white cursor-pointer hover:text-[#1d7139] transition-colors font-light">home</span>
             </div>
         </div>

         <div className="px-4 pb-4 mt-2">
             <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                    <h1 className="text-[32px] font-black tracking-tighter text-slate-900 dark:text-white leading-none">{marketData.price}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-black text-green-500">{marketData.change}</span>
                        <span className="text-lg font-black text-green-500">({marketData.pct})</span>
                    </div>
                 </div>
                 <button 
                    onClick={() => navigate('/stock-board')}
                    className="flex items-center gap-1.5 px-3 py-2 border border-[#1d7139] text-[#1d7139] rounded-xl text-[11px] font-black active:bg-[#1d7139]/5 transition-all shadow-sm"
                 >
                    <span className="material-symbols-outlined text-[18px] filled">monitoring</span>
                    BẢNG GIÁ
                 </button>
             </div>
             
             <div className="flex justify-between items-end mt-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                 <div className="space-y-0.5">
                     <p>GTGD: <span className="font-black text-slate-800 dark:text-white">{marketData.val} tỷ</span></p>
                     <p>KL: <span className="font-black text-slate-800 dark:text-white">{marketData.vol} CP</span></p>
                 </div>
                 <p className="font-bold opacity-60 text-right text-[9px]">Cập nhật lúc {marketData.updateTime}</p>
             </div>
         </div>

         {/* 2. TABS */}
         <div className="flex px-2 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
             {['T.QUAN', 'TỰ DOANH', 'KHỐI NGOẠI', 'NGÀNH', 'TÍN HIỆU'].map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-3.5 text-[12px] font-black whitespace-nowrap border-b-[3px] transition-all uppercase tracking-tight ${activeTab === tab ? 'text-[#1d7139] border-[#1d7139]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                 >
                    {tab}
                 </button>
             ))}
         </div>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-background-dark">
         {activeTab === 'T.QUAN' && renderOverview()}
         {activeTab === 'TỰ DOANH' && renderProprietary()}
         {activeTab === 'KHỐI NGOẠI' && renderForeign()}
         {['NGÀNH', 'TÍN HIỆU'].includes(activeTab) && (
             <div className="p-20 text-center opacity-30 flex flex-col items-center">
                 <span className="material-symbols-outlined text-5xl mb-4">construction</span>
                 <p className="font-black uppercase tracking-widest text-[11px]">Đang phát triển dữ liệu...</p>
             </div>
         )}
      </div>

      {/* 4. FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-[#0a1a11] border-t border-gray-100 dark:border-gray-800 p-2 flex justify-between items-center text-[10px] text-gray-400 font-black z-50">
          <div className="flex-1 flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform">
              <div className="relative">
                 <span className="material-symbols-outlined text-gray-400 group-hover:text-[#1d7139] transition-colors">chat_bubble</span>
                 <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[7px] px-1 rounded-full font-black">1000</span>
              </div>
              <span className="uppercase tracking-tighter">Bình luận</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform" onClick={() => navigate('/chat')}>
              <div className="size-8 bg-slate-800 dark:bg-[#1d7139]/20 rounded-full flex items-center justify-center text-white dark:text-[#1d7139]">
                 <span className="material-symbols-outlined text-[18px] filled">smart_toy</span>
              </div>
              <span className="uppercase tracking-tighter text-slate-800 dark:text-[#1d7139]">Trợ lý TIFA</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#1d7139] transition-colors">sports_esports</span>
              <span className="uppercase tracking-tighter">Game CK</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#1d7139] transition-colors">share</span>
              <span className="uppercase tracking-tighter">Chia sẻ</span>
          </div>
      </div>

    </div>
  );
};

export default IndexDetail;
