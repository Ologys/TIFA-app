
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
     { role: 'model', text: 'Xin chào, tôi là TIFA AI. Tôi có thể hỗ trợ gì cho hành trình tài chính của bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'VN-Index hôm nay', prompt: 'Tóm tắt ngắn gọn diễn biến VN-Index phiên hôm nay.' },
    { label: 'Top cổ phiếu hot', prompt: 'Những mã cổ phiếu nào đang thu hút dòng tiền mạnh nhất hôm nay?' },
    { label: 'Lãi suất tiết kiệm', prompt: 'Cập nhật nhanh tình hình lãi suất tiết kiệm các ngân hàng mới nhất.' },
    { label: 'Phân tích mã FPT', prompt: 'Nhận định ngắn gọn về triển vọng mã FPT trong ngắn hạn.' },
    { label: 'Giá vàng SJC', prompt: 'Cập nhật giá vàng SJC và thế giới mới nhất.' },
    { label: 'Tin tức vĩ mô', prompt: 'Những tin tức kinh tế vĩ mô nào quan trọng nhất trong 24h qua?' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinkingStep]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const steps = ["Đang truy cập Google Search...", "Đang phân tích thị trường...", "Đang chuẩn bị câu trả lời..."];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
        if (stepIdx < steps.length) {
            setThinkingStep(steps[stepIdx]);
            stepIdx++;
        }
    }, 800);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: textToSend }] }],
        config: {
          systemInstruction: "Bạn là chuyên gia tài chính cao cấp TIFA AI. Trả lời cực kỳ ngắn gọn (3-4 câu). Sử dụng dữ liệu thực tế từ Google Search. Văn phong súc tích, chuyên nghiệp.",
          tools: [{ googleSearch: {} }]
        },
      });

      clearInterval(stepInterval);
      setThinkingStep('');

      const aiText = response.text || "Xin lỗi, hệ thống đang bận.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = groundingChunks?.map((chunk: any) => ({
          title: chunk.web?.title || 'Nguồn tin',
          uri: chunk.web?.uri || '#'
      })).filter((s: any) => s.uri !== '#').slice(0, 3);

      setMessages(prev => [...prev, { role: 'model', text: aiText, sources }]);
    } catch (error) {
      clearInterval(stepInterval);
      setThinkingStep('');
      setMessages(prev => [...prev, { role: 'model', text: "Lỗi kết nối. Vui lòng thử lại." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-safe max-w-md mx-auto shadow-2xl flex flex-col h-screen overflow-hidden relative transition-colors duration-300 font-display">
        
        <style>{`
          @keyframes tickerScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-ticker-line {
            display: flex;
            width: max-content;
            animation: tickerScroll 50s linear infinite;
          }
          .animate-ticker-line:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* 1. HEADER - TIFA STYLED WITH BACK BUTTON */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-[#0a1a11]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
             <div onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer group">
                 <span className="material-symbols-outlined text-slate-800 dark:text-white text-2xl group-active:scale-90 transition-transform">chevron_left</span>
                 <div className="flex flex-col">
                    <h1 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">TIFA AI</h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="size-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Trực tuyến</span>
                    </div>
                 </div>
             </div>
             
             <div className="flex items-center gap-4">
                 <span onClick={() => navigate('/home')} className="material-symbols-outlined text-slate-800 dark:text-white cursor-pointer hover:text-primary transition-colors">home</span>
                 <button onClick={() => navigate('/profile')} className="size-8 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                 </button>
             </div>
          </div>
        </div>

        {/* 2. CHAT CONTENT AREA */}
        <div className="flex-1 relative overflow-hidden bg-slate-50 dark:bg-transparent">
             {/* BACKGROUND LOGO WATERMARK */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
                <img 
                  src="https://img.upanhnhanh.com/789485031281faf84eb48d48c0a2b99e" 
                  alt="Watermark" 
                  className="w-[120%] h-auto grayscale blur-[1px] scale-110"
                />
             </div>

             <div ref={scrollRef} className="absolute inset-0 overflow-y-auto p-5 space-y-6 no-scrollbar z-10">
                  {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                          <div className={`max-w-[85%] flex flex-col gap-2`}>
                             <div className={`rounded-[22px] px-4 py-3 text-[13.5px] font-medium leading-relaxed shadow-sm transition-all ${
                                 msg.role === 'user' 
                                 ? 'bg-primary text-white rounded-tr-none shadow-primary/20' 
                                 : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                             }`}>
                                 {msg.text}
                             </div>
                             {msg.sources && msg.sources.length > 0 && (
                                 <div className="flex flex-wrap gap-2 px-1">
                                     {msg.sources.map((s, i) => (
                                         <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-[9px] font-black text-gray-500 hover:text-primary transition-colors shadow-sm">
                                             <span className="material-symbols-outlined text-[12px]">link</span>
                                             {s.title.length > 22 ? s.title.slice(0, 22) + '...' : s.title}
                                         </a>
                                     ))}
                                 </div>
                             )}
                          </div>
                      </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start items-start gap-3 animate-pulse">
                       <div className="space-y-2">
                         <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-[20px] rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                             <div className="flex gap-1.5">
                                 <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                                 <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                 <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                             </div>
                         </div>
                         {thinkingStep && (
                             <p className="text-[10px] font-black text-primary/60 dark:text-emerald-500/60 uppercase tracking-widest italic animate-pulse px-1">
                                 {thinkingStep}
                             </p>
                         )}
                       </div>
                    </div>
                  )}
             </div>
        </div>

        {/* 3. INPUT AREA */}
        <div className="flex-shrink-0 bg-white dark:bg-[#0a1a11] border-t border-gray-100 dark:border-gray-800 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-20">
            <div className="h-10 flex items-center overflow-hidden border-b border-gray-50 dark:border-gray-800">
               <div className="shrink-0 bg-white dark:bg-[#0a1a11] px-4 h-full flex items-center gap-1 z-10">
                  <span className="material-symbols-outlined text-[16px] text-gray-400">bolt</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gợi ý</span>
               </div>
               
               <div className="flex-1 overflow-hidden relative">
                  <div className="animate-ticker-line flex items-center py-2">
                     {[...quickActions, ...quickActions].map((action, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSend(action.prompt)}
                          disabled={isLoading}
                          className="mx-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-[10px] font-bold text-slate-700 dark:text-gray-300 hover:border-primary hover:text-primary bg-white dark:bg-slate-900 shadow-sm whitespace-nowrap active:scale-95 transition-all"
                        >
                           {action.label}?
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-4">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-3"
                >
                     <div className="flex-1 relative group">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Hỏi TIFA AI về cổ phiếu, thị trường..." 
                            className="w-full h-12 rounded-[18px] bg-gray-100/60 dark:bg-slate-800/60 border-transparent px-5 text-[14px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-gray-400" 
                        />
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">mic</span>
                        </button>
                     </div>
                     <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className={`size-12 rounded-[18px] flex items-center justify-center shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                            input.trim() ? 'bg-primary text-white shadow-primary/30' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 shadow-none'
                        }`}
                     >
                        <span className="material-symbols-outlined text-[22px] filled">
                            {isLoading ? 'hourglass_empty' : 'send'}
                        </span>
                     </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Chat;
