import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(100000);

  useEffect(() => {
    const savedBalance = localStorage.getItem('tifa_balance');
    if (savedBalance) setBalance(parseFloat(savedBalance));
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      {/* Background Patterns */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-blue-600/20 to-transparent z-0"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md px-5 py-4 flex items-center justify-between">
         <button onClick={() => navigate('/home')} className="size-9 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
             <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">arrow_back</span>
         </button>
         <h1 className="text-lg font-bold dark:text-white">Cá nhân</h1>
         <div className="size-9"></div> {/* Spacer */}
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pt-6 space-y-8">
         {/* User Identity */}
         <div className="flex flex-col items-center">
            <div className="relative mb-4 group">
               <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-blue-500/10 transition-transform group-hover:scale-105 duration-500">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfU4B_DtHeUkMN9PDI5Rag6PVG8B3kAVoplRuFsDY_RegRAXJepFyDN6N_IFCfzWqTpEMdSYgEGCCRh2VoHxKt8QFdCVqI_SDDWnY08pctFG35Ewuf27teRKP1rovulmnM3m0sgxwAufzmxnQKAmibU6rL14XiG83iIIowF9PFoJa7xh11DSwKFjeTH9tgONVvpqu-7oRAki_WZRde3RwgGwnv2oG-Xip94KmC3Jr554QJD6h19gL6UFzO-7Meyu-ZnPmXSVaWSiL4" alt="Avatar" className="w-full h-full object-cover"/>
               </div>
               <button className="absolute bottom-1 right-1 size-9 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900 text-white flex items-center justify-center shadow-lg">
                   <span className="material-symbols-outlined text-sm">edit</span>
               </button>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Nguyễn Văn A</h2>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <span className="material-symbols-outlined text-xs text-blue-600">verified</span>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Học viên TIFA Elite</span>
            </div>
         </div>

         {/* Financial Summary Card */}
         <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Số dư Demo khả dụng</p>
                <h3 className="text-3xl font-black mb-6">${balance.toLocaleString()}</h3>
                
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                   <div className="text-center">
                       <span className="text-[9px] text-blue-200 uppercase font-bold">Bài học</span>
                       <p className="text-lg font-bold">12</p>
                   </div>
                   <div className="text-center border-x border-white/10">
                       <span className="text-[9px] text-blue-200 uppercase font-bold">Điểm TIFA</span>
                       <p className="text-lg font-bold">850</p>
                   </div>
                   <div className="text-center">
                       <span className="text-[9px] text-blue-200 uppercase font-bold">SIM Trade</span>
                       <p className="text-lg font-bold">05</p>
                   </div>
                </div>
            </div>
         </div>

         {/* Menu List */}
         <div className="space-y-3 pb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Cài đặt & Tiện ích</h4>
            {[
               { i: 'flag', l: 'Lộ trình học tập cá nhân', d: 'Theo dõi các mục tiêu của bạn' },
               { i: 'workspace_premium', l: 'Chứng chỉ TIFA', d: 'Các văn bằng bạn đã đạt được' },
               { i: 'history', l: 'Lịch sử giao dịch', d: 'Chi tiết lệnh mua/bán mô phỏng' },
               { i: 'notifications', l: 'Cài đặt thông báo', d: 'Tùy chỉnh thông báo thị trường' },
               { i: 'security', l: 'Bảo mật tài khoản', d: 'Đổi mật khẩu & 2FA' },
            ].map((m, idx) => (
               <button key={idx} className="w-full flex items-center justify-between rounded-2xl bg-white/90 dark:bg-[#1e2229]/90 backdrop-blur-sm p-4 border border-gray-100 dark:border-gray-800 shadow-sm group">
                  <div className="flex items-center gap-4 text-left">
                     <div className="size-10 rounded-xl bg-gray-50 dark:bg-black/20 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                         <span className="material-symbols-outlined">{m.i}</span>
                     </div>
                     <div>
                        <span className="font-bold text-slate-800 dark:text-white block text-sm">{m.l}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">{m.d}</span>
                     </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-600 transition-colors">chevron_right</span>
               </button>
            ))}
            
            <button 
                onClick={() => navigate('/login')}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-red-50 dark:bg-red-900/10 p-5 text-red-600 font-bold border border-red-100 dark:border-red-900/20 active:scale-95 transition-transform"
            >
                <span className="material-symbols-outlined">logout</span> Đăng xuất tài khoản
            </button>
         </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;