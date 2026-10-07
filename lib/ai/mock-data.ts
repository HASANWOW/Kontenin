/** Indonesian content vocabulary used by the demo AI service. */

export const NICHE_TOPICS: Record<string, string[]> = {
  lifestyle: ["rutinitas pagi produktif", "budgeting anak kos", "room makeover murah", "weekly reset", "kebiasaan kecil yang mengubah hari"],
  education: ["teknik belajar Feynman", "cara mencatat yang efektif", "persiapan UTS dalam 3 hari", "aplikasi belajar gratis", "mitos belajar yang salah"],
  tech: ["setup meja kerja budget", "aplikasi AI untuk mahasiswa", "HP biar nggak lemot", "shortcut laptop yang jarang dipakai", "gadget di bawah 200 ribu"],
  food: ["masak 15 menit ala anak kos", "jajanan viral", "meal prep 50 ribu seminggu", "warung legendaris", "resep rice cooker"],
  fashion: ["mix and match 5 baju", "thrifting haul", "outfit kuliah", "capsule wardrobe", "warna baju untuk kulit sawo matang"],
  gaming: ["push rank solo", "game gratis terbaik", "setting grafik HP kentang", "hero meta minggu ini", "setup gaming budget"],
  business: ["ide usaha modal kecil", "jualan di TikTok Shop", "kesalahan UMKM di sosmed", "cara hitung HPP", "personal branding untuk freelancer"],
  comedy: ["tipe-tipe dosen", "anak kos tanggal tua", "kerja kelompok", "ekspektasi vs realita", "chat grup keluarga"],
  travel: ["itinerary 3 hari budget 1 juta", "hidden gem dekat kota", "packing ringan", "naik kereta ekonomi", "kuliner wajib di Jogja"],
  fitness: ["workout 10 menit di kamar", "makan sehat budget mahasiswa", "kesalahan pemula di gym", "progress 30 hari", "stretching setelah duduk lama"],
  other: ["hal yang aku pelajari minggu ini", "pengalaman pribadi", "review jujur", "kesalahan pemula", "behind the scenes"],
}

export function topicsFor(niche: string): string[] {
  const key = niche.toLowerCase().split(/[\s/]+/)[0]
  return NICHE_TOPICS[key] ?? NICHE_TOPICS.other.map((t) => `${t} soal ${niche.toLowerCase()}`)
}

export const GOAL_CTA: Record<string, string> = {
  "grow followers": "Follow untuk part 2 — besok aku bahas lanjutannya.",
  "build personal brand": "Komen pengalaman kamu, aku balas satu-satu.",
  "make money": "Cek link di bio untuk template lengkapnya.",
  "promote business": "DM kata 'MAU' untuk info lengkapnya.",
  "start creating": "Save video ini biar nggak lupa dicoba.",
  "become professional creator": "Share ke teman yang juga lagi mulai ngonten.",
}

export function ctaForGoal(goal: string): string {
  return GOAL_CTA[goal.toLowerCase()] ?? "Save video ini dan coba minggu ini."
}

export const HOOK_TEMPLATES: Record<string, ((topic: string, audience: string) => string)[]> = {
  bold: [
    (t) => `Berhenti melakukan ini kalau kamu serius soal ${t}.`,
    (t, a) => `Mayoritas ${a} salah kaprah soal ${t}. Ini buktinya.`,
    (t) => `Aku bakal jujur: cara ${t} yang kamu pakai sekarang buang waktu.`,
    (t) => `Satu kebiasaan ini bikin ${t} kamu stuck di tempat.`,
  ],
  funny: [
    (t, a) => `POV: kamu ${a} yang baru sadar ${t} itu nggak segampang di FYP.`,
    (t) => `Ekspektasi ${t}: estetik. Realita: kayak gini.`,
    (t) => `Aku nyoba ${t} dan hasilnya bikin ibu kos geleng-geleng.`,
    (t) => `Tutorial ${t} tapi jujur 100% tanpa filter.`,
  ],
  educational: [
    (t) => `3 langkah ${t} yang bisa kamu praktikkan dalam 10 menit.`,
    (t) => `Kalau kamu cuma boleh belajar satu hal soal ${t}, pelajari ini.`,
    (t, a) => `Cara paling simpel ${t} untuk ${a} — tanpa alat mahal.`,
    (t) => `Ini framework ${t} yang aku pakai setiap minggu.`,
  ],
  emotional: [
    (t) => `Setahun lalu aku hampir menyerah soal ${t}. Ini yang mengubah semuanya.`,
    (t, a) => `Buat kamu ${a} yang merasa tertinggal soal ${t}, video ini untukmu.`,
    (t) => `Nggak ada yang ngasih tahu aku ini waktu mulai ${t}.`,
    (t) => `Aku nangis waktu pertama kali berhasil ${t}. Ceritanya begini.`,
  ],
  curiosity: [
    (t) => `Kenapa ${t} kamu nggak berhasil padahal sudah ikut semua tips?`,
    (t) => `Ada satu trik ${t} yang jarang dibahas — dan efeknya besar.`,
    (t) => `Aku tes 3 cara ${t}. Yang menang di luar dugaan.`,
    (t) => `Tunggu sampai detik ke-20, ini bagian paling penting soal ${t}.`,
  ],
  storytelling: [
    (t) => `Hari pertama aku coba ${t}, semuanya berantakan.`,
    (t) => `Tiga bulan lalu aku nol soal ${t}. Ini perjalanannya.`,
    (t, a) => `Ada ${a} yang DM aku soal ${t}, dan jawabanku bikin dia kaget.`,
    (t) => `Cerita ini dimulai dari satu kesalahan kecil saat ${t}.`,
  ],
}

export const BROLL_BY_TYPE: Record<string, string[]> = {
  tutorial: ["Close-up tangan saat praktik", "Screen recording langkah demi langkah", "Shot hasil akhir (before–after)"],
  tips: ["Talking head dengan jump cut", "Teks angka besar untuk tiap tips", "Cutaway ke contoh nyata"],
  storytelling: ["Footage lama / foto dokumentasi", "Shot ekspresi wajah close-up", "Transisi waktu (jam, kalender)"],
  review: ["Unboxing / detail produk", "Perbandingan berdampingan", "Shot pemakaian sehari-hari"],
  educational: ["Whiteboard atau tulisan tangan", "Animasi diagram sederhana", "Contoh kasus nyata di layar"],
}
