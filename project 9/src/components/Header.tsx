import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, LogOut, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import TopBar from './TopBar';
import MainNav from './MainNav';

const formatCurrency = (amount: number): string => {
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Header: React.FC = () => {
  const { cartCount, cartTotal } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBar />

      <div className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-8">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-extrabold tracking-wide text-[#1E73BE]">
                ARISPORT
              </h1>
            </Link>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün veya kategori ara…"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                />
                <button className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-[#1E73BE] transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {isAuthenticated ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#1E73BE] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <Link
                          to="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Müşteri Paneli</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm font-medium">Çıkış Yap</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#1E73BE] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Hesabım</span>
                </Link>
              )}

              <a href="#" className="relative text-gray-700 hover:text-[#1E73BE] transition-colors">
                <Heart className="w-5 h-5" />
              </a>

              <button
                onClick={() => navigate('/cart')}
                className="relative flex items-center gap-2 text-gray-700 hover:text-[#1E73BE] transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF6A3D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-gray-500">Sepetim</p>
                  <p className="text-sm font-semibold">{formatCurrency(cartTotal)}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MainNav />
    </header>
  );
};

export default Header;
