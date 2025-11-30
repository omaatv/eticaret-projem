import React from 'react';

const TopBar: React.FC = () => {
  return (
    <div className="bg-[#1E73BE] text-white text-xs py-2">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex-1">
          <p>Yeni sezon spor giyim ürünlerinde %70'e varan indirim</p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-200 transition-colors">Yardım</a>
          <a href="#" className="hover:text-gray-200 transition-colors">Sipariş Takibi</a>
          <a href="#" className="hover:text-gray-200 transition-colors">Mağazalar</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
