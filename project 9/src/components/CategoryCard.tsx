import React from 'react';

interface CategoryCardProps {
  icon: string;
  title: string;
  productCount: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, productCount }) => {
  return (
    <a
      href="#"
      className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-[#1E73BE] bg-opacity-10 rounded-full flex items-center justify-center text-3xl group-hover:bg-opacity-20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{productCount}</p>
    </a>
  );
};

export default CategoryCard;
