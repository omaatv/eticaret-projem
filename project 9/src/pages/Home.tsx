import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, Headphones, ShieldCheck, Calendar } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { fetchProducts, ApiProduct } from '../api/products';

const categories = [
  { id: 1, icon: '👟', title: 'Ayakkabı', productCount: '142 ürün' },
  { id: 2, icon: '🎽', title: 'Eşofman Takımı', productCount: '87 ürün' },
  { id: 3, icon: '👕', title: 'T-Shirt & Tişört', productCount: '215 ürün' },
  { id: 4, icon: '🩳', title: 'Şort', productCount: '93 ürün' },
  { id: 5, icon: '🧢', title: 'Aksesuar', productCount: '164 ürün' },
  { id: 6, icon: '🎒', title: 'Çanta', productCount: '58 ürün' },
];

const blogPosts = [
  {
    id: 1,
    date: '26 Ağu',
    title: '2024 Yaz Sezonunun En Trend Spor Giyim Modelleri',
    excerpt: 'Bu yaz spor giyimde hangi modeller öne çıkıyor? İşte 2024 yazının en popüler trendleri...',
  },
  {
    id: 2,
    date: '22 Ağu',
    title: 'Koşu Ayakkabısı Seçerken Dikkat Edilmesi Gerekenler',
    excerpt: 'Doğru koşu ayakkabısı seçimi, performansınızı ve konforunuzu doğrudan etkiler. İşte ipuçları...',
  },
  {
    id: 3,
    date: '18 Ağu',
    title: 'Fitness Antrenmanları İçin İdeal Kıyafet Rehberi',
    excerpt: 'Hangi antrenman türü için hangi kıyafetleri tercih etmelisiniz? Uzmanlar yanıtlıyor...',
  },
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
          setError(err?.message || 'Ürünler yüklenirken bir hata oluştu.');
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

  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(0, 8);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-[#FF6A3D] text-white text-xs font-bold px-4 py-2 rounded-full mb-4">
                YAZ İNDİRİMİ
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                Summer Sale<br />
                <span className="text-[#1E73BE]">%70'e Varan Fırsatlar</span>
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Yaz sezonunun en kaliteli spor giyim ürünlerinde inanılmaz indirimler. Tüm koleksiyonda büyük fırsatlar sizi bekliyor.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-[#1E73BE] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors flex items-center gap-2">
                  Alışverişe Başla
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products" className="border-2 border-[#1E73BE] text-[#1E73BE] px-8 py-3 rounded-lg font-semibold hover:bg-[#1E73BE] hover:text-white transition-colors">
                  Tüm Kampanyalar
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1E73BE] to-[#1557A0] rounded-2xl p-12 h-96 flex items-center justify-center text-white text-center shadow-xl">
              <div>
                <p className="text-6xl mb-4">🏃‍♂️</p>
                <p className="text-2xl font-bold">Spor Koleksiyonu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-[#1E73BE] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#1E73BE]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ücretsiz Kargo</h3>
                <p className="text-sm text-gray-600">₺500 üzeri alışverişlerde</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-[#1E73BE] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-[#1E73BE]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">30 Gün İade</h3>
                <p className="text-sm text-gray-600">Garantisi</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-[#1E73BE] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-[#1E73BE]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">7/24 Destek</h3>
                <p className="text-sm text-gray-600">Müşteri Hizmetleri</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-[#1E73BE] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#1E73BE]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Güvenli Ödeme</h3>
                <p className="text-sm text-gray-600">PayTR & Kartlar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-105 transition-transform duration-300" />
              <div className="relative h-full p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-2">Eşofman Takımları</h3>
                <p className="text-sm mb-4 opacity-90">%30 İndirim</p>
                <button className="text-sm font-semibold flex items-center gap-2">
                  Alışverişe Git
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 group-hover:scale-105 transition-transform duration-300" />
              <div className="relative h-full p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-2">Koşu Ayakkabıları</h3>
                <p className="text-sm mb-4 opacity-90">Büyük Fırsat</p>
                <button className="text-sm font-semibold flex items-center gap-2">
                  Alışverişe Git
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-105 transition-transform duration-300" />
              <div className="relative h-full p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-2">Forma Koleksiyonu</h3>
                <p className="text-sm mb-4 opacity-90">Yeni Sezon</p>
                <button className="text-sm font-semibold flex items-center gap-2">
                  Alışverişe Git
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Öne Çıkan Ürünler" subtitle="Sizin için seçtiklerimiz" />
          {isLoading ? (
            <div className="text-center text-gray-600 py-8">Ürünler yükleniyor...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Yeni Gelenler" subtitle="Son eklenenler" />
          {isLoading ? (
            <div className="text-center text-gray-600 py-8">Ürünler yükleniyor...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
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
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Kategorilerimizi Keşfedin" subtitle="Popüler kategoriler" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E73BE] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Müşteri Desteği</h3>
              <p className="text-sm text-gray-600">
                7/24 profesyonel müşteri hizmetleri ekibimiz size yardımcı olmak için hazır.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E73BE] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Kolay İade</h3>
              <p className="text-sm text-gray-600">
                30 gün içinde ücretsiz iade ve değişim hakkından yararlanabilirsiniz.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E73BE] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Güvenli Alışveriş</h3>
              <p className="text-sm text-gray-600">
                Tüm ödemeleriniz SSL sertifikası ile güvence altındadır.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E73BE] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p className="text-sm text-gray-600">
                Siparişleriniz aynı gün kargoya teslim edilir ve 1-3 gün içinde adresinizde.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Son Yazılar" subtitle="Blog & Haberler" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                  Blog Görseli
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#1E73BE] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <a href="#" className="text-[#1E73BE] font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    Devamını Oku
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
            <span className="text-2xl font-bold text-gray-600">ARISPORT PRO</span>
            <span className="text-2xl font-bold text-gray-600">RUNMAX</span>
            <span className="text-2xl font-bold text-gray-600">FLEXWEAR</span>
            <span className="text-2xl font-bold text-gray-600">SPORTLINE</span>
            <span className="text-2xl font-bold text-gray-600">ACTIVEFIT</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
