import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Legal: React.FC = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen h-screen flex flex-col font-display antialiased overflow-hidden text-text-main dark:text-white transition-colors duration-300 max-w-md mx-auto shadow-2xl">
      {/* Top App Bar */}
      <div className="flex items-center justify-center p-4 pt-6 md:pt-4 shrink-0 bg-background-light dark:bg-background-dark z-20 relative">
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center">Chấp thuận Pháp lý</h2>
      </div>

      {/* Body Description */}
      <div className="px-5 shrink-0">
        <p className="text-text-main/70 dark:text-white/70 text-sm font-medium leading-normal text-center pb-4">
            Vui lòng xem qua các điều khoản bên dưới để tiếp tục sử dụng TIFA.
        </p>
      </div>

      {/* Terms & Conditions Card (Scrollable) */}
      <div className="flex-1 px-4 pb-2 min-h-0 w-full max-w-lg mx-auto">
        <div className="h-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative group/card">
          {/* Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 text-sm text-text-main/90 dark:text-white/90">
            <div className="flex flex-col gap-1">
              <h3 className="text-primary font-bold text-base">1. Giới thiệu</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Chào mừng bạn đến với TIFA. Bằng việc tải xuống, cài đặt hoặc sử dụng ứng dụng, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản sử dụng này. Đây là thỏa thuận pháp lý giữa bạn và TIFA Education., JSC.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-primary font-bold text-base">2. Quyền riêng tư & Dữ liệu</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn theo tiêu chuẩn bảo mật cao nhất. Chúng tôi chỉ thu thập những thông tin cần thiết để tối ưu hóa lộ trình học tập tài chính của bạn. Dữ liệu của bạn được mã hóa và không bao giờ được chia sẻ với bên thứ ba vì mục đích thương mại mà không có sự đồng thuận.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-primary font-bold text-base">3. Trách nhiệm người dùng</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Người dùng chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu. Bạn cam kết không sử dụng nền tảng để phát tán nội dung độc hại, gian lận trong các bài kiểm tra mô phỏng, hoặc xâm phạm quyền sở hữu trí tuệ của TIFA.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-primary font-bold text-base">4. Tuyên bố miễn trừ trách nhiệm</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  TIFA là ứng dụng giáo dục tài chính và mô phỏng thị trường. Mọi nội dung, bài học và dữ liệu mô phỏng chỉ mang tính chất tham khảo. <strong>Đây không phải là lời khuyên tài chính.</strong> Chúng tôi không chịu trách nhiệm cho bất kỳ quyết định đầu tư thực tế nào của người dùng dựa trên thông tin từ ứng dụng.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-primary font-bold text-base">5. Cập nhật điều khoản</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Chúng tôi có quyền thay đổi các điều khoản này tại bất kỳ thời điểm nào. Mọi thay đổi sẽ được thông báo trực tiếp trên ứng dụng.
              </p>
            </div>
            <div className="h-8"></div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-light dark:from-surface-dark to-transparent pointer-events-none opacity-80"></div>
        </div>
      </div>

      {/* Footer Action Area */}
      <div className="shrink-0 bg-background-light dark:bg-background-dark p-4 pb-8 w-full max-w-lg mx-auto">
        <div className="mb-4">
          <label className="flex gap-x-3 items-start cursor-pointer group select-none">
            <input 
                type="checkbox" 
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 dark:border-gray-600 border-2 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer" 
            />
            <p className="text-text-main dark:text-white text-sm font-medium leading-normal group-hover:text-primary transition-colors">
                Tôi đã đọc và đồng ý với các <span className="font-bold underline decoration-primary/50 underline-offset-2">Điều khoản sử dụng</span> và <span className="font-bold underline decoration-primary/50 underline-offset-2">Chính sách bảo mật</span>.
            </p>
          </label>
        </div>

        <button 
            onClick={() => navigate('/login')}
            disabled={!accepted}
            className={`flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-5 text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg ${
                accepted 
                ? 'bg-primary text-white shadow-primary/30 active:scale-[0.98] cursor-pointer' 
                : 'bg-primary/30 text-white/50 cursor-not-allowed shadow-none'
            }`}
        >
          <span className="truncate">Vào ứng dụng</span>
        </button>
      </div>
    </div>
  );
};

export default Legal;