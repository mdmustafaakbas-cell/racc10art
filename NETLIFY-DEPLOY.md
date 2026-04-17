# 🚀 Netlify ile Hızlı Deploy - racc10art

## Yöntem 1: Netlify Drop (Sürükle-Bırak) ⚡

### Adım 1: Projeyi Hazırlayın

**ÖNEMLİ:** Netlify Drop için önce build almanız gerekiyor.

1. **Development server'ı durdurun** (Ctrl+C ile)

2. **Build alın:**
   ```bash
   cd racc10art
   npm run build
   ```
   
   Bu işlem 1-2 dakika sürer. Tamamlandığında `.next` klasörü oluşur.

### Adım 2: Netlify'a Yükleyin

**Seçenek A - Klasör Yükleme (Önerilen):**

1. https://app.netlify.com/drop adresine gidin
2. Netlify hesabınız yoksa "Sign up" yapın (ücretsiz)
3. **Tüm `racc10art` klasörünü** tarayıcıya sürükle-bırak yapın
4. Netlify otomatik olarak:
   - `netlify.toml` dosyasını okur
   - `npm run build` komutunu çalıştırır
   - Siteyi yayınlar
5. ✅ 2-3 dakika içinde siteniz hazır!

**Seçenek B - ZIP Yükleme:**

1. `racc10art` klasörünü sağ tıklayın
2. "Sıkıştır" veya "Compress to ZIP"
3. https://app.netlify.com/drop adresine gidin
4. ZIP dosyasını sürükle-bırak yapın

### Adım 3: Site Ayarları

Deploy tamamlandıktan sonra:

1. **Site Adını Değiştirin:**
   - Site settings > General > Site details
   - "Change site name" tıklayın
   - Örnek: `racc10art` → `racc10art.netlify.app`

2. **Build Ayarlarını Kontrol Edin:**
   - Site settings > Build & deploy
   - Build command: `npm run build`
   - Publish directory: `.next`

---

## Yöntem 2: GitHub + Netlify (Otomatik Deploy) 🔄

Bu yöntem her kod değişikliğinde otomatik deploy yapar.

### Adım 1: GitHub'a Yükleyin

```bash
cd racc10art
git init
git add .
git commit -m "Initial commit"
```

GitHub'da yeni repository oluşturun, sonra:

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/racc10art.git
git branch -M main
git push -u origin main
```

### Adım 2: Netlify'a Bağlayın

1. https://app.netlify.com adresine gidin
2. "Add new site" > "Import an existing project"
3. "GitHub" seçin ve repository'nizi seçin
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. "Deploy site" tıklayın

✅ Her `git push` otomatik deploy tetikler!

---

## 🎯 Deploy Sonrası

### URL'iniz
- Netlify size otomatik URL verir: `random-name-123.netlify.app`
- Site settings'den özel isim verebilirsiniz: `racc10art.netlify.app`

### Admin Paneli
- URL: `https://racc10art.netlify.app/admin`
- Şifre: `racc10art2024`
- ⚠️ İlk iş olarak şifreyi değiştirin!

### Demo Veriler
- Site ilk açıldığında 6 demo ürün otomatik yüklenir
- Admin panelden düzenleyebilirsiniz

---

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Local'de test edin
npm run build
```

Hata alırsanız:
1. `node_modules` klasörünü silin
2. `npm install` çalıştırın
3. Tekrar `npm run build` deneyin

### Deploy Başarısız
- Netlify logs'u kontrol edin
- Node.js versiyonunu kontrol edin (minimum 18.17)
- `netlify.toml` dosyasının doğru olduğundan emin olun

### Sayfa Yüklenmiyor
- Netlify'da "Functions" sekmesini kontrol edin
- Next.js plugin'inin yüklü olduğundan emin olun

---

## 💡 Netlify Özellikleri

✅ **Ücretsiz Plan:**
- 100 GB bandwidth/ay
- Otomatik SSL (HTTPS)
- Sürekli deployment
- Form handling
- Serverless functions

✅ **Avantajlar:**
- Çok hızlı deploy
- Otomatik preview deployments
- Rollback özelliği
- Custom domain desteği

---

## 📞 Yardım

Sorun yaşarsanız:
1. Netlify support docs: https://docs.netlify.com
2. Netlify community: https://answers.netlify.com
3. Build logs'u kontrol edin

---

**Başarılar! 🎉**

Siteniz yayına girdiğinde URL'i paylaşabilirsiniz!
