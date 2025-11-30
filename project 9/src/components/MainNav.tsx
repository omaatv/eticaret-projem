import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Grid } from 'lucide-react';

const MainNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Tüm Ürünler', href: '/products' },
    { label: 'Yeni Gelenler', href: '#' },
    { label: 'Çok Satanlar', href: '#' },
    { label: 'İndirimdekiler', href: '#' },
    { label: 'Erkek', href: '#' },
    { label: 'Kadın', href: '#' },
    { label: 'İletişim', href: '#' },
  ];

  return (
    <nav className="bg-white border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E73BE] text-white rounded hover:bg-[#1557A0] transition-colors">
            <Grid className="w-4 h-4" />
            <span className="text-sm font-medium">Tüm Kategoriler</span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors relative py-4 ${
                    isActive
                      ? 'text-[#1E73BE] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E73BE]'
                      : 'text-gray-700 hover:text-[#1E73BE]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`block py-3 text-sm font-medium ${
                    isActive ? 'text-[#1E73BE]' : 'text-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
