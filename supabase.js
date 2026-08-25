// =========================================================
// KIZILDAĞ — Supabase bağlantısı
// =========================================================
// 1) Supabase panelinden (Project Settings > API) şu iki değeri alın:
//    - Project URL
//    - anon public key
// 2) Aşağıdaki iki satırı kendi bilgilerinizle değiştirin.
//    (anon key herkese açık, istemci tarafında kullanılmak için
//     tasarlanmıştır — güvenlik RLS politikalarıyla sağlanır,
//     bkz. supabase/schema.sql)
// =========================================================

export const SUPABASE_URL = "https://jdlorqcbmknynaridpxa.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbG9ycWNibWtueW5hcmlkcHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NTU4MDEsImV4cCI6MjEwMzIzMTgwMX0.ChwfjVeMdOLTopqHKZApz2fAWG_H5M8RfY0EmxGKEYw";

let client = null;

export async function getSupabase() {
  if (client) return client;
  if (SUPABASE_URL.includes("YOUR-PROJECT-REF") || SUPABASE_ANON_KEY.includes("YOUR-SUPABASE")) {
    // Henüz yapılandırılmadı — site yine de statik menüyle çalışır.
    return null;
  }
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  } catch (err) {
    console.error("Supabase istemcisi yüklenemedi:", err);
    return null;
  }
}
