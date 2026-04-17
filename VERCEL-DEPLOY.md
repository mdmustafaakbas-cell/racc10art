# 🚀 Vercel ile Deploy - racc10art

## Yöntem 1: Vercel Dashboard (Sürükle-Bırak) ⚡ EN KOLAY

### ✅ ADIM 1: Vercel'e Kaydolun

1. **https://vercel.com/signup** adresine gidin
2. Kayıt seçenekleri:
   - ⭐ **GitHub ile** (ÖNERİLEN - en kolay)
   - GitLab ile
   - Bitbucket ile
   - E-posta ile

**GitHub ile kayıt önerilir çünkü:**
- Tek tıkla giriş
- Otomatik repository bağlantısı
- Her git push otomatik deploy

### ✅ ADIM 2: Projeyi Yükleyin

**Seçenek A - Klasör Yükleme (En Hızlı):**

1. Vercel dashboard'a giriş yapın
2. "Add New..." > "Project" tıklayın
3. "Browse" veya sürükle-bırak alanını kullanın
4. **Tüm `racc10art` klasörünü** seçin veya sürükleyin
5. Vercel otomatik algılar:
   - ✅ Framework: Next.js
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `.next`
6. "Deploy" butonuna tıklayın

**⏱️ Süre:** 2-3 dakika

**Seçenek B - ZIP Yükleme:**

1. `racc10art` klasörünü ZIP'leyin
2. Vercel'de "Import Project"
3. ZIP dosyasını yükleyin

### ✅ ADIM 3: Deploy Tamamlandı!

Deploy bittiğinde:
- ✅ Otomatik URL: `racc10art-xxx.vercel.app`
- ✅ Otomatik HTTPS (SSL)
- ✅ Global CDN
- ✅ Otomatik optimizasyon

---

## Yöntem 2: GitHub + Vercel (Otomatik Deploy) 🔄 ÖNERİLEN

Bu yöntem her kod değişikliğinde otomatik deploy yapar.

### ADIM 1: GitHub'a Yükleyin

PowerShell'de şu komutları çalıştırın:

```powershell
cd racc10art
git init
git add .
git commit -m "racc10art e-commerce site"
```

### ADIM 2: GitHub Repository Oluşturun

1. **https://github.com/new** adresine gidin
2. Repository name: `racc10art`
3. Public veya Private seçin
4. "Create repository" tıklayın

### ADIM 3: Kodu GitHub'a Gönderin

GitHub'ın verdiği komutları çalıştırın:

```powershell
git remote add origin https://github.com/KULLANICI_ADINIZ/racc10art.git
git branch -M main
git push -u origin main
```

### ADIM 4: Vercel'e Bağlayın

1. Vercel dashboard'da "Add New..." > "Project"
2. "Import Git Repository" seçin
3. GitHub'dan `racc10art` repository'sini seçin
4. Ayarlar otomatik gelir (değiştirmeyin)
5. "Deploy" tıklayın

✅ **Artık her `git push` otomatik deploy olur!**

---

## 🎯 Deploy Sonrası

### URL'iniz
- Otomatik: `racc10art-xxx.vercel.app`
- Özel isim: Project Settings > Domains > Edit
- Örnek: `racc10art.vercel.app`

### Admin Paneli
- **URL:** `https://racc10art-xxx.vercel.app/admin`
- **Şifre:** `racc10art2024`
- ⚠️ **İLK İŞ:** Şifreyi değiştirin!

### Demo Veriler
- 6 demo ürün otomatik yüklenir
- Admin panelden düzenleyebilirsiniz

### Site İçeriği
- Admin Panel > Ayarlar > İçerik
- Tüm metinleri özelleştirin

---

## 🔧 Vercel Özellikleri

### ✅ Ücretsiz Plan
- Sınırsız bandwidth
- Otomatik SSL (HTTPS)
- Global CDN (100+ lokasyon)
- Otomatik optimizasyon
- Analytics (temel)
- 100 GB bandwidth/ay

### ✅ Avantajlar
- Next.js için optimize
- Çok hızlı deploy (1-2 dakika)
- Preview deployments (her branch için)
- Instant rollback
- Zero-config
- Otomatik cache

### ✅ Her Deploy'da
- Yeni preview URL
- Otomatik test
- Performance metrics
- Lighthouse scores

---

## 📊 Vercel Dashboard

Deploy sonrası dashboard'da:

1. **Overview:** Site durumu, ziyaretçi sayısı
2. **Deployments:** Tüm deploy geçmişi
3. **Analytics:** Ziyaretçi istatistikleri
4. **Settings:** Domain, environment variables
5. **Logs:** Hata ayıklama

---

## 🔄 Güncelleme Yapmak

### GitHub ile (Otomatik):
```powershell
git add .
git commit -m "Güncelleme mesajı"
git push
```
✅ Otomatik deploy başlar!

### Manuel:
1. Vercel dashboard > Deployments
2. "Redeploy" tıklayın

---

## 🌐 Özel Domain Bağlama

1. Vercel dashboard > Settings > Domains
2. "Add" tıklayın
3. Domain adınızı girin (örn: `racc10art.com`)
4. DNS ayarlarını yapın
5. ✅ Otomatik SSL sertifikası

---

## 🔧 Sorun Giderme

### Build Hatası
1. Vercel logs'u kontrol edin
2. Local'de test edin: `npm run build`
3. Node.js versiyonu: minimum 18.17

### Deploy Yavaş
- Normal: 2-3 dakika
- İlk deploy biraz daha uzun olabilir

### 404 Hatası
- Vercel otomatik routing yapar
- `next.config.js` kontrol edin

---

## 💡 Pro İpuçları

1. **Environment Variables:**
   - Settings > Environment Variables
   - API key'leri buraya ekleyin

2. **Preview Deployments:**
   - Her branch otomatik preview URL alır
   - Test için mükemmel

3. **Analytics:**
   - Ücretsiz temel analytics
   - Ziyaretçi sayısı, sayfa görüntüleme

4. **Performance:**
   - Vercel otomatik optimize eder
   - Image optimization
   - Code splitting

---

## 📞 Destek

- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: help@vercel.com

---

## 🎯 Hızlı Başlangıç Özeti

1. ✅ https://vercel.com/signup - Kayıt ol
2. ✅ "Add New Project" - Proje ekle
3. ✅ `racc10art` klasörünü yükle
4. ✅ "Deploy" tıkla
5. ✅ 2-3 dakika bekle
6. ✅ Siteniz hazır! 🎉

---

**Başarılar! Vercel ile deploy çok kolay! 🚀**
