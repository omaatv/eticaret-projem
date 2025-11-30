import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Star, Plus, Minus, Heart, ArrowLeft } from 'lucide-react';
import { fetchProducts, ApiProduct } from '../api/products';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const items = await fetchProducts();
        if (isMounted) {
          setProducts(items);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Ürünler yüklenemedi.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const product = useMemo(
    () => products.find(p => p.slug === slug),
    [products, slug]
  );

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    if (!product) return;

    const numericPrice = Number(product.price) || 0;

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: numericPrice,
        imageUrl: product.image_url || '',
      },
      quantity
    );

    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          Ürün yükleniyor...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-8">
            {error || 'Aradığınız ürün mevcut değil veya kaldırılmış olabilir.'}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#1E73BE] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Tüm Ürünlere Dön
          </button>
        </div>
      </div>
    );
  }

  const productPrice = Number(product.price) || 0;

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/products"
            className="text-[#1E73BE] hover:text-[#1557A0] font-medium inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Ürünler
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-lg p-12">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                'Görsel bulunamadı'
              )}
            </div>
          </div>

          <div>
            {product.badgeLabel && (
              <span className="inline-block bg-[#FF6A3D] text-white text-xs font-bold px-3 py-1 rounded mb-3">
                {product.badgeLabel}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.5) 127 değerlendirme</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1E73BE]">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(productPrice)}
              </span>
            </div>

            <div className="mb-6">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {product.category_id ? `Kategori ${product.category_id}` : 'Kategori'}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              {product.description || 'Bu ürünle ilgili açıklama yakında eklenecek.'}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Beden Seçimi</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 rounded-lg font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-[#1E73BE] bg-[#1E73BE] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#1E73BE]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Adet</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">Stokta 50+ adet mevcut</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 px-8 py-4 rounded-lg font-bold transition-colors ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1E73BE] text-white hover:bg-[#1557A0]'
                }`}
              >
                {isAdding ? 'SEPETE EKLENDİ ✓' : 'SEPETE EKLE'}
              </button>
              <button className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:border-[#FF6A3D] hover:text-[#FF6A3D] transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1E73BE] mb-1">Ücretsiz</p>
                <p className="text-sm text-gray-600">Kargo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1E73BE] mb-1">30 Gün</p>
                <p className="text-sm text-gray-600">İade Garantisi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1E73BE] mb-1">Aynı Gün</p>
                <p className="text-sm text-gray-600">Kargo</p>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Benzer Ürünler</h2>
              <p className="text-gray-600">Bu ürünü alanlar bunları da beğendi</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  imageUrl={product.image_url || undefined}
                  name={product.name}
                  price={Number(product.price) || 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
