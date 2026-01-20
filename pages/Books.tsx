
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  cover: string;
  summary: string;
  isHot?: boolean;
}

const BOOKS_DATA: Book[] = [
  {
    id: 'b1',
    title: 'Cha Giàu Cha Nghèo',
    author: 'Robert Kiyosaki',
    category: 'Tư duy',
    rating: 5,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
    summary: 'Cuốn sách thay đổi tư duy về tiền bạc và sự khác biệt giữa tài sản và tiêu sản.',
    isHot: true
  },
  {
    id: 'b2',
    title: 'Tâm Lý Học Về Tiền',
    author: 'Morgan Housel',
    category: 'Tư duy',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop',
    summary: 'Khám phá cách những thành kiến và cảm xúc định hình quyết định tài chính của chúng ta.',
    isHot: true
  },
  {
    id: 'b3',
    title: 'Người Giàu Nhất Thành Babylon',
    author: 'George S. Clason',
    category: 'Kinh điển',
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
    summary: 'Những bí quyết làm giàu từ thời cổ đại vẫn còn nguyên giá trị cho đến ngày nay.',
  },
  {
    id: 'b4',
    title: 'Nhà Đầu Tư Thông Minh',
    author: 'Benjamin Graham',
    category: 'Đầu tư',
    rating: 5,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop',
    summary: 'Kinh thánh của việc đầu tư giá trị, giúp bạn bảo vệ vốn và tìm kiếm lợi nhuận bền vững.',
  },
  {
    id: 'b5',
    title: 'Chiến Thắng Trò Chơi Đồng Tiền',
    author: 'Tony Robbins',
    category: 'Kỹ năng',
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=400&auto=format&fit=crop',
    summary: 'Lộ trình 7 bước để đạt được tự do tài chính từ bậc thầy huấn luyện hàng đầu thế giới.',
  }
];

const Books: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const categories = ['Tất cả', 'Tư duy', 'Đầu tư', 'Kinh điển', 'Kỹ năng'];
  const filteredBooks = activeFilter === 'Tất cả' 
    ? BOOKS_DATA 
    : BOOKS_DATA.filter(b => b.category === activeFilter);

  return (
    <div className="bg-[#f8fafc] dark:bg-background-dark min-h-screen pb-32 max-w-md mx-auto shadow-2xl relative transition-colors duration-300 font-display overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* HEADER SECTION */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop" 
          className="w-full h-full object-cover brightness-[0.7] scale-110" 
          alt="books-header-bg" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] dark:from-background-dark via-transparent to-black/30"></div>

        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-24 mt-2">
          <button onClick={() => navigate(-1)} className="text-white size-11 bg-black/30 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center">
             <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <Logo size="md" />
          <button className="text-white size-11 bg-black/30 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center">
             <span className="material-symbols-outlined">bookmark</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-6 z-20">
            <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Thư viện TIFA</p>
            <h2 className="text-white text-[32px] font-black tracking-tighter leading-none">Sách Tài Chính</h2>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-[60] bg-[#f8fafc]/95 dark:bg-background-dark/95 backdrop-blur-xl py-4 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-5">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveFilter(cat)}
               className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border
                 ${activeFilter === cat 
                   ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                   : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-gray-400 border-gray-100 dark:border-gray-800'
                 }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* BOOKS LIST */}
      <div className="px-5 pt-6 space-y-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="flex gap-5 group cursor-pointer animate-fade-in">
             <div className="relative w-32 h-44 shrink-0 rounded-2xl overflow-hidden shadow-xl shadow-black/10 group-hover:scale-105 transition-transform duration-500">
                <img src={book.cover} className="w-full h-full object-cover" alt={book.title} />
                {book.isHot && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Hot</div>
                )}
             </div>
             
             <div className="flex flex-col justify-between py-1">
                <div>
                   <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-[14px] filled ${i < Math.floor(book.rating) ? 'text-amber-400' : 'text-gray-200'}`}>star</span>
                      ))}
                      <span className="text-[10px] font-black text-slate-400 ml-1">{book.rating}</span>
                   </div>
                   <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{book.title}</h3>
                   <p className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Tác giả: {book.author}</p>
                   <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed italic">{book.summary}</p>
                </div>
                
                <button className="w-fit px-6 py-2.5 bg-primary/10 text-primary dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 hover:bg-primary hover:text-white transition-all">
                  Đọc ngay
                </button>
             </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
           <div className="py-20 flex flex-col items-center justify-center opacity-30">
              <span className="material-symbols-outlined text-6xl mb-4">menu_book</span>
              <p className="text-sm font-bold uppercase tracking-widest">Đang cập nhật thêm sách...</p>
           </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Books;
