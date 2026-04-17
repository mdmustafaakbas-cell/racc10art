# 🚀 Deployment Rehberi - racc10art

## Vercel ile Ücretsiz Yayınlama (5 Dakika)

### Yöntem 1: Vercel Dashboard (En Kolay)

1. **Vercel Hesabı Oluşturun**
   - https://vercel.com adresine gidin
   - "Sign Up" ile ücretsiz hesap açın (GitHub ile giriş önerilir)

2. **GitHub'a Yükleyin**
   ```bash
   # racc10art klasöründe terminal açın
   git init
   git add .
   git commit -m "racc10art e-commerce site"
   ```
   
   - GitHub'da yeni repository oluşturun (örn: racc10art)
   - Repository URL'ini kopyalayın
   
   ```bash
   git remote add origin https://github.com/KULLANICI_ADINIZ/racc10art.git
   git branch -M main
   git push -u origin main
   ```

3. **Vercel'de Deploy Edin**
   - Vercel dashboard'a gidin
   - "Add New Project" tıklayın
   - GitHub repository'nizi seçin
   - "Deploy" butonuna tıklayın
   - ✅ 2-3 dakika içinde siteniz yayında!

4. **Domain Alın**
   - Vercel otomatik olarak `racc10art.vercel.app` gibi bir domain verir
   - İsterseniz kendi domain'inizi bağlayabilirsiniz

### Yöntem 2: Vercel CLI (Gelişmiş)

1. **Vercel CLI Kurun**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Edin**
   ```bash
   cd racc10art
   vercel
   ```
   
   - İlk kez kullanıyorsanız giriş yapmanız istenecek
   - Soruları yanıtlayın (genelde Enter tuşuna basmanız yeterli)
   - Deploy tamamlandığında URL'iniz verilecek

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

### Yöntem 3: Netlify (Alternatif)

1. **Netlify Hesabı**
   - https://netlify.com adresine gidin
   - Ücretsiz hesap oluşturun

2. **Deploy**
   - "Add new site" > "Deploy manually"
   - `racc10art` klasörünü sürükle-bırak yapın
   - Veya GitHub ile bağlayın

3. **Build Ayarları**
   - Build command: `npm run build`
   - Publish directory: `.next`

## 📝 Deploy Sonrası

### Admin Paneli
- URL: `https://your-site.vercel.app/admin`
- Şifre: `racc10art2024`
- ⚠️ İlk iş olarak şifreyi değiştirin!

### Demo Veriler
- Site ilk açıldığında otomatik 6 demo ürün yüklenir
- Admin panelden silebilir veya düzenleyebilirsiniz

### Önemli Notlar
- ✅ Vercel ücretsiz planı: Sınırsız bandwidth, otomatik SSL
- ✅ Her git push otomatik deploy tetikler
- ✅ Preview URL'ler her branch için oluşturulur
- ⚠️ localStorage kullanıldığı için veriler tarayıcıda saklanır
- ⚠️ Gerçek production için database kullanmanız önerilir

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Local'de test edin
npm run build
```

### Port Hatası
```bash
# Farklı port kullanın
npm run dev -- -p 3002
```

### Node Version
- Minimum Node.js 18.17 gerekli
- `node --version` ile kontrol edin

## 📞 Destek

Sorun yaşarsanız:
1. Vercel logs'u kontrol edin
2. GitHub Issues açın
3. Vercel community'ye sorun

---

**Başarılar! 🎉**
