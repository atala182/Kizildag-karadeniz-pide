import { getSupabase } from "./supabase.js";

/* ---------- Yıl ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Header scroll durumu ---------- */
const header = document.getElementById("siteHeader");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobil menü ---------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Hafif paralaks: dağ katmanları ---------- */
const ridgeFar = document.querySelector(".ridge-far");
const ridgeMid = document.querySelector(".ridge-mid");
const ridgeNear = document.querySelector(".ridge-near");
let ticking = false;
document.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (ridgeFar) ridgeFar.style.transform = `translateY(${y * 0.06}px)`;
      if (ridgeMid) ridgeMid.style.transform = `translateY(${y * 0.11}px)`;
      if (ridgeNear) ridgeNear.style.transform = `translateY(${y * 0.16}px)`;
      ticking = false;
    });
  },
  { passive: true }
);

/* =========================================================
   MENÜ — Supabase'ten çeker, yoksa yerleşik menüyü kullanır
   ========================================================= */
const FALLBACK_MENU = {
  ara_sicak: [
    { name: "Muhlama (Mıhlama)", desc: "Karadeniz mısır unu, taze tereyağı ve el yapımı peynirle, tek kişilik bakır tavada.", price: "220₺" },
    { name: "Kuymak", desc: "Sade tereyağı ve peynirle çırpılan, sıcak servis edilen geleneksel Karadeniz lezzeti.", price: "220₺" },
    { name: "Karalahana Sarma", desc: "Karadeniz karalahanası, pirinç, kuşbaşı et ve baharatlarla sarılıp buğulanmış.", price: "180₺" },
    { name: "Pancar Kavurma", desc: "Karadeniz pancarı, soğan ve mısır ekmeği eşliğinde hafif acılı kavurma.", price: "160₺" },
  ],
  pide: [
    { name: "Kaşarlı Pide", desc: "Bol eritilmiş kaşar peyniri, taş fırında kabartılmış ince hamur üzerinde.", price: "260₺" },
    { name: "Kıymalı Pide", desc: "El kıyması, domates, biber ve soğanla harmanlanmış klasik lezzet.", price: "280₺" },
    { name: "Mıhlamalı Pide", desc: "Kaymak, tereyağı ve peynirin pide hamuruyla buluştuğu Kızıldağ imzası.", price: "300₺" },
    { name: "Karışık Pide", desc: "Kıyma, sucuk, kaşar ve yumurta bir arada — sofranın en dolu hâli.", price: "320₺" },
    { name: "Sucuklu Yumurtalı Pide", desc: "Bol sucuk, çıtır kenar ve üzerinde kırılmış yumurta.", price: "290₺" },
    { name: "Ispanaklı Pide", desc: "Taze ıspanak, beyaz peynir ve az yağla hazırlanan hafif seçenek.", price: "240₺" },
  ],
  icecek: [
    { name: "Karadeniz Çayı", desc: "Bakır semaverde demlenen, ince belli bardakta servis edilen tavşan kanı çay.", price: "40₺" },
    { name: "Ayran", desc: "Ev yapımı, taş bardakta soğuk servis.", price: "50₺" },
    { name: "Şalgam", desc: "Acılı veya acısız, geleneksel tarifle.", price: "60₺" },
    { name: "Taze Sıkılmış Portakal Suyu", desc: "Günlük sıkılan mevsim portakalından.", price: "90₺" },
    { name: "Cezve Kahve", desc: "Közde yavaşça pişen, sade ya da şekerli.", price: "80₺" },
  ],
  tatli: [
    { name: "Laz Böreği", desc: "İnce yufka katları arasında muhallebi, üzeri fındıkla taçlandırılmış.", price: "150₺" },
    { name: "Fındıklı Kek", desc: "Karadeniz fındığıyla harmanlanmış, sıcak servis edilen ev yapımı kek.", price: "130₺" },
    { name: "Sütlaç", desc: "Fırında kavrulmuş, geleneksel tarifle pişen kazan sütlacı.", price: "120₺" },
    { name: "Kestane Şekeri", desc: "Karadeniz kestanesinden, elde hazırlanan tatlı.", price: "140₺" },
  ],
};

