import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

interface Lesson {
  id: string;
  title: string;
  desc: string;
  progress: number;
  tag: string;
  color: string;
  thumbnail: string;
}

interface Expert {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  rating: number;
  sessions: number;
  experience: string;
  students: string;
  isOnline: boolean;
  specialties: string[];
}

const LESSONS_DATA: Lesson[] = [
  { 
    id: "l1", 
    title: "Nhập môn Chứng khoán", 
    desc: "Hiểu rõ luật chơi của thị trường tài chính hiện đại và cách bắt đầu lệnh đầu tiên.", 
    progress: 100, 
    tag: "CƠ BẢN", 
    color: "bg-green-100 text-green-600",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop"
  },
  { 
    id: "l2", 
    title: "Quản lý Tài chính Cá nhân", 
    desc: "Quy tắc 50/30/20 và lộ trình tự do tài chính trước tuổi 35.", 
    progress: 80, 
    tag: "PHỔ THÔNG", 
    color: "bg-blue-100 text-blue-600",
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format&fit=crop"
  },
  { 
    id: "l3", 
    title: "Đọc hiểu Báo cáo Tài chính", 
    desc: "Bóc tách Bảng cân đối kế toán, Báo cáo kết quả kinh doanh và Lưu chuyển tiền tệ.", 
    progress: 45, 
    tag: "CHUYÊN SÂU", 
    color: "bg-purple-100 text-purple-600",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop"
  },
  { 
    id: "l4", 
    title: "Nghệ thuật Đọc Đồ thị Nến", 
    desc: "Nhận diện các mẫu hình nến đảo chiều và tiếp diễn để tìm điểm vào lệnh tối ưu.", 
    progress: 15, 
    tag: "KỸ THUẬT", 
    color: "bg-rose-100 text-rose-600",
    thumbnail: "https://sf-static.upanhlaylink.com/img/image_202601206edd3db3d9f53587a41b09815e957724.jpg"
  },
  { 
    id: "l5", 
    title: "Tâm lý học trong Giao dịch", 
    desc: "Kiểm soát nỗi sợ hãi và lòng tham - Chìa khóa vàng để tồn tại trên thị trường.", 
    progress: 0, 
    tag: "TÂM LÝ", 
    color: "bg-amber-100 text-amber-700",
    thumbnail: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=400&auto=format&fit=crop"
  },
  { 
    id: "l6", 
    title: "Chiến lược Đầu tư Giá trị", 
    desc: "Tìm kiếm những 'viên kim cương trong cát' dựa trên triết lý của Warren Buffett.", 
    progress: 0, 
    tag: "PREMIUM", 
    color: "bg-indigo-100 text-indigo-700",
    thumbnail: "https://images.unsplash.com/photo-1526303328194-ed25228916b3?q=80&w=400&auto=format&fit=crop"
  }
];

