
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    title: <>Học tài chính <br /><span className="text-primary">dễ hiểu</span></>,
    desc: "Kiến thức tài chính phức tạp được đơn giản hóa với sự hỗ trợ của AI.",
    img: "https://images.unsplash.com/photo-1591696208183-a2326a3a2a9a?q=80&w=500&auto=format&fit=crop",
    skipPos: 'top'
  },
  {
    title: "AI Trợ Giảng",
    desc: "Giải đáp mọi thắc mắc tài chính của bạn ngay lập tức với trợ lý ảo thông minh.",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=500&auto=format&fit=crop",
    skipPos: 'bottom'
  },
  {
    title: "Tin tức & Mô phỏng",
    desc: "Cập nhật tin tức thị trường mới nhất và tham gia các tình huống mô phỏng thực tế.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop",
    skipPos: 'bottom'
  }
];

const Onboarding: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/login');
    }
  };

  const currentStep = steps[current];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display justify-between max-w-md mx-auto shadow-2xl overflow-hidden relative transition-all duration-500">
      
      <div className="flex w-full items-center justify-between px-6 pt-8 pb-2 z-20 min-h-[60px]">
        {currentStep.skipPos === 'top' ? (
             <>
                <div className="w-12"></div>
                <button onClick={() => navigate('/login')} className="text-primary text-base font-bold">Bỏ qua</button>
             </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 -mt-10">
        <div className="relative mb-8 w-full aspect-square flex items-center justify-center">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/10 rounded-full blur-3xl"></div>
           <div 
              className="w-full h-full bg-center bg-cover rounded-[40px] z-10 transform transition-transform duration-500 shadow-2xl" 
              style={{ backgroundImage: `url("${currentStep.img}")` }}
           ></div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center animate-fade-in-up">
          <h1 className="text-text-main dark:text-white text-[32px] font-extrabold leading-[1.2] tracking-tight">
             {currentStep.title}
          </h1>
          <p className="text-text-main/70 dark:text-gray-400 text-base font-medium leading-relaxed max-w-[300px]">
            {currentStep.desc}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-6 px-6 pb-10 pt-4 z-20">
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-primary' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}></div>
          ))}
        </div>

        <div className="w-full space-y-3">
            <button onClick={handleNext} className="relative w-full rounded-xl bg-primary py-4 text-white text-lg font-bold shadow-lg shadow-primary/30 active:scale-[0.98]">Tiếp tục</button>
            {currentStep.skipPos === 'bottom' && <button onClick={() => navigate('/login')} className="w-full py-3 text-primary text-base font-bold">Bỏ qua</button>}
            {currentStep.skipPos === 'top' && <div className="h-[48px]"></div>}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