const CATEGORY_LABELS = {
  ara_sicak: "Ara Sıcaklar",
  pide: "Pideler",
  icecek: "İçecekler",
  tatli: "Tatlılar",
};

let MENU_DATA = null; // { category: [ {name, desc, price} ] }
let activeCategory = "ara_sicak";

async function loadMenu() {
  const panel = document.getElementById("menuPanel");
  const supabase = await getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("category, name, description, price")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length) {
        MENU_DATA = {};
        for (const row of data) {
          if (!MENU_DATA[row.category]) MENU_DATA[row.category] = [];
          MENU_DATA[row.category].push({
            name: row.name,
            desc: row.description,
            price: row.price,
          });
        }
      }
    } catch (err) {
      console.warn("Supabase menü verisi alınamadı, yerleşik menü gösteriliyor.", err);
    }
  }

  if (!MENU_DATA) MENU_DATA = FALLBACK_MENU;
  panel.querySelector(".menu-loading")?.remove();
  renderMenu(activeCategory);
}

function renderMenu(category) {
  const panel = document.getElementById("menuPanel");
  const items = (MENU_DATA && MENU_DATA[category]) || [];

  if (!items.length) {
    panel.innerHTML = `<p class="menu-loading">${CATEGORY_LABELS[category]} yakında sofrada.</p>`;
    return;
  }

  const list = document.createElement("div");
  list.className = "menu-list";
  items.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "menu-item";
    row.style.animationDelay = `${i * 0.05}s`;
    row.innerHTML = `
      <span class="menu-item-name">${escapeHtml(item.name)}</span>
      <span class="menu-item-price">${escapeHtml(item.price)}</span>
      <span class="menu-item-desc">${escapeHtml(item.desc)}</span>
    `;
    list.appendChild(row);
  });

  panel.innerHTML = "";
  panel.appendChild(list);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    activeCategory = btn.dataset.cat;
    renderMenu(activeCategory);
  });
});

loadMenu();

/* =========================================================
   REZERVASYON FORMU — Supabase'e kaydeder
   ========================================================= */
const reserveForm = document.getElementById("reserveForm");
const formStatus = document.getElementById("formStatus");
const reserveSubmit = document.getElementById("reserveSubmit");

reserveForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("is-error");

  const fd = new FormData(reserveForm);
  const payload = {
    name: fd.get("name")?.toString().trim(),
    phone: fd.get("phone")?.toString().trim(),
    date: fd.get("date"),
    time: fd.get("time"),
    guests: Number(fd.get("guests")),
    note: fd.get("note")?.toString().trim() || null,
  };

  reserveSubmit.disabled = true;
  reserveSubmit.textContent = "Gönderiliyor…";

  const supabase = await getSupabase();

  if (!supabase) {
    // Supabase henüz bağlanmadıysa kullanıcıyı bilgilendir.
    formStatus.textContent =
      "Rezervasyon sistemi şu an yapılandırılıyor. Lütfen bizi telefonla arayın.";
    formStatus.classList.add("is-error");
    reserveSubmit.disabled = false;
    reserveSubmit.textContent = "Rezervasyonu Gönder";
    return;
  }

  const { error } = await supabase.from("reservations").insert(payload);

  reserveSubmit.disabled = false;
  reserveSubmit.textContent = "Rezervasyonu Gönder";

  if (error) {
    console.error(error);
    formStatus.textContent = "Bir sorun oluştu, lütfen tekrar deneyin ya da bizi arayın.";
    formStatus.classList.add("is-error");
    return;
  }

  formStatus.textContent = "Teşekkürler! Rezervasyonunuz alındı, kısa süre içinde sizi arayacağız.";
  reserveForm.reset();
});
