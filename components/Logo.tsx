
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    header: 'h-7 md:h-9', 
    sm: 'h-6',
    md: 'h-14',             
    lg: 'h-24',
    xl: 'h-32',        
  };

  // URL chính xác của logo TIFA Tài Chính từ ảnh người dùng cung cấp
  const logoUrl = "https://img.upanhnhanh.com/789485031281faf84eb48d48c0a2b99e";

  return (
    <div className={`inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ${className}`}>
      <img 
        src={logoUrl} 
        alt="TIFA Tài Chính" 
        className={`
          ${sizeClasses[size]} 
          w-auto 
          object-contain 
          pointer-events-none 
          select-none
        `}
      />
    </div>
  );
};

export default Logo;
