# E-Ticaret Projem

Bu proje; React (Vite) + PHP backend ile geliştirilmiş, yönetilebilir ve genişletilebilir bir e-ticaret alt yapısıdır.

## 🚀 Teknoloji Stack'i
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** PHP (Klasör içinde API endpoint’leri)
- **Database:** MySQL (isteğe bağlı)
- **Build:** Vite
- **Deployment:** Shared Hosting (public_html)

## 📁 Proje Klasör Yapısı
project 9/
├── src/ → React kaynak dosyaları
├── public/ → Statik dosyalar
├── php/ → API / Backend PHP dosyaları (varsa)
├── index.html → Ana HTML dosyası
├── package.json → Bağımlılıklar
├── vite.config.js → Vite yapılandırması

markdown
Kodu kopyala

## 🛒 Özellikler
- Ürün listeleme
- Ürün detay sayfası
- Sepet sistemi (Frontend tabanlı)
- Admin panel eklenebilir yapı
- SEO uyumlu dizayn
- Mobil uyumlu arayüz

## 🔧 Kurulum
npm install
npm run dev

shell
Kodu kopyala

## 🧱 Build Alma
npm run build

powershell
Kodu kopyala

## 📦 Hosting için özel notlar
Build sonrası oluşan `dist/` klasörü sunucudaki `public_html/` içine taşınmalıdır.  
PHP API dosyaları aynı dizinde çalışmalıdır.

## 🤖 AI Analizi İçin
Bu repo, Gemini veya diğer LLM modellerinin proje yapısını kolayca inceleyebilmesi için düzenlenmiştir.
