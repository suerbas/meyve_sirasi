# 🍎 Sınıf Meyve Nöbetçisi (Adil Dağıtım Takvimi)

Okul sınıflarında velilerin getirdiği meyve nöbetlerini matematiksel olarak **%100 eşit ve adil** dağıtan, hafta sonlarını ve MEB resmi tatillerini otomatik atlayan, tek tıkla WhatsApp paylaşımı sunan modern web uygulaması.

---

## ✨ Özellikler

* **📐 Matematiksel Adalet:** 21 veli ve 5 meyve ($\text{EBOB}(21, 5) = 1$) sayesinde her 105 okul gününde her veli istisnasız her meyveden tam olarak 1'er kez getirir. Hiçbir veli haksız dağılıma maruz kalmaz.
* **🏫 Sınıf Mevcudu:** 21 öğrenci + 1 öğretmen jest payı = **22 adet** günlük meyve.
* **📱 WhatsApp Paylaşımı:** Sınıf veli grubuna göndermek için tek tıkla emojili ve düzenli haftalık nöbetçi listesi kopyalama.
* **📅 MEB Tatil Entegrasyonu:** 29 Ekim, ara tatiller, yarıyıl (sömestr) tatili, 23 Nisan, 19 Mayıs ve dini bayramlar otomatik atlanır; nöbet ertesi açık okul gününe kayar.
* **🔄 Nöbet Takası (Swap):** Gelemeyen veya mazereti olan velilerin nöbetlerini başka bir veli numarasıyla hızlıca değiştirme imkanı.
* **📊 Canlı Adalet & İstatistik Tablosu:** 21 velinin meyve sayılarını, dağılım dengesini ve bir sonraki nöbet zamanını gösterir.
* **👥 Veli & Numara Rehberi:** Numaralar esastır (`#1` .. `#21`), isteğe bağlı olarak isim ve öğrenci notu eklenebilir.
* **💾 Çevrimdışı ve Güvenli:** Veriler tarayıcınızın yerel hafızasında (`localStorage`) saklanır, sunucuya veri göndermez.
* **📥 Excel / CSV Dışa Aktarma:** Tüm eğitim yılının nöbet takvimini Excel uyumlu CSV olarak indirme.

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173/` adresinde açılır.

### 📦 Canlı Sürüm Derleme (Build)

```bash
npm run build
```

---

## 🚀 Kullanılan Teknolojiler

* **React 19**
* **Vite**
* **TypeScript**
* **Tailwind CSS v4**
* **Lucide Icons**
* **Canvas Confetti**
