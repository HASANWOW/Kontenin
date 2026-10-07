import type { Course } from "@/types/domain"

export const CONTENT_101: Course = {
  id: "content-creation-101",
  title: "Content Creation 101",
  description: "Dari nol sampai upload video pertama: niche, ide, hook, script, rekam, edit, dan distribusi.",
  category: "Content Fundamentals",
  difficulty: "beginner",
  instructor: { name: "Nadia Putri", role: "Educator & creator, 480K followers" },
  rating: 4.8,
  reviews: 1284,
  hue: 262,
  overview:
    "Kursus inti Kontenin. Kamu akan belajar alur lengkap membuat konten short-form — bukan teori panjang, tapi langkah praktis yang langsung kamu coba di setiap pelajaran. Di akhir kursus, kamu punya niche yang jelas, 10 ide konten, dan satu video pertama yang siap upload.",
  outcomes: [
    "Menentukan niche dan audiens yang spesifik",
    "Menulis hook yang bikin orang berhenti scroll",
    "Menyusun script 30–60 detik dengan struktur jelas",
    "Merekam dan mengedit dengan alat yang sudah kamu punya",
  ],
  lessons: [
    {
      id: "what-is-content-creation",
      title: "What is Content Creation?",
      minutes: 9,
      summary: "Konten adalah nilai yang dikemas: hiburan, edukasi, inspirasi, atau koneksi.",
      transcript: [
        "Banyak orang mengira bikin konten itu soal kamera mahal atau editing keren. Padahal inti dari konten adalah satu hal: memberi nilai ke orang yang menonton. Nilai itu bisa berupa hiburan, informasi, inspirasi, atau rasa 'ternyata aku nggak sendirian'.",
        "Setiap video yang berhasil menjawab pertanyaan di kepala penonton: 'Kenapa aku harus nonton ini sekarang?' Kalau jawabannya nggak jelas dalam beberapa detik, mereka akan scroll. Itu bukan karena kontenmu jelek, tapi karena nilainya belum terlihat.",
        "Di Kontenin, kamu akan belajar dengan siklus sederhana: belajar satu konsep, langsung praktik lewat misi, dapat feedback, lalu perbaiki. Kreator yang berkembang paling cepat bukan yang paling berbakat, tapi yang paling sering menyelesaikan siklus ini.",
      ],
      takeaways: [
        "Konten = nilai yang dikemas untuk audiens tertentu.",
        "Empat jenis nilai: hiburan, edukasi, inspirasi, koneksi.",
        "Penonton memutuskan dalam hitungan detik — nilai harus terlihat cepat.",
        "Kemajuan datang dari siklus belajar → praktik → feedback.",
      ],
      examples: [
        {
          label: "Konten tanpa nilai yang jelas vs dengan nilai jelas",
          weak: "Vlog random aku hari ini ngapain aja.",
          strong: "Rutinitas pagi 15 menit yang bikin aku nggak telat kuliah lagi.",
          note: "Versi kedua langsung menjanjikan manfaat spesifik untuk penonton.",
        },
      ],
      quiz: [
        {
          question: "Apa inti dari konten yang berhasil?",
          options: ["Kamera dan lighting yang bagus", "Nilai yang jelas untuk penonton", "Durasi yang panjang", "Musik yang sedang viral"],
          answerIndex: 1,
          explanation: "Alat membantu, tapi penonton bertahan karena merasa mendapat sesuatu.",
        },
        {
          question: "Mana yang BUKAN salah satu dari empat jenis nilai konten?",
          options: ["Hiburan", "Edukasi", "Popularitas", "Koneksi"],
          answerIndex: 2,
          explanation: "Popularitas adalah hasil, bukan nilai yang kamu berikan ke penonton.",
        },
      ],
      practice: "Tulis 3 video favoritmu minggu ini dan tentukan jenis nilai apa yang diberikan masing-masing.",
    },
    {
      id: "finding-your-niche",
      title: "Finding Your Niche",
      minutes: 12,
      summary: "Niche bukan sekadar topik — niche adalah orang tertentu dengan masalah tertentu.",
      transcript: [
        "Kesalahan paling umum pemula adalah memilih niche terlalu luas, misalnya 'lifestyle'. Masalahnya, lifestyle itu bisa apa saja, sehingga algoritma dan penonton bingung kamu itu sebenarnya untuk siapa.",
        "Coba gunakan rumus ini: aku bikin konten [topik] untuk [audiens] yang [masalah]. Contohnya: aku bikin konten masak cepat untuk anak kos yang cuma punya rice cooker. Tiba-tiba semuanya jadi jelas — ide, gaya bahasa, bahkan thumbnail.",
        "Untuk menemukan niche, lihat irisan tiga hal: apa yang kamu suka, apa yang kamu tahu sedikit lebih banyak dari orang lain, dan apa yang dicari orang. Kamu tidak perlu jadi ahli. Cukup satu langkah di depan audiensmu.",
      ],
      takeaways: [
        "Gunakan rumus: topik + audiens + masalah.",
        "Niche sempit membuat ide dan gaya lebih mudah ditentukan.",
        "Cari irisan: minat, pengetahuan, dan permintaan.",
        "Cukup satu langkah di depan audiens — tidak perlu ahli.",
      ],
      examples: [
        {
          label: "Niche luas vs niche spesifik",
          weak: "Aku bikin konten lifestyle.",
          strong: "Aku bikin konten budgeting untuk mahasiswa rantau yang uang bulanannya selalu habis di minggu ketiga.",
          note: "Versi spesifik langsung memberi 20 ide video yang jelas.",
        },
      ],
      quiz: [
        {
          question: "Rumus niche yang dipakai di pelajaran ini adalah…",
          options: ["Topik + platform + durasi", "Topik + audiens + masalah", "Hobi + jumlah follower", "Tren + musik + filter"],
          answerIndex: 1,
          explanation: "Niche yang kuat menjawab: tentang apa, untuk siapa, dan masalah apa yang diselesaikan.",
        },
        {
          question: "Apakah kamu harus jadi ahli untuk memulai sebuah niche?",
          options: ["Ya, minimal bersertifikat", "Tidak, cukup satu langkah di depan audiens", "Ya, kalau mau dapat brand deal", "Tergantung platform"],
          answerIndex: 1,
          explanation: "Banyak kreator sukses justru membagikan proses belajarnya sendiri.",
        },
      ],
      practice: "Lengkapi kalimat: 'Aku bikin konten ___ untuk ___ yang ___.' Buat 3 versi, lalu pilih yang paling spesifik.",
    },
    {
      id: "understanding-your-audience",
      title: "Understanding Your Audience",
      minutes: 10,
      summary: "Kenali satu orang spesifik yang kamu ajak bicara di setiap video.",
      transcript: [
        "Video yang terasa personal biasanya dibuat untuk satu orang, bukan untuk 'semua orang'. Coba bayangkan satu penonton ideal: umurnya berapa, kegiatannya apa, dan apa yang membuat dia frustrasi minggu ini.",
        "Cara paling cepat memahami audiens adalah membaca komentar di video kreator lain di niche-mu. Komentar adalah tambang emas: di situ orang menulis pertanyaan, keluhan, dan bahasa yang mereka pakai sehari-hari.",
        "Simpan kalimat-kalimat itu. Ketika kamu memakai bahasa yang sama dengan audiens, mereka merasa 'ini aku banget' — dan itulah alasan orang follow.",
      ],
      takeaways: [
        "Buat konten untuk satu penonton ideal, bukan semua orang.",
        "Baca komentar di niche-mu untuk menemukan masalah nyata.",
        "Pakai bahasa yang dipakai audiens, bukan bahasa buku.",
      ],
      examples: [
        {
          label: "Bahasa umum vs bahasa audiens",
          weak: "Tips manajemen keuangan untuk pelajar.",
          strong: "Kalau duit bulanan kamu udah tipis padahal baru tanggal 15, coba cara ini.",
          note: "Versi kedua memakai situasi dan kata-kata yang benar-benar dialami audiens.",
        },
      ],
      quiz: [
        {
          question: "Sumber tercepat untuk memahami masalah audiens adalah…",
          options: ["Buku teori marketing", "Kolom komentar di niche-mu", "Jumlah like", "Trending sound"],
          answerIndex: 1,
          explanation: "Komentar berisi pertanyaan dan keluhan asli dalam bahasa audiens sendiri.",
        },
      ],
      practice: "Baca 30 komentar di 3 video populer di niche-mu. Tulis 5 masalah atau pertanyaan yang paling sering muncul.",
    },
    {
      id: "creating-content-ideas",
      title: "Creating Content Ideas",
      minutes: 11,
      summary: "Ide bagus bukan ditunggu — ide dibuat dengan sistem.",
      transcript: [
        "Kehabisan ide biasanya terjadi karena kita menunggu inspirasi. Kreator yang konsisten punya sistem: mereka mengubah satu masalah audiens menjadi banyak format.",
        "Ambil satu masalah, misalnya 'susah bangun pagi'. Kamu bisa membuatnya jadi tutorial, kesalahan umum, eksperimen 7 hari, POV yang relatable, atau storytime. Satu masalah, lima video.",
        "Simpan semua ide di satu tempat — seperti Content Planner di Kontenin. Jangan menilai ide saat menulisnya. Pilih dan saring nanti, saat kamu merencanakan minggu depan.",
      ],
      takeaways: [
        "Satu masalah audiens bisa jadi 5+ format video.",
        "Format andalan: tutorial, kesalahan, eksperimen, POV, storytime.",
        "Tulis dulu, saring belakangan.",
      ],
      examples: [
        {
          label: "Satu masalah, banyak format",
          strong: "Masalah: 'susah fokus belajar' → (1) 3 kesalahan saat belajar malam (2) Aku coba Pomodoro 7 hari (3) POV: buka buku, tiba-tiba sudah 2 jam scroll.",
          note: "Format berbeda menjangkau penonton dengan selera berbeda.",
        },
      ],
      quiz: [
        {
          question: "Kenapa kreator konsisten jarang kehabisan ide?",
          options: ["Mereka lebih kreatif", "Mereka punya sistem mengubah masalah jadi format", "Mereka menyalin tren", "Mereka upload sebulan sekali"],
          answerIndex: 1,
          explanation: "Sistem membuat ide bisa diproduksi, bukan ditunggu.",
        },
      ],
      practice: "Pilih satu masalah audiensmu dan ubah menjadi 5 ide video dengan format berbeda.",
    },
    {
      id: "writing-a-good-hook",
      title: "Writing a Good Hook",
      minutes: 14,
      summary: "Tiga detik pertama menentukan apakah videomu ditonton atau di-scroll.",
      transcript: [
        "Hook adalah kalimat dan visual di tiga detik pertama. Tugasnya cuma satu: membuat orang berhenti scroll dan penasaran dengan detik berikutnya.",
        "Hook yang lemah biasanya dimulai dengan sapaan atau pengumuman, seperti 'Halo guys, hari ini aku mau kasih tips'. Penonton belum tahu kenapa mereka harus peduli. Hook yang kuat langsung menyentuh masalah, hasil, atau kejutan.",
        "Lima pola hook yang bisa kamu pakai: pertanyaan yang menusuk, pernyataan berani, angka spesifik, hasil sebelum-sesudah, dan pembuka cerita. Tulis minimal tiga versi hook untuk setiap video, lalu pilih yang paling spesifik.",
      ],
      takeaways: [
        "Hook = 3 detik pertama, kalimat + visual.",
        "Hindari sapaan dan pengumuman di awal.",
        "Pola kuat: pertanyaan, pernyataan berani, angka, before–after, cerita.",
        "Selalu tulis minimal 3 versi hook.",
      ],
      examples: [
        {
          label: "Hook lemah vs hook kuat",
          weak: "Guys hari ini aku mau kasih tips…",
          strong: "Kalau video kamu selalu sepi meskipun editing-nya bagus, kemungkinan masalahnya ada di 3 detik pertama.",
          note: "Hook kuat menyebut masalah spesifik dan menjanjikan jawaban.",
        },
        {
          label: "Hook dengan angka",
          strong: "Nilai aku naik dari C ke A cuma dengan ganti satu kebiasaan ini.",
          note: "Hasil spesifik + rasa penasaran (kebiasaan apa?).",
        },
      ],
      quiz: [
        {
          question: "Mana pembuka yang paling kuat?",
          options: ["Halo semuanya, selamat datang kembali!", "Di video ini aku mau bahas tentang tidur.", "Kamu capek terus padahal tidur 8 jam? Ini penyebabnya.", "Oke langsung aja ya."],
          answerIndex: 2,
          explanation: "Langsung menyentuh masalah penonton dan menjanjikan jawaban.",
        },
        {
          question: "Berapa versi hook yang sebaiknya kamu tulis untuk satu video?",
          options: ["1", "Minimal 3", "Tidak perlu ditulis", "10 wajib"],
          answerIndex: 1,
          explanation: "Membandingkan beberapa versi membantu kamu menemukan yang paling spesifik.",
        },
      ],
      practice: "Tulis 3 hook untuk video berikutnya, masing-masing memakai pola berbeda.",
    },
    {
      id: "storytelling",
      title: "Storytelling",
      minutes: 12,
      summary: "Cerita membuat informasi diingat. Gunakan struktur situasi → konflik → perubahan.",
      transcript: [
        "Orang lupa fakta, tapi ingat cerita. Bahkan video tips 30 detik akan terasa lebih kuat kalau dibungkus dalam cerita kecil.",
        "Struktur paling sederhana: situasi, konflik, perubahan. 'Dulu aku selalu telat (situasi). Aku sampai ditegur dosen di depan kelas (konflik). Sejak pakai trik ini, sebulan nggak pernah telat lagi (perubahan).'",
        "Kunci storytelling di short-form adalah memotong bagian yang membosankan. Mulai sedekat mungkin dengan konflik, dan biarkan detail kecil — ekspresi, suara, angka — yang membuat cerita terasa nyata.",
      ],
      takeaways: [
        "Struktur: situasi → konflik → perubahan.",
        "Mulai sedekat mungkin dengan konflik.",
        "Detail kecil membuat cerita terasa nyata.",
      ],
      examples: [
        {
          label: "Tips biasa vs tips dalam cerita",
          weak: "Gunakan alarm di seberang ruangan supaya bangun pagi.",
          strong: "Aku pernah ketinggalan UTS karena snooze alarm 6 kali. Sejak itu, HP aku taruh di seberang kamar — dan ini yang terjadi.",
          note: "Cerita memberi alasan emosional untuk percaya pada tipsnya.",
        },
      ],
      quiz: [
        {
          question: "Urutan struktur cerita sederhana adalah…",
          options: ["Konflik → situasi → CTA", "Situasi → konflik → perubahan", "Perubahan → situasi → konflik", "Hook → musik → teks"],
          answerIndex: 1,
          explanation: "Situasi memberi konteks, konflik memberi tegangan, perubahan memberi kepuasan.",
        },
      ],
      practice: "Ubah satu tips yang kamu tahu menjadi cerita 3 kalimat dengan struktur situasi → konflik → perubahan.",
    },
    {
      id: "script-writing",
      title: "Script Writing",
      minutes: 15,
      summary: "Script singkat membuat rekaman lebih cepat dan pesan lebih tajam.",
      transcript: [
        "Script bukan berarti kamu harus kaku membaca teks. Script adalah peta, supaya kamu tidak berputar-putar saat merekam dan penonton tidak bosan.",
        "Struktur 30 detik yang bisa kamu pakai: Hook (3 detik), Isi (2–3 poin, sekitar 20 detik), Nilai/kesimpulan (4 detik), dan CTA (3 detik). Dengan kecepatan bicara rata-rata, 30 detik setara sekitar 70 kata.",
        "Tulis satu ide per baris. Baca keras-keras dan hapus kata yang tidak perlu. Kalau satu kalimat terasa susah diucapkan, artinya juga susah dipahami.",
      ],
      takeaways: [
        "Struktur: Hook → Isi → Nilai → CTA.",
        "30 detik ≈ 70 kata.",
        "Satu ide per baris; baca keras-keras untuk menyunting.",
      ],
      examples: [
        {
          label: "Contoh script 30 detik",
          strong:
            "HOOK: Kamu sering lupa materi padahal sudah belajar lama?\nISI: Pertama, tutup buku dan jelaskan ulang dengan bahasamu sendiri. Kedua, tulis bagian yang kamu nggak bisa jelaskan. Ketiga, ulangi besok pagi.\nNILAI: Belajar bukan soal lama, tapi soal mengingat ulang.\nCTA: Save video ini buat UTS nanti.",
          note: "Setiap bagian punya tugas yang jelas.",
        },
      ],
      quiz: [
        {
          question: "Kira-kira berapa kata untuk script 30 detik?",
          options: ["20 kata", "70 kata", "200 kata", "500 kata"],
          answerIndex: 1,
          explanation: "Kecepatan bicara rata-rata sekitar 2–2,5 kata per detik.",
        },
      ],
      practice: "Tulis script 30 detik dengan struktur Hook → Isi → Nilai → CTA untuk salah satu idemu.",
    },
    {
      id: "recording-basics",
      title: "Recording Basics",
      minutes: 13,
      summary: "Cahaya, suara, dan framing lebih penting daripada kamera mahal.",
      transcript: [
        "HP yang kamu pegang sekarang sudah cukup untuk mulai. Yang membedakan video amatir dan rapi biasanya tiga hal: cahaya, suara, dan framing.",
        "Untuk cahaya, hadapkan wajah ke jendela. Cahaya alami dari depan membuat wajah terang dan rata. Untuk suara, rekam di ruangan kecil dengan banyak kain — kasur, lemari baju — supaya tidak bergema. Penonton lebih toleran pada gambar buram daripada suara jelek.",
        "Untuk framing, posisikan mata di sepertiga atas layar dan sisakan ruang di atas kepala yang tidak terlalu besar. Rekam dalam format vertikal 9:16, dan gunakan kamera belakang jika memungkinkan karena kualitasnya lebih baik.",
      ],
      takeaways: [
        "Hadapkan wajah ke jendela untuk cahaya gratis terbaik.",
        "Suara jernih lebih penting dari gambar tajam.",
        "Mata di sepertiga atas layar, format 9:16.",
      ],
      examples: [
        {
          label: "Setup budget nol rupiah",
          strong: "HP + tumpukan buku sebagai tripod + jendela sebagai lighting + rekam di dalam lemari baju untuk voice over.",
          note: "Banyak kreator besar memulai dengan setup seperti ini.",
        },
      ],
      quiz: [
        {
          question: "Mana yang paling mengganggu penonton?",
          options: ["Gambar sedikit buram", "Suara bergema dan tidak jelas", "Background sederhana", "Tidak pakai filter"],
          answerIndex: 1,
          explanation: "Penonton cepat pergi jika suara sulit didengar.",
        },
      ],
      practice: "Rekam 15 detik di dua lokasi berbeda di rumahmu. Bandingkan cahaya dan suaranya.",
    },
    {
      id: "editing-basics",
      title: "Editing Basics",
      minutes: 12,
      summary: "Edit untuk mempertahankan perhatian: potong jeda, tambah teks, ubah visual.",
      transcript: [
        "Kontenin tidak menggantikan aplikasi edit seperti CapCut atau Canva — kamu tetap pakai alat favoritmu. Yang kita pelajari adalah prinsip edit yang membuat orang bertahan.",
        "Prinsip pertama: potong semua jeda dan 'eee'. Jump cut membuat tempo terasa cepat. Prinsip kedua: tambahkan teks di layar untuk poin penting, karena banyak orang menonton tanpa suara.",
        "Prinsip ketiga: ubah sesuatu di layar setiap 3–5 detik — zoom, b-roll, teks baru, atau sudut kamera. Perubahan visual kecil menjaga mata penonton tetap aktif.",
      ],
      takeaways: [
        "Potong jeda dan kata pengisi.",
        "Teks di layar untuk penonton tanpa suara.",
        "Perubahan visual setiap 3–5 detik.",
      ],
      examples: [
        {
          label: "Checklist edit 5 menit",
          strong: "1) Potong jeda 2) Tambah teks hook di frame pertama 3) Subtitle otomatis 4) Zoom di poin penting 5) Musik pelan di bawah suara.",
          note: "Checklist yang sama bisa dipakai di CapCut maupun aplikasi lain.",
        },
      ],
      quiz: [
        {
          question: "Kenapa teks di layar penting?",
          options: ["Supaya terlihat ramai", "Banyak orang menonton tanpa suara", "Wajib dari platform", "Untuk menutupi wajah"],
          answerIndex: 1,
          explanation: "Teks membantu pesan tetap tersampaikan meski suara dimatikan.",
        },
      ],
      practice: "Edit video latihanmu dengan checklist 5 menit di aplikasi edit favoritmu.",
    },
    {
      id: "content-distribution",
      title: "Content Distribution",
      minutes: 10,
      summary: "Upload bukan akhir. Caption, waktu posting, dan repurpose memperluas jangkauan.",
      transcript: [
        "Setelah video selesai, masih ada pekerjaan penting: distribusi. Caption yang baik menambah konteks dan memancing komentar. Akhiri caption dengan pertanyaan sederhana yang mudah dijawab.",
        "Satu video bisa dipakai di beberapa platform: TikTok, Instagram Reels, dan YouTube Shorts. Sesuaikan sedikit — caption, hashtag, dan cover — tapi isinya tetap sama.",
        "Terakhir, balas komentar di jam pertama. Interaksi awal memberi sinyal ke algoritma bahwa videomu memicu percakapan, dan membangun hubungan dengan penonton pertamamu.",
      ],
      takeaways: [
        "Akhiri caption dengan pertanyaan yang mudah dijawab.",
        "Repurpose satu video ke 3 platform.",
        "Balas komentar di jam pertama setelah upload.",
      ],
      examples: [
        {
          label: "Caption pasif vs caption mengajak",
          weak: "Tips belajar.",
          strong: "Teknik ini menyelamatkan UTS aku. Kamu tim belajar malam atau pagi? 👇",
          note: "Pertanyaan sederhana menurunkan hambatan untuk berkomentar.",
        },
      ],
      quiz: [
        {
          question: "Kapan waktu terbaik membalas komentar?",
          options: ["Seminggu kemudian", "Di jam pertama setelah upload", "Tidak perlu dibalas", "Hanya komentar positif"],
          answerIndex: 1,
          explanation: "Interaksi awal membantu distribusi dan membangun komunitas.",
        },
      ],
      practice: "Tulis caption untuk video latihanmu yang diakhiri dengan pertanyaan, lalu siapkan versi untuk 2 platform.",
    },
  ],
}
