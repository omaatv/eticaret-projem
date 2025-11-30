import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id?: number;
  slug?: string;
  imageUrl?: string | null;
  name: string;
  price: number;
  oldPrice?: number;
  badgeLabel?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  imageUrl,
  name,
  price,
  oldPrice,
  badgeLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  }, [price]);

  const formattedOldPrice = useMemo(() => {
    if (typeof oldPrice !== 'number') return null;
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(oldPrice);
  }, [oldPrice]);

  const handleCardClick = () => {
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!id || !slug) return;

    addToCart({
      id,
      name,
      slug,
      price,
      imageUrl: imageUrl || '',
    }, 1);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {badgeLabel && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#FF6A3D] text-white text-xs font-bold px-3 py-1 rounded">
            {badgeLabel}
          </span>
        </div>
      )}

      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Görsel bulunamadı
          </div>
        )}

        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
            <button
              onClick={handleAddToCart}
              className={`px-6 py-2 rounded text-sm font-semibold transition-colors ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-[#1E73BE] text-white hover:bg-[#1557A0]'
              }`}
            >
              {isAdded ? 'EKLENDİ ✓' : 'SEPETE EKLE'}
            </button>
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-700 px-6 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Hızlı Görünüm
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-10">
          {name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#1E73BE]">{formattedPrice}</span>
          {formattedOldPrice && (
            <span className="text-sm text-gray-400 line-through">{formattedOldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
