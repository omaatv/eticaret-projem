import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  address: {
    fullAddress: string;
    city: string;
    district: string;
  };
}

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

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ARIS-2025-1234',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet@example.com',
    createdAt: '2025-11-25',
    totalAmount: 1549.90,
    status: 'completed',
    items: [
      { name: 'Koşu Ayakkabısı Pro X', quantity: 1, price: 1499 },
      { name: 'Kargo', quantity: 1, price: 50.90 },
    ],
    address: {
      fullAddress: 'Atatürk Mah. 123 Sk. No: 45 D: 7',
      city: 'İstanbul',
      district: 'Kadıköy',
    },
  },
  {
    id: 2,
    orderNumber: 'ARIS-2025-5678',
    customerName: 'Ayşe Demir',
    customerEmail: 'ayse@example.com',
    createdAt: '2025-11-28',
    totalAmount: 849.90,
    status: 'shipped',
    items: [
      { name: 'Spor Tişört Pro', quantity: 2, price: 399.95 },
      { name: 'Kargo', quantity: 1, price: 50 },
    ],
    address: {
      fullAddress: 'Cumhuriyet Cad. No: 78 D: 12',
      city: 'Ankara',
      district: 'Çankaya',
    },
  },
  {
    id: 3,
    orderNumber: 'ARIS-2025-9012',
    customerName: 'Mehmet Kaya',
    customerEmail: 'mehmet@example.com',
    createdAt: '2025-11-29',
    totalAmount: 649.90,
    status: 'paid',
    items: [
      { name: 'Training Şort', quantity: 1, price: 599 },
      { name: 'Kargo', quantity: 1, price: 50.90 },
    ],
    address: {
      fullAddress: 'Yeni Mah. 56 Sk. No: 23',
      city: 'İzmir',
      district: 'Konak',
    },
  },
  {
    id: 4,
    orderNumber: 'ARIS-2025-3456',
    customerName: 'Fatma Çelik',
    customerEmail: 'fatma@example.com',
    createdAt: '2025-11-30',
    totalAmount: 1299.90,
    status: 'pending',
    items: [
      { name: 'Koşu Ayakkabısı Elite', quantity: 1, price: 1249 },
      { name: 'Kargo', quantity: 1, price: 50.90 },
    ],
    address: {
      fullAddress: 'Güzelyurt Mah. 89 Sk. No: 12 D: 5',
      city: 'Bursa',
      district: 'Nilüfer',
    },
  },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    order =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Siparişler</h2>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Sipariş veya müşteri ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sipariş No</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Müşteri</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tarih</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tutar</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="py-4 px-4 text-gray-700">{order.customerName}</td>
                  <td className="py-4 px-4 text-gray-700">{order.createdAt}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={e =>
                        handleStatusChange(order.id, e.target.value as Order['status'])
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                    >
                      <option value="pending">Beklemede</option>
                      <option value="paid">Ödendi</option>
                      <option value="shipped">Kargoda</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#1E73BE] hover:text-[#1557A0] font-medium transition-colors"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sipariş Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Sipariş Numarası</p>
                      <p className="font-medium text-gray-900">{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tarih</p>
                      <p className="font-medium text-gray-900">{selectedOrder.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Durum</p>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <p className="text-gray-600">Toplam Tutar</p>
                      <p className="font-bold text-[#1E73BE] text-lg">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">İsim</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">E-posta</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Teslimat Adresi</p>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.address.fullAddress}
                        <br />
                        {selectedOrder.address.district} / {selectedOrder.address.city}
                      </p>
                    </div>
                  </div>
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
  );
};

export default AdminOrders;
