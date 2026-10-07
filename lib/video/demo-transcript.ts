/**
 * Sample transcript used in demo mode. It is NOT derived from the user's
 * uploaded file — the UI labels every result built from it as demo data.
 * Tags drive the demo moment finder.
 */

export interface DemoSegment {
  start: number
  end: number
  text: string
  tags: ("hook" | "funny" | "educational" | "money" | "story" | "cta" | "emotional")[]
}

export const DEMO_DURATION = 252

export const DEMO_TRANSCRIPT: DemoSegment[] = [
  { start: 0, end: 7, text: "Kalau kamu baru mulai bikin konten, video ini bakal hemat waktu kamu setahun.", tags: ["hook"] },
  { start: 7, end: 14, text: "Kesalahan pertama yang sering dilakukan pemula: nunggu semuanya sempurna dulu baru upload.", tags: ["educational", "hook"] },
  { start: 14, end: 23, text: "Aku dulu juga gitu. Tiga bulan cuma beli lampu, mic, tripod… tapi nggak ada satu video pun yang jadi.", tags: ["story", "money", "hook"] },
  { start: 23, end: 31, text: "Total habis hampir dua juta rupiah, dan follower aku masih nol. Nol. Bahkan ibu aku belum follow.", tags: ["funny", "money"] },
  { start: 31, end: 40, text: "Jadi hal pertama yang aku pengen tahu dari awal: alat itu nomor sekian. Yang penting kamu mulai.", tags: ["educational"] },
  { start: 40, end: 49, text: "HP yang kamu pegang sekarang itu udah lebih dari cukup. Cahaya jendela itu lighting gratis paling bagus.", tags: ["educational", "money"] },
  { start: 49, end: 58, text: "Hal kedua: tiga detik pertama itu segalanya. Orang memutuskan scroll atau nggak dalam waktu sesingkat itu.", tags: ["educational", "hook"] },
  { start: 58, end: 68, text: "Jangan buka video dengan 'halo guys, balik lagi di channel aku'. Langsung kasih alasan kenapa mereka harus nonton.", tags: ["educational"] },
  { start: 68, end: 78, text: "Contohnya, bandingin dua pembuka ini. Yang pertama: 'hari ini aku mau kasih tips belajar'.", tags: ["educational"] },
  { start: 78, end: 88, text: "Yang kedua: 'nilai aku naik dari C ke A cuma dengan ganti satu kebiasaan ini'. Kamu pilih nonton yang mana?", tags: ["educational", "hook"] },
  { start: 88, end: 97, text: "Pasti yang kedua kan. Karena ada hasil yang spesifik, dan kamu penasaran kebiasaannya apa.", tags: ["educational"] },
  { start: 97, end: 107, text: "Aku pernah bikin video yang aku edit tiga hari, transisinya keren banget, ditonton… 47 kali. Empat puluh tujuh.", tags: ["funny", "story"] },
  { start: 107, end: 116, text: "Terus aku bikin video lima belas menit, cuma ngomong ke kamera, hook-nya kuat. Ditonton dua puluh ribu kali.", tags: ["story", "hook"] },
  { start: 116, end: 126, text: "Di situ aku sadar, editing itu bumbu. Isinya tetap hook dan nilai yang kamu kasih ke penonton.", tags: ["educational", "emotional"] },
  { start: 126, end: 136, text: "Hal ketiga, dan ini yang paling susah: konsisten. Bukan konsisten viral, tapi konsisten upload dan belajar.", tags: ["educational"] },
  { start: 136, end: 146, text: "Aku pakai sistem sederhana. Senin cari ide, Selasa tulis script, Rabu rekam, Kamis edit, Jumat upload.", tags: ["educational"] },
  { start: 146, end: 156, text: "Sabtu aku lihat analytics: video mana yang orang tonton sampai habis, dan di detik berapa mereka pergi.", tags: ["educational"] },
  { start: 156, end: 166, text: "Dari situ aku tahu harus perbaiki apa. Bukan nebak-nebak lagi. Ini yang bikin aku akhirnya bisa dapat brand deal pertama.", tags: ["money", "story"] },
  { start: 166, end: 176, text: "Brand deal pertama aku cuma tiga ratus ribu, tapi rasanya kayak menang lotre. Aku sampai screenshot transferannya.", tags: ["money", "funny", "emotional"] },
  { start: 176, end: 186, text: "Yang mau aku tekankan: kamu nggak harus jago dulu buat mulai. Kamu harus mulai dulu biar jadi jago.", tags: ["emotional", "hook"] },
  { start: 186, end: 197, text: "Video pertama kamu mungkin jelek. Video pertama aku juga jelek, sampai sekarang masih aku private karena malu.", tags: ["funny", "story"] },
  { start: 197, end: 208, text: "Tapi video ke-50 kamu pasti jauh lebih baik dari video pertama. Dan itu cuma bisa terjadi kalau kamu bikin video pertamanya.", tags: ["emotional"] },
  { start: 208, end: 220, text: "Jadi rangkumannya: mulai dengan alat yang ada, fokus ke tiga detik pertama, dan bikin sistem biar konsisten.", tags: ["educational"] },
  { start: 220, end: 232, text: "Kalau kamu mau template jadwal konten mingguan yang aku pakai, tulis 'MAU' di kolom komentar.", tags: ["cta"] },
  { start: 232, end: 242, text: "Dan follow, karena minggu depan aku bahas cara nulis script 30 detik yang nggak bikin orang scroll.", tags: ["cta"] },
  { start: 242, end: 252, text: "Sampai ketemu di video berikutnya. Jangan lupa: upload dulu, sempurnakan nanti.", tags: ["cta", "emotional"] },
]
