
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

const MiniBoard: React.FC = () => {
  const navigate = useNavigate();
  const chartRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const chartsInstances = useRef<(Chart | null)[]>([]);

  const seriesData = [
    { 
      name: 'VN-INDEX', 
      price: '1894.44', 
      diff: '-8.49',
      pct: '(-0.45%)', 
      vol: '1,423tr CP',
      val: '46,391 tỷ',
      isUp: false 
    },
    { 
      name: 'VN30-INDEX', 
      price: '2067.10', 
      diff: '-22.11',
      pct: '(-1.06%)', 
      vol: '688tr CP',
      val: '28,233 tỷ',
      isUp: false 
    },
    { 
      name: 'HNX-INDEX', 
      price: '244.27', 
      diff: '+1.45',
      pct: '(+0.61%)', 
      vol: '314tr CP',
      val: '5,120 tỷ',
      isUp: true 
    },
    { 
      name: 'UPCOM-INDEX', 
      price: '92.15', 
      diff: '+0.32',
      pct: '(+0.35%)', 
      vol: '120tr CP',
      val: '2,450 tỷ',
      isUp: true 
    }
  ];

  useEffect(() => {
    function makeSeries(isUp: boolean) {
      return Array.from({ length: 15 }, () => (Math.random() * 5 + (isUp ? 10 : 5)));
    }

    seriesData.forEach((s, idx) => {
      if (chartRefs.current[idx]) {
        if (chartsInstances.current[idx]) chartsInstances.current[idx]?.destroy();
        
        const color = s.isUp ? '#22c55e' : '#ef4444';
        chartsInstances.current[idx] = new Chart(chartRefs.current[idx]!, {
          type: 'line',
          data: {
            labels: new Array(15).fill(''),
            datasets: [{
              data: makeSeries(s.isUp),
              borderColor: color,
              borderWidth: 1.5,
              tension: 0.4,
              pointRadius: 0,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
          }
        });
      }
    });

    return () => chartsInstances.current.forEach(c => c?.destroy());
  }, []);

  return (
    <div className="flex overflow-x-auto no-scrollbar py-3.5 px-1 bg-white dark:bg-[#122118]">
      {seriesData.map((item, idx) => (
        <div 
          key={idx} 
          onClick={() => navigate(`/index/${item.name.toLowerCase()}`)}
          className={`flex-1 min-w-[155px] px-3 shrink-0 transition-all active:opacity-70 cursor-pointer ${
            idx !== 0 ? 'border-l border-gray-100 dark:border-gray-800' : ''
          }`}
        >
          {/* Dòng 1: Tên & Biểu đồ */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-black text-slate-800 dark:text-white leading-none tracking-tight">{item.name}</span>
            <div className="w-12 h-3.5">
              <canvas ref={el => { chartRefs.current[idx] = el; }}></canvas>
            </div>
          </div>
          
          {/* Dòng 2: Giá & Biến động */}
          <div className="flex items-baseline gap-1.5 leading-none mb-1">
            <span className="text-[16px] font-black text-slate-900 dark:text-white tracking-tighter">{item.price}</span>
            <span className={`text-[11px] font-black ${item.isUp ? 'text-green-500' : 'text-rose-500'}`}>
              {item.diff}{item.pct}
            </span>
          </div>

          {/* Dòng 3: Khối lượng & Giá trị */}
          <div className="text-[9px] font-bold text-gray-300 dark:text-gray-500 whitespace-nowrap tracking-tight">
            {item.vol} {item.val}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiniBoard;
