-- =========================================================
-- KIZILDAĞ — Supabase Şeması
-- Supabase panelinde: SQL Editor > New query > bu dosyayı
-- yapıştırıp "Run" ile çalıştırın.
-- =========================================================

-- ---------- MENU ITEMS ----------
create table if not exists public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('ara_sicak','pide','icecek','tatli')),
  name        text not null,
  description text not null default '',
  price       text not null,           -- "260₺" gibi görüntülenecek metin
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.menu_items enable row level security;

-- Herkes (anon dahil) aktif menüyü okuyabilir
create policy "menu_items_public_read"
  on public.menu_items for select
  using (is_active = true);

-- ---------- RESERVATIONS ----------
create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  date        date not null,
  time        time not null,
  guests      integer not null check (guests > 0 and guests <= 30),
  note        text,
  status      text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at  timestamptz not null default now()
);

alter table public.reservations enable row level security;

-- Ziyaretçiler (anon) yalnızca yeni rezervasyon EKLEYEBİLİR,
-- var olan kayıtları okuyamaz/değiştiremez.
create policy "reservations_public_insert"
  on public.reservations for insert
  with check (true);

-- Not: Rezervasyonları görüntülemek/yönetmek için Supabase panelinden
-- Table Editor'ü kullanın (service role ile), ya da ileride
-- kimlik doğrulamalı bir "select" politikası ekleyin (ör. yalnızca
-- authenticated + admin rolü).

-- =========================================================
-- ÖRNEK MENÜ VERİSİ
-- =========================================================
insert into public.menu_items (category, name, description, price, sort_order) values
-- Ara Sıcaklar
('ara_sicak', 'Muhlama (Mıhlama)', 'Karadeniz mısır unu, taze tereyağı ve el yapımı peynirle, tek kişilik bakır tavada.', '220₺', 1),
('ara_sicak', 'Kuymak', 'Sade tereyağı ve peynirle çırpılan, sıcak servis edilen geleneksel Karadeniz lezzeti.', '220₺', 2),
('ara_sicak', 'Karalahana Sarma', 'Karadeniz karalahanası, pirinç, kuşbaşı et ve baharatlarla sarılıp buğulanmış.', '180₺', 3),
('ara_sicak', 'Pancar Kavurma', 'Karadeniz pancarı, soğan ve mısır ekmeği eşliğinde hafif acılı kavurma.', '160₺', 4),

-- Pideler
('pide', 'Kaşarlı Pide', 'Bol eritilmiş kaşar peyniri, taş fırında kabartılmış ince hamur üzerinde.', '260₺', 1),
('pide', 'Kıymalı Pide', 'El kıyması, domates, biber ve soğanla harmanlanmış klasik lezzet.', '280₺', 2),
('pide', 'Mıhlamalı Pide', 'Kaymak, tereyağı ve peynirin pide hamuruyla buluştuğu Kızıldağ imzası.', '300₺', 3),
('pide', 'Karışık Pide', 'Kıyma, sucuk, kaşar ve yumurta bir arada — sofranın en dolu hâli.', '320₺', 4),
('pide', 'Sucuklu Yumurtalı Pide', 'Bol sucuk, çıtır kenar ve üzerinde kırılmış yumurta.', '290₺', 5),
('pide', 'Ispanaklı Pide', 'Taze ıspanak, beyaz peynir ve az yağla hazırlanan hafif seçenek.', '240₺', 6),

-- İçecekler
('icecek', 'Karadeniz Çayı', 'Bakır semaverde demlenen, ince belli bardakta servis edilen tavşan kanı çay.', '40₺', 1),
('icecek', 'Ayran', 'Ev yapımı, taş bardakta soğuk servis.', '50₺', 2),
('icecek', 'Şalgam', 'Acılı veya acısız, geleneksel tarifle.', '60₺', 3),
('icecek', 'Taze Sıkılmış Portakal Suyu', 'Günlük sıkılan mevsim portakalından.', '90₺', 4),
('icecek', 'Cezve Kahve', 'Közde yavaşça pişen, sade ya da şekerli.', '80₺', 5),

-- Tatlılar
('tatli', 'Laz Böreği', 'İnce yufka katları arasında muhallebi, üzeri fındıkla taçlandırılmış.', '150₺', 1),
('tatli', 'Fındıklı Kek', 'Karadeniz fındığıyla harmanlanmış, sıcak servis edilen ev yapımı kek.', '130₺', 2),
('tatli', 'Sütlaç', 'Fırında kavrulmuş, geleneksel tarifle pişen kazan sütlacı.', '120₺', 3),
('tatli', 'Kestane Şekeri', 'Karadeniz kestanesinden, elde hazırlanan tatlı.', '140₺', 4)
on conflict do nothing;
