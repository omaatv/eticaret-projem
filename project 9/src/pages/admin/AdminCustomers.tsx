import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrders: Array<{
    orderNumber: string;
    date: string;
    amount: number;
  }>;
}

const formatCurrency = (amount: number): string => {
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    totalOrders: 12,
    totalSpent: 8450.30,
    lastOrders: [
      { orderNumber: 'ARIS-2025-1234', date: '2025-11-25', amount: 1549.90 },
      { orderNumber: 'ARIS-2025-0987', date: '2025-11-10', amount: 849.90 },
      { orderNumber: 'ARIS-2025-0543', date: '2025-10-28', amount: 1299.00 },
    ],
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    totalOrders: 8,
    totalSpent: 5230.50,
    lastOrders: [
      { orderNumber: 'ARIS-2025-5678', date: '2025-11-28', amount: 849.90 },
      { orderNumber: 'ARIS-2025-4321', date: '2025-11-15', amount: 649.90 },
      { orderNumber: 'ARIS-2025-3210', date: '2025-10-30', amount: 1149.90 },
    ],
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    totalOrders: 15,
    totalSpent: 12340.80,
    lastOrders: [
      { orderNumber: 'ARIS-2025-9012', date: '2025-11-29', amount: 649.90 },
      { orderNumber: 'ARIS-2025-8765', date: '2025-11-20', amount: 1849.00 },
      { orderNumber: 'ARIS-2025-7654', date: '2025-11-12', amount: 999.90 },
    ],
  },
  {
    id: 4,
    name: 'Fatma Çelik',
    email: 'fatma@example.com',
    totalOrders: 6,
    totalSpent: 4120.00,
    lastOrders: [
      { orderNumber: 'ARIS-2025-3456', date: '2025-11-30', amount: 1299.90 },
      { orderNumber: 'ARIS-2025-2345', date: '2025-11-18', amount: 749.00 },
      { orderNumber: 'ARIS-2025-1098', date: '2025-11-05', amount: 899.90 },
    ],
  },
  {
    id: 5,
    name: 'Ali Şahin',
    email: 'ali@example.com',
    totalOrders: 10,
    totalSpent: 7890.40,
    lastOrders: [
      { orderNumber: 'ARIS-2025-7890', date: '2025-11-30', amount: 459.90 },
      { orderNumber: 'ARIS-2025-6789', date: '2025-11-22', amount: 1549.90 },
      { orderNumber: 'ARIS-2025-5432', date: '2025-11-14', amount: 649.00 },
    ],
  },
];

const AdminCustomers: React.FC = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Müşteriler</h2>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Müşteri ara..."
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Müşteri</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">E-posta</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Toplam Sipariş</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Harcama Toplamı</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="py-4 px-4 text-gray-700">{customer.email}</td>
                  <td className="py-4 px-4 text-gray-700">{customer.totalOrders}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
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
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Müşteri Detayı</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Genel Bilgiler</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">İsim</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-posta</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Toplam Sipariş</p>
                    <p className="font-medium text-gray-900">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Toplam Harcama</p>
                    <p className="font-bold text-[#1E73BE] text-lg">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Son Siparişler</h4>
                <div className="space-y-3">
                  {selectedCustomer.lastOrders.map((order, index) => (
                    <div key={index} className="flex justify-between py-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(order.amount)}
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

export default AdminCustomers;
