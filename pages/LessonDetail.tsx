import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';

interface SubLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked?: boolean;
}

interface LessonContent {
  title: string;
  mentor: string;
  mentorImg: string;
  progress: number;
  thumbnail: string;
  curriculum: SubLesson[];
}

// Map dữ liệu bài học chi tiết theo ID từ danh sách bài giảng
const LESSON_DATABASE: Record<string, LessonContent> = {
  "l1": {
    title: "Nhập môn Chứng khoán cho người mới",
    mentor: "Dr. Trần Minh",
    mentorImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100",
    progress: 100,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000",
    curriculum: [
      { id: '1', title: 'Chứng khoán là gì? Tại sao phải đầu tư?', duration: '12:05', isCompleted: true },
      { id: '2', title: 'Các loại tài sản tài chính phổ biến', duration: '18:40', isCompleted: true },
      { id: '3', title: 'Luật chơi trên sàn HOSE, HNX và UPCOM', duration: '25:15', isCompleted: true },
      { id: '4', title: 'Tổng kết chương: Tư duy tài sản', duration: '05:30', isCompleted: true },
    ]
  },
  "l2": {
    title: "Quản lý Tài chính Cá nhân 4.0",
    mentor: "Phạm Hải Nam",
    mentorImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
    progress: 80,
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000",
    curriculum: [
      { id: '1', title: 'Quy tắc 50/30/20 trong kỷ nguyên số', duration: '15:20', isCompleted: true },
      { id: '2', title: 'Lập ngân sách bằng ứng dụng thông minh', duration: '10:45', isCompleted: true },
      { id: '3', title: 'Thoát bẫy nợ tín dụng tiêu dùng', duration: '22:15', isCompleted: true },
      { id: '4', title: 'Xây dựng quỹ dự phòng khẩn cấp', duration: '18:00', isCompleted: false },
      { id: '5', title: 'Kế hoạch nghỉ hưu sớm (FIRE)', duration: '25:00', isCompleted: false, isLocked: true },
    ]
  },
  "l3": {
    title: "Đọc hiểu Báo cáo Tài chính chuyên sâu",
    mentor: "Dr. Trần Minh",
    mentorImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100",
    progress: 45,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000",
    curriculum: [
      { id: '1', title: 'Cấu trúc Bảng cân đối kế toán', duration: '30:00', isCompleted: true },
      { id: '2', title: 'Đọc vị doanh thu và lợi nhuận ảo', duration: '45:10', isCompleted: true },
      { id: '3', title: 'Dòng tiền và khả năng chi trả cổ tức', duration: '35:20', isCompleted: false },
      { id: '4', title: 'Phân tích các chỉ số tài chính trọng yếu', duration: '40:00', isCompleted: false, isLocked: true },
    ]
  },
  "l4": {
    title: "Nghệ thuật Đọc Đồ thị Nến Nhật",
    mentor: "Lê Thanh Vân",
    mentorImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100",
    progress: 15,
    thumbnail: "https://sf-static.upanhlaylink.com/img/image_202601206edd3db3d9f53587a41b09815e957724.jpg",
    curriculum: [
      { id: '1', title: 'Lịch sử và ý nghĩa của nến Nhật', duration: '10:00', isCompleted: true },
      { id: '2', title: '12 mẫu hình nến đảo chiều mạnh nhất', duration: '55:00', isCompleted: false },
      { id: '3', title: 'Kết hợp nến và khối lượng giao dịch', duration: '42:15', isCompleted: false },
      { id: '4', title: 'Thực hành soi kèo trực tiếp', duration: '60:00', isCompleted: false, isLocked: true },
    ]
  },
  "l5": {
    title: "Tâm lý học trong Giao dịch tài chính",
    mentor: "Lê Thanh Vân",
    mentorImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100",
    progress: 0,
    thumbnail: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=1000",
    curriculum: [
      { id: '1', title: 'Nỗi sợ hãi và lòng tham: Kẻ thù số 1', duration: '20:00', isCompleted: false },
      { id: '2', title: 'Hiệu ứng tâm lý bầy đàn trong đầu tư', duration: '25:00', isCompleted: false },
      { id: '3', title: 'Xây dựng kỷ luật thép của Trader', duration: '35:00', isCompleted: false },
    ]
  },
  "l6": {
    title: "Chiến lược Đầu tư Giá trị (Value Investing)",
    mentor: "Warren Buffett (Legacy)",
    mentorImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100",
    progress: 0,
    thumbnail: "https://images.unsplash.com/photo-1526303328194-ed25228916b3?q=80&w=1000",
    curriculum: [
      { id: '1', title: 'Triết lý biên an toàn (Margin of Safety)', duration: '30:00', isCompleted: false },
      { id: '2', title: 'Cách định giá doanh nghiệp đơn giản', duration: '40:00', isCompleted: false },
      { id: '3', title: 'Lợi thế cạnh tranh bền vững (Moat)', duration: '45:00', isCompleted: false },
    ]
  }
};

const LessonDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'resources'>('content');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Lấy dữ liệu từ database dựa trên ID bài học
  const lessonData = id ? LESSON_DATABASE[id] : null;

  if (!lessonData) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#0a1a11] min-h-screen flex flex-col items-center justify-center p-10 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">Không tìm thấy bài học</h2>
        <button onClick={() => navigate('/courses')} className="mt-6 px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0a1a11] min-h-screen max-w-md mx-auto relative transition-colors duration-300 font-display overflow-x-hidden flex flex-col h-screen text-slate-900 dark:text-white">
      
      {/* 1. PREMIUM VIDEO PLAYER AREA */}
      <div className="relative w-full aspect-video bg-black overflow-hidden shrink-0 group shadow-2xl">
        <img 
          src={lessonData.thumbnail} 
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
          alt="Video Thumbnail" 
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="size-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl shadow-primary/40 active:scale-90 transition-all border border-white/20 backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-[40px] filled ml-1">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Video Controls bar (Fake) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2">
           <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary shadow-[0_0_10px_#1d7139]" style={{ width: `${lessonData.progress}%` }}></div>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black text-white/80 uppercase tracking-widest">
              <span>{lessonData.progress > 0 ? 'Tiếp tục xem' : 'Bắt đầu học'}</span>
              <div className="flex gap-4">
                 <span className="material-symbols-outlined text-sm cursor-pointer hover:text-white">settings</span>
                 <span className="material-symbols-outlined text-sm cursor-pointer hover:text-white">fullscreen</span>
              </div>
           </div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 size-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all z-50"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      {/* 2. LESSON INFO SECTION */}
      <div className="bg-white dark:bg-[#0a1a11] p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
         <div className="flex justify-between items-start mb-3">
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight flex-1 pr-4">{lessonData.title}</h1>
            <div className="size-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
               <span className="material-symbols-outlined text-[20px] filled">bookmark</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="size-6 rounded-full overflow-hidden border border-primary/20">
                  <img src={lessonData.mentorImg} className="w-full h-full object-cover" alt="Mentor" />
               </div>
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{lessonData.mentor}</span>
            </div>
            <div className="h-3 w-[1px] bg-gray-200 dark:bg-gray-800"></div>
            <span className="text-[11px] font-black text-primary uppercase tracking-widest">Tiến độ: {lessonData.progress}%</span>
         </div>
      </div>

      {/* 3. INTERACTIVE TABS */}
      <div className="flex px-4 bg-white dark:bg-[#0a1a11] border-b border-gray-100 dark:border-gray-800 shrink-0">
         {[
           { id: 'content', label: 'Nội dung', icon: 'list_alt' },
           { id: 'notes', label: 'Ghi chú', icon: 'edit_note' },
           { id: 'resources', label: 'Tài liệu', icon: 'folder_open' }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all ${
               activeTab === tab.id ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-slate-600'
             }`}
           >
             <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
             {tab.label}
           </button>
         ))}
      </div>

      {/* 4. TAB CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0a1a11] p-5 no-scrollbar">
         {activeTab === 'content' && (
           <div className="space-y-4 animate-fade-in">
              {lessonData.curriculum.map((sub, index) => (
                <div 
                  key={sub.id} 
                  className={`p-4 rounded-[24px] border transition-all flex items-center gap-4 ${
                    sub.isLocked 
                    ? 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60' 
                    : sub.isCompleted
                    ? 'bg-white dark:bg-[#16241c] border-primary/20'
                    : 'bg-white dark:bg-[#16241c] border-gray-100 dark:border-gray-800 shadow-sm'
                  }`}
                >
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                    sub.isCompleted ? 'bg-primary text-white' : sub.isLocked ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-slate-400'
                  }`}>
                    {sub.isCompleted ? (
                      <span className="material-symbols-outlined text-[20px] filled">check_circle</span>
                    ) : sub.isLocked ? (
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    ) : (
                      <span className="text-[14px] font-black font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`text-[13.5px] font-bold leading-tight mb-1 ${sub.isLocked ? 'text-gray-400' : 'text-slate-800 dark:text-white'}`}>
                      {sub.title}
                    </h4>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sub.duration}</span>
                  </div>

                  {!sub.isLocked && !sub.isCompleted && (
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/20">
                      <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
           </div>
         )}

         {activeTab === 'notes' && (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-[28px] border border-amber-100 dark:border-amber-900/20">
                <p className="text-[13px] text-amber-800 dark:text-amber-200 font-medium italic mb-2">"Đừng bao giờ đầu tư vào thứ mình không hiểu rõ."</p>
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Ghi chú quan trọng</span>
              </div>
              <button className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[28px] flex items-center justify-center gap-2 text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] active:scale-95 transition-all">
                <span className="material-symbols-outlined">add_circle</span>
                Thêm ghi chú bài học
              </button>
           </div>
         )}

         {activeTab === 'resources' && (
           <div className="space-y-4 animate-fade-in">
              {[
                { name: `Syllabus - ${lessonData.title}.pdf`, size: '2.4 MB' },
                { name: 'Tài liệu tham khảo chuyên sâu.zip', size: '15.8 MB' }
              ].map((res, i) => (
                <div key={i} className="bg-white dark:bg-[#16241c] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600">
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800 dark:text-white line-clamp-1">{res.name}</h4>
                      <span className="text-[10px] font-black text-gray-400 uppercase">{res.size}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">download</span>
                </div>
              ))}
           </div>
         )}
      </div>

      {/* 5. FLOATING AI BUTTON */}
      <div className="absolute bottom-8 right-6 z-[100]">
         <button 
           onClick={() => navigate('/chat', { state: { lessonContext: lessonData.title } })}
           className="size-16 rounded-[28px] bg-primary text-white shadow-2xl shadow-primary/40 flex flex-col items-center justify-center gap-1 active:scale-90 transition-all group overflow-hidden"
         >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="material-symbols-outlined text-[30px] filled">smart_toy</span>
            <span className="text-[8px] font-black uppercase tracking-tighter">Hỏi AI</span>
         </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LessonDetail;
