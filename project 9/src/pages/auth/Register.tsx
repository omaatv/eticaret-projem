import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/account', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              ARISPORT'a Katılın
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Ücretsiz hesap oluşturun ve ARISPORT'un tüm avantajlarından yararlanın.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1E73BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Hızlı ve güvenli alışveriş
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1E73BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Özel kampanyalara özel erişim
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1E73BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sipariş geçmişi ve takip
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1E73BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Favori ürünlerinizi kaydedin
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="w-6 h-6 text-[#1E73BE]" />
              <h2 className="text-2xl font-bold text-gray-900">Kayıt Ol</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Şifreniz en az 6 karakter olmalıdır.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1E73BE] text-white py-3 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Zaten hesabın var mı?{' '}
                <Link to="/auth/login" className="text-[#1E73BE] font-semibold hover:text-[#1557A0]">
                  Giriş Yap
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-xs text-gray-500">
                Kayıt olarak <Link to="#" className="text-[#1E73BE] hover:underline">Kullanım Koşulları</Link> ve{' '}
                <Link to="#" className="text-[#1E73BE] hover:underline">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
