
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd do auth here
    navigate('/home');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display max-w-md mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 rounded-b-[100px] -z-10"></div>
      
      <div className="flex-1 flex flex-col px-8 pt-20 pb-12">
        <div className="flex flex-col items-center mb-12 animate-fade-in">
           <Logo size="lg" className="mb-6" />
           <h2 className="text-2xl font-black text-text-main dark:text-white tracking-tight">Chào mừng trở lại!</h2>
           <p className="text-text-sub dark:text-gray-400 text-sm font-medium mt-1">Đăng nhập để tiếp tục học tập</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 animate-fade-in-up">
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-sub dark:text-gray-500 ml-1">Số điện thoại</label>
              <div className="relative">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">smartphone</span>
                 <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full h-14 bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-sub dark:text-gray-500 ml-1">Mật khẩu</label>
              <div className="relative">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                 <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-12 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                 />
                 <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <span className="material-symbols-outlined">visibility</span>
                 </button>
              </div>
              <div className="flex justify-end">
                 <button type="button" className="text-xs font-bold text-primary">Quên mật khẩu?</button>
              </div>
           </div>

           <button 
              type="submit"
              className="w-full h-14 bg-primary text-white rounded-2xl font-black text-base shadow-xl shadow-primary/30 active:scale-[0.98] transition-all mt-4"
           >
              Đăng nhập
           </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-6 animate-fade-in">
           <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hoặc đăng nhập bằng</span>
              <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
           </div>

           <div className="flex gap-4">
              <button className="size-14 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-6" alt="Google" />
              </button>
              <button className="size-14 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                 <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="size-6" alt="Facebook" />
              </button>
              <button className="size-14 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                 <img src="https://www.svgrepo.com/show/475633/apple-color.svg" className="size-6 dark:invert" alt="Apple" />
              </button>
           </div>

           <p className="text-sm font-medium text-text-sub">
              Chưa có tài khoản? <button className="font-bold text-primary" onClick={() => navigate('/onboarding')}>Đăng ký ngay</button>
           </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Login;