const EXPERTS_DATA: Expert[] = [
  {
    id: "e1",
    name: "Dr. Trần Minh",
    role: "Chuyên gia Kinh tế Vĩ mô",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    bio: "Hơn 15 năm kinh nghiệm phân tích tại các quỹ đầu tư quốc tế. Chuyên gia tư vấn cấp cao về xu hướng vĩ mô.",
    rating: 4.9,
    sessions: 1250,
    experience: "15 năm",
    students: "12k+",
    isOnline: true,
    specialties: ["Vĩ mô", "Trái phiếu", "Tiền tệ"]
  },
  {
    id: "e2",
    name: "Lê Thanh Vân",
    role: "Bậc thầy Phân tích Kỹ thuật",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    bio: "Sáng lập cộng đồng Trader Việt với hơn 50.000 thành viên. Chuyên gia đào tạo phương pháp Wyckoff và SMC.",
    rating: 4.8,
    sessions: 890,
    experience: "10 năm",
    students: "25k+",
    isOnline: true,
    specialties: ["Kỹ thuật", "Price Action", "SMC"]
  },
  {
    id: "e3",
    name: "Phạm Hải Nam",
    role: "Cố vấn Tài chính Cá nhân",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    bio: "Giúp hàng nghìn gia đình thiết lập kế hoạch tài chính bền vững và đạt được tự do tài chính sớm.",
    rating: 5.0,
    sessions: 450,
    experience: "8 năm",
    students: "5k+",
    isOnline: false,
    specialties: ["Cá nhân", "Bất động sản", "Bảo hiểm"]
  }
];

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'lessons' | 'experts' | 'simulation'>('lessons');

  const views = [
    { id: 'lessons', label: 'BÀI GIẢNG', icon: 'school' },
    { id: 'experts', label: 'CHUYÊN GIA', icon: 'record_voice_over' },
    { id: 'simulation', label: 'MÔ PHỎNG', icon: 'rocket_launch' }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'lessons':
        return (
          <div className="space-y-6 animate-fade-in">
            {LESSONS_DATA.map((lesson) => (
              <div 
                key={lesson.id} 
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="bg-white dark:bg-[#16241c] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={lesson.title} />
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${lesson.color}`}>
                      {lesson.tag}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                      <span className="material-symbols-outlined text-white text-[32px] filled ml-1">play_arrow</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[17px] text-slate-800 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors">{lesson.title}</h3>
                  <p className="text-[11.5px] text-slate-500 dark:text-gray-400 mb-5 leading-relaxed line-clamp-2">{lesson.desc}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${lesson.progress}%` }}></div>
                    </div>
                    <span className="text-[11px] font-black text-primary dark:text-emerald-400 min-w-[30px] text-right">{lesson.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'experts':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-[32px] border border-primary/10 shadow-sm mb-2">
               <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary text-[24px] filled">verified</span>
                  <h4 className="text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Đội ngũ Mentor TIFA</h4>
               </div>
               <p className="text-[11.5px] text-slate-600 dark:text-gray-400 leading-relaxed italic">
                 Kết nối 1-1 với những bộ óc tài chính hàng đầu. Nhận chiến lược đầu tư thực chiến và tối ưu hóa danh mục cá nhân ngay hôm nay.
               </p>
            </div>

            {EXPERTS_DATA.map((expert) => (
              <div key={expert.id} className="relative bg-white dark:bg-[#16241c] rounded-[36px] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden group transition-all hover:-translate-y-1">
                {/* Status Indicator */}
                <div className="absolute top-5 right-6 z-10 flex items-center gap-2">
                   <span className={`size-2 rounded-full ${expert.isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-400'} animate-pulse`}></span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                     {expert.isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
                   </span>
                </div>

                <div className="p-7">
                   <div className="flex gap-6 mb-6">
                      <div className="relative shrink-0">
                         <div className="size-20 rounded-[28px] overflow-hidden border-2 border-primary/10 shadow-lg">
                            <img src={expert.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt={expert.name} />
                         </div>
                         <div className="absolute -bottom-2 -right-2 size-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-500 text-[18px] filled">stars</span>
                         </div>
                      </div>

                      <div className="flex flex-col justify-center">
                         <h4 className="text-[18px] font-black text-slate-900 dark:text-white leading-none mb-1.5">{expert.name}</h4>
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">{expert.role}</span>
                         <div className="flex gap-1.5">
                            {expert.specialties.map((s, i) => (
                               <span key={i} className="text-[8px] font-black text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg uppercase tracking-wider">{s}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 mb-6 border-y border-gray-50 dark:border-gray-800 py-5">
                      <div className="text-center">
                         <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 block">Học viên</span>
                         <p className="text-[14px] font-black text-slate-800 dark:text-white">{expert.students}</p>
                      </div>
                      <div className="text-center border-x border-gray-100 dark:border-gray-800 px-2">
                         <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 block">Đánh giá</span>
                         <div className="flex items-center justify-center gap-1">
                            <span className="text-[14px] font-black text-slate-800 dark:text-white">{expert.rating}</span>
                            <span className="material-symbols-outlined text-[12px] text-amber-500 filled">star</span>
                         </div>
                      </div>
                      <div className="text-center">
                         <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 block">Kinh nghiệm</span>
                         <p className="text-[14px] font-black text-slate-800 dark:text-white">{expert.experience}</p>
                      </div>
                   </div>

                   <p className="text-[12.5px] text-slate-600 dark:text-gray-400 leading-relaxed mb-7 line-clamp-2 italic font-medium">
                     "{expert.bio}"
                   </p>

                   <div className="flex gap-3">
                      <button className="flex-1 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
                        Kết nối ngay
                      </button>
                      <button className="size-14 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-slate-600 dark:text-white active:scale-95 transition-all hover:bg-gray-50">
                        <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                      </button>
                   </div>
                </div>
              </div>
            ))}
            
            <div className="py-10 text-center">
               <button className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-primary transition-colors">Trở thành Mentor của TIFA</button>
            </div>
          </div>
        );
      case 'simulation':
        return (
          <div className="animate-fade-in space-y-6">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden text-center">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-[64px] mb-4">rocket_launch</span>
                <h3 className="text-2xl font-black mb-3">Giao Dịch Mô Phỏng</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-8">Trải nghiệm thị trường thực tế với số vốn 100,000 USD tiền ảo. Học cách quản trị rủi ro mà không lo mất tiền thật.</p>
                <button 
                  onClick={() => navigate('/simulation')}
                  className="px-10 py-4 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Tham gia ngay
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">speed</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#16241c] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
               <h4 className="font-black text-slate-800 dark:text-white text-center mb-4 uppercase tracking-widest text-[12px]">Thành tích của bạn</h4>
               <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Xếp hạng</span>
                  <p className="text-xl font-black text-slate-800 dark:text-white">#1.240</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Lợi nhuận</span>
                  <p className="text-xl font-black text-green-500">+12.5%</p>
                </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#f0f4f2] dark:bg-[#0a1a11] min-h-screen pb-32 max-w-md mx-auto shadow-2xl relative transition-colors duration-300 font-body overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* 1. HEADER SECTION */}
      <div className="relative h-[260px] w-full overflow-hidden shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop" 
          className="w-full h-full object-cover brightness-[0.4] saturate-[1.2]" 
          alt="header-bg" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f0f4f2] dark:from-[#0a1a11] via-transparent to-black/30"></div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-5">
          <Logo size="header" />
          <button onClick={() => navigate('/profile')} className="size-9 rounded-full overflow-hidden border border-white/30 shadow-lg bg-black/40 backdrop-blur-md active:scale-95 transition-transform">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </button>
        </div>

        <div className="absolute bottom-12 left-10 z-20">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.4em] mb-1 font-display">TIFA ACADEMY</p>
            <h2 className="text-white text-[32px] font-black tracking-tighter leading-tight drop-shadow-2xl">
              Kiến thức đầu tư
            </h2>
        </div>
      </div>

      {/* 2. PILL VIEW SWITCHER */}
      <div className="px-6 -mt-8 relative z-50 mb-8 flex justify-center">
        <div className="bg-white dark:bg-[#16241c] p-1.5 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center w-full max-w-[360px]">
          {views.map((view) => (
            <button 
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex-1 py-3.5 rounded-[20px] text-[9.5px] font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 ${
                activeView === view.id 
                ? 'bg-primary text-white shadow-xl scale-105 z-10' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeView === view.id ? 'filled' : ''}`}>
                {view.icon}
              </span>
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="px-5 pb-10">
        {renderContent()}
      </div>

      <BottomNav />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Courses;
