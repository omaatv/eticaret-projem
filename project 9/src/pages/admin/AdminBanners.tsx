import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 1,
      title: 'Yeni Sezon Koleksiyonu',
      subtitle: 'En yeni ürünlerimizi keşfedin',
      imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      buttonText: 'Koleksiyonu Keşfet',
      buttonLink: '/products',
      isActive: true,
    },
    {
      id: 2,
      title: 'Özel İndirimler',
      subtitle: '%50\'ye varan indirimler',
      imageUrl: 'https://images.pexels.com/photos/1040944/pexels-photo-1040944.jpeg',
      buttonText: 'İndirimleri Gör',
      buttonLink: '/products',
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState<Omit<Banner, 'id'>>({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
  });

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        isActive: banner.isActive,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBanner) {
      setBanners(prev =>
        prev.map(b => (b.id === editingBanner.id ? { ...b, ...formData } : b))
      );
    } else {
      const newBanner: Banner = {
        id: Date.now(),
        ...formData,
      };
      setBanners(prev => [...prev, newBanner]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bu bannerı silmek istediğinizden emin misiniz?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Bannerlar</h2>

          <button
            onClick={() => handleOpenModal()}
            className="bg-[#1E73BE] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            Yeni Banner Ekle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Başlık</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Alt Başlık</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Link</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Aktif mi?</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{banner.title}</td>
                  <td className="py-4 px-4 text-gray-700">{banner.subtitle}</td>
                  <td className="py-4 px-4 text-gray-700">{banner.buttonLink}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(banner.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        banner.isActive ? 'bg-[#1E73BE]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          banner.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(banner)}
                        className="text-[#1E73BE] hover:text-[#1557A0] transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBanner ? 'Banner Düzenle' : 'Yeni Banner Ekle'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Linki
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E73BE] focus:border-transparent"
                    placeholder="/products"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#1E73BE] border-gray-300 rounded focus:ring-[#1E73BE]"
                />
                <label className="text-sm font-medium text-gray-700">Aktif</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-[#1E73BE] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1557A0] transition-colors"
                >
                  {editingBanner ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
