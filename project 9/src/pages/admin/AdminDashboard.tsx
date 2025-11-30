import React from 'react';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';

const formatCurrency = (amount: number): string => {
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Beklemede', className: 'bg-gray-100 text-gray-800' },
    paid: { label: 'Ödendi', className: 'bg-green-100 text-green-800' },
    shipped: { label: 'Kargoda', className: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Tamamlandı', className: 'bg-emerald-100 text-emerald-800' },
    cancelled: { label: 'İptal Edildi', className: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};

const recentOrders = [
  {
    id: 1,
    orderNumber: 'ARIS-2025-1234',
    customer: 'Ahmet Yılmaz',
    totalAmount: 1549.90,
    status: 'completed',
    createdAt: '2025-11-25',
  },
  {
    id: 2,
    orderNumber: 'ARIS-2025-5678',
    customer: 'Ayşe Demir',
    totalAmount: 849.90,
    status: 'shipped',
    createdAt: '2025-11-28',
  },
  {
    id: 3,
    orderNumber: 'ARIS-2025-9012',
    customer: 'Mehmet Kaya',
    totalAmount: 649.90,
    status: 'paid',
    createdAt: '2025-11-29',
  },
  {
    id: 4,
    orderNumber: 'ARIS-2025-3456',
    customer: 'Fatma Çelik',
    totalAmount: 1299.90,
    status: 'pending',
    createdAt: '2025-11-30',
  },
  {
    id: 5,
    orderNumber: 'ARIS-2025-7890',
    customer: 'Ali Şahin',
    totalAmount: 459.90,
    status: 'shipped',
    createdAt: '2025-11-30',
  },
];

const AdminDashboard: React.FC = () => {
  const kpiCards = [
    {
      title: 'Toplam Ciro',
      value: formatCurrency(245680.50),
      icon: TrendingUp,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Toplam Sipariş',
      value: '1,247',
      icon: ShoppingCart,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Toplam Müşteri',
      value: '856',
      icon: Users,
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Aktif Ürün Sayısı',
      value: '124',
      icon: Package,
      bgColor: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Son Siparişler</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Sipariş No</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Müşteri</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Tutar</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Durum</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="py-4 px-6 text-gray-700">{order.customer}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-6 text-gray-700">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
