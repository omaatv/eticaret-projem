import React, { useEffect, useMemo, useState } from 'react';
import { fetchProducts, ApiProduct } from '../api/products';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = [
    { id: null, label: 'Tümü' },
    { id: 1, label: 'Eşofman Takımı' },
    { id: 2, label: 'Ayakkabı' },
    { id: 3, label: 'T-Shirt' },
    { id: 4, label: 'Şort' },
    { id: 5, label: 'Aksesuar' },
  ];

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
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

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) return products;
    return products.filter(product => product.category_id === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tüm Ürünler</h1>
          <p className="text-gray-600">Spor giyim koleksiyonumuzu keşfedin.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[#1E73BE]" />
                <h2 className="text-lg font-bold text-gray-900">Filtrele</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Kategoriler</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.label}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        (category.id === null && selectedCategory === null) || selectedCategory === category.id
                          ? 'bg-[#1E73BE] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Fiyat Aralığı</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>₺0 - ₺500</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>₺500 - ₺1000</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>₺1000 - ₺2000</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>₺2000+</span>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Özellikler</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>İndirimli Ürünler</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>Yeni Gelenler</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#1E73BE]" />
                    <span>Çok Satanlar</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> ürün bulundu
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent">
                <option>Önerilen</option>
                <option>Fiyat: Düşükten Yükseğe</option>
                <option>Fiyat: Yüksekten Düşüğe</option>
                <option>Yeni Gelenler</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center text-gray-600 py-12">Ürünler yükleniyor...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-12">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
