# Kızıldağ — Karadeniz Pide Restoranı

Statik, tek sayfalık ve tamamen özel tasarlanmış restoran web sitesi.
Menü ve siparişler Supabase üzerinden yönetilir; site GitHub +
Netlify ile canlıya alınacak şekilde hazırlanmıştır. Build adımı
gerektirmez (saf HTML/CSS/JS) — bu yüzden kurulum çok hızlıdır.

```
kizildag/
├── index.html
├── css/style.css
├── js/
│   ├── supabase.js      ← Supabase URL + anon key buraya girilir
│   └── main.js          ← menü/sepet/sipariş mantığı
├── supabase/schema.sql  ← veritabanı şeması + örnek menü
└── README.md
```

---

## 1) Supabase kurulumu — ✅ tamamlandı

Sizin için gerçek bir Supabase projesi oluşturuldu ve bağlandı:

- **Proje:** `kizildag-pide` (org: `irkayazılımmuhasebe`, bölge: `eu-central-1`)
- **Project URL:** `https://jdlorqcbmknynaridpxa.supabase.co`
- `menu_items` ve `orders` tabloları, RLS politikaları ve örnek
  menü verisi zaten kuruldu (`supabase/schema.sql` bunun kaydıdır —
  projeyi başka bir Supabase hesabına taşımak isterseniz aynı dosyayı
  yeni projede çalıştırmanız yeterli).
- `js/supabase.js` içine proje URL'i ve `anon` anahtarı zaten işlendi;
  ekstra bir şey yapmanıza gerek yok.
- Supabase panelinize [supabase.com/dashboard](https://supabase.com/dashboard)
  üzerinden, projeyi oluşturan hesapla giriş yaparak ulaşabilirsiniz.

> `anon` anahtarı istemci tarafında kullanılmak üzere tasarlanmıştır,
> paylaşılması güvenlik sorunu değildir — koruma RLS politikalarıyla
> sağlanır (ziyaretçiler yalnızca sipariş **ekleyebilir**, menüyü
> yalnızca **okuyabilir**).

**Menüyü yönetmek:** Supabase panelinde **Table Editor → menu_items**
üzerinden satır ekleyip/düzenleyip/pasif hale getirerek (`is_active`)
kod değiştirmeden menüyü güncelleyebilirsiniz — site otomatik olarak
güncel veriyi çeker. Supabase henüz bağlanmadıysa site, dosyaların
içine gömülü aynı menüyü göstermeye devam eder (site asla boş kalmaz).

**Siparişleri görmek ve durumunu güncellemek:** **Table Editor → orders**.
`status` sütununu `pending` → `preparing` → `ready`/`on_the_way` → `completed`
olarak elle güncelleyerek sipariş akışını takip edebilirsiniz. `items`
sütunu her siparişin sepet içeriğini JSON olarak tutar.

---

## 2) GitHub'a yükleme

```bash
cd kizildag
git init
git add .
git commit -m "Kızıldağ Karadeniz Pide Restoranı - ilk sürüm"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/kizildag-pide.git
git push -u origin main
```

(GitHub'da önce boş bir repo oluşturmanız gerekir: **New repository** →
isim verin → *"Initialize with README" seçmeyin* → oluşturun, ardından
yukarıdaki `remote add` satırındaki URL'yi kendi repo adresinizle
değiştirin.)

---

## 3) Netlify'da yayınlama

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import
   an existing project**.
2. GitHub hesabınızı bağlayın, az önce oluşturduğunuz `kizildag-pide`
   reposunu seçin.
3. Build ayarları:
   - **Build command:** boş bırakın
   - **Publish directory:** `.` (proje kök dizini)
4. **Deploy site**'a tıklayın. Birkaç saniye içinde siteniz
   `https://rastgele-isim.netlify.app` adresinde yayında olur.
5. İsterseniz **Site configuration → Domain management** üzerinden
   kendi alan adınızı (ör. `kizildagpide.com`) bağlayabilirsiniz.

Bundan sonra `main` dalına her `git push` yaptığınızda Netlify siteyi
otomatik olarak yeniden yayınlar.

---

## Yerelde önizleme

Herhangi bir build aracı gerekmez; sadece bir statik sunucu:

```bash
cd kizildag
python3 -m http.server 8080
# tarayıcıda http://localhost:8080 açın
```

(`file://` ile doğrudan açmak, `type="module"` script'ler ve Supabase
istekleri tarayıcı güvenlik kısıtları yüzünden çalışmayabilir — bu
yüzden mutlaka bir yerel sunucu üzerinden çalıştırın.)

---

## Özelleştirme notları

- **Renkler / tipografi:** `css/style.css` en üstteki `:root` değişkenleri.
- **Menü (statik yedek):** `js/main.js` içindeki `FALLBACK_MENU`.
- **İletişim bilgileri, adres, sosyal medya:** `index.html` içinde
  `<footer>` bölümü.
- **Logo/işaret:** `index.html` içinde `.brand-mark` SVG'si — kendi
  logonuzla değiştirebilirsiniz.
