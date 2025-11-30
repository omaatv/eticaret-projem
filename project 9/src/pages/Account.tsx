import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, ChevronRight, X, CheckCircle } from 'lucide-react';

type TabType = 'profile' | 'orders' | 'addresses';

interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Address {
  id: number;
  title: string;
  fullAddress: string;
  city: string;
  district: string;
  postalCode: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ARIS-2025-1234',
    createdAt: '2025-11-25',
    totalAmount: 1549.90,
    status: 'completed',
    items: [
      { name: 'Koşu Ayakkabısı Pro X', quantity: 1, price: 1499 },
      { name: 'Kargo', quantity: 1, price: 50.90 },
    ],
  },
  {
    id: 2,
    orderNumber: 'ARIS-2025-5678',
    createdAt: '2025-11-28',
    totalAmount: 849.90,
    status: 'shipped',
    items: [
      { name: 'Spor Tişört Pro', quantity: 2, price: 399.95 },
      { name: 'Kargo', quantity: 1, price: 50 },
    ],
  },
  {
    id: 3,
    orderNumber: 'ARIS-2025-9012',
    createdAt: '2025-11-29',
    totalAmount: 649.90,
    status: 'paid',
    items: [
      { name: 'Training Şort', quantity: 1, price: 599 },
      { name: 'Kargo', quantity: 1, price: 50.90 },
    ],
  },
];

const formatCurrency = (amount: number): string => {
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getStatusBadge = (status: Order['status']) => {
  const statusConfig = {
    pending: { label: 'Beklemede', className: 'bg-gray-100 text-gray-800' },
    paid: { label: 'Ödendi', className: 'bg-green-100 text-green-800' },
    shipped: { label: 'Kargoda', className: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Tamamlandı', className: 'bg-emerald-100 text-emerald-800' },
    cancelled: { label: 'İptal Edildi', className: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};

const Account: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: 'Ev',
      fullAddress: 'Atatürk Mahallesi, 123. Sokak No: 45 Daire: 7',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    title: '',
    fullAddress: '',
    city: '',
    district: '',
    postalCode: '',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateSuccess(true);
    setTimeout(() => setProfileUpdateSuccess(false), 3000);
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      setAddresses(prev =>
        prev.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...addressForm }
            : addr
        )
      );
    } else {
      const newAddress: Address = {
        id: Date.now(),
        ...addressForm,
      };
      setAddresses(prev => [...prev, newAddress]);
    }

    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm({
      title: '',
      fullAddress: '',
      city: '',
      district: '',
      postalCode: '',
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      title: address.title,
      fullAddress: address.fullAddress,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: number) => {
    if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profilim', icon: User },
    { id: 'orders', label: 'Siparişlerim', icon: Package },
    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
  ] as const;

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#1E73BE]">Anasayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Müşteri Paneli</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Müşteri Paneli</h1>
          <p className="text-gray-600">Siparişlerinizi ve hesap bilgilerinizi yönetin.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-b-2 border-[#1E73BE] text-[#1E73BE]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>

                {profileUpdateSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Bilgileriniz başarıyla güncellendi.</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                          placeholder="0500 000 00 00"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-[#1E73BE] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors"
                      >
                        Bilgilerimi Güncelle
                      </button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Güncelleme</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Eski Şifre
                        </label>
                        <input
                          type="password"
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yeni Şifre
                        </label>
                        <input
                          type="password"
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yeni Şifre (Tekrar)
                        </label>
                        <input
                          type="password"
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-6 py-2 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Şifreyi Güncelle
                      </button>

                      <p className="text-xs text-gray-500">
                        Bu özellik backend bağlandığında aktif olacak.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Siparişlerim</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Sipariş No</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Tarih</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Tutar</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Detay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map(order => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                          <td className="py-4 px-4 text-gray-700">{order.createdAt}</td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-[#1E73BE] hover:text-[#1557A0] font-medium transition-colors"
                            >
                              Görüntüle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedOrder && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6 border-b flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Sipariş Detayı</h3>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Sipariş Numarası</p>
                            <p className="font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tarih</p>
                            <p className="font-semibold text-gray-900">{selectedOrder.createdAt}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Durum</p>
                            <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Toplam Tutar</p>
                            <p className="font-bold text-[#1E73BE] text-lg">
                              {formatCurrency(selectedOrder.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Sipariş İçeriği</h4>
                          <div className="space-y-3">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="flex justify-between py-2 border-b">
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Adreslerim</h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                      setAddressForm({
                        title: '',
                        fullAddress: '',
                        city: '',
                        district: '',
                        postalCode: '',
                      });
                    }}
                    className="bg-[#1E73BE] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors"
                  >
                    Yeni Adres Ekle
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres'}
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adres Başlığı
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={addressForm.title}
                          onChange={handleAddressFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                          placeholder="Ev, İş, vb."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adres
                        </label>
                        <textarea
                          name="fullAddress"
                          value={addressForm.fullAddress}
                          onChange={handleAddressFormChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                          placeholder="Mahalle, Sokak, No, Daire"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">İl</label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                            placeholder="İstanbul"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
                          <input
                            type="text"
                            name="district"
                            value={addressForm.district}
                            onChange={handleAddressFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                            placeholder="Kadıköy"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Posta Kodu
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={addressForm.postalCode}
                            onChange={handleAddressFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                            placeholder="34710"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-[#1E73BE] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors"
                        >
                          Kaydet
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                          }}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {addresses.map(address => (
                    <div key={address.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{address.title}</h3>
                        <MapPin className="w-5 h-5 text-[#1E73BE]" />
                      </div>
                      <p className="text-gray-700 mb-2">{address.fullAddress}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {address.district} / {address.city} - {address.postalCode}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-[#1E73BE] hover:text-[#1557A0] font-medium transition-colors text-sm"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-500 hover:text-red-600 font-medium transition-colors text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
