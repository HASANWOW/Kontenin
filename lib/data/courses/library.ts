import type { Course, Lesson, LessonExample, QuizQuestion } from "@/types/domain"

function lesson(
  id: string,
  title: string,
  minutes: number,
  summary: string,
  transcript: string[],
  takeaways: string[],
  example: LessonExample,
  quiz: QuizQuestion,
  practice: string
): Lesson {
  return { id, title, minutes, summary, transcript, takeaways, examples: [example], quiz: [quiz], practice }
}

export const LIBRARY: Course[] = [
  {
    id: "niche-finder",
    title: "Find Your Niche in 7 Days",
    description: "Latihan harian untuk menemukan niche yang spesifik, realistis, dan kamu nikmati.",
    category: "Finding Your Niche",
    difficulty: "beginner",
    instructor: { name: "Raka Pratama", role: "Creator coach" },
    rating: 4.7,
    reviews: 642,
    hue: 200,
    overview: "Tujuh langkah singkat untuk berpindah dari 'aku mau bikin konten apa ya?' ke pernyataan niche yang jelas dan bisa diuji.",
    outcomes: ["Memetakan minat dan keahlian", "Memvalidasi niche dengan data sederhana", "Menulis pernyataan niche"],
    lessons: [
      lesson(
        "interest-map",
        "Map Your Interests",
        8,
        "Tulis semua hal yang kamu suka dan kuasai, lalu cari irisannya.",
        [
          "Ambil kertas dan buat dua kolom: hal yang kamu nikmati, dan hal yang sering orang tanyakan padamu. Jangan disaring — tulis sebanyak mungkin dalam 5 menit.",
          "Lingkari hal yang muncul di kedua kolom. Itulah kandidat niche-mu: kamu cukup suka untuk konsisten, dan cukup tahu untuk membantu orang lain.",
        ],
        ["Tulis tanpa menyaring selama 5 menit.", "Cari irisan antara minat dan hal yang sering ditanyakan.", "Kandidat niche harus bisa kamu bahas 50 kali."],
        { label: "Contoh irisan", strong: "Suka: masak, hemat, kopi. Sering ditanya: resep murah, cara atur uang kos → Niche: masak hemat anak kos.", note: "Irisan yang jelas memudahkan ide konten." },
        { question: "Apa tujuan memetakan minat?", options: ["Mencari tren", "Menemukan irisan minat dan keahlian", "Menentukan jadwal upload", "Memilih kamera"], answerIndex: 1, explanation: "Irisan membuat kamu bisa konsisten dan bermanfaat sekaligus." },
        "Buat peta minat 5 menit dan lingkari 3 kandidat niche."
      ),
      lesson(
        "validate-niche",
        "Validate With Real Demand",
        10,
        "Cek apakah orang benar-benar mencari topik niche-mu.",
        [
          "Ketik topik niche-mu di kolom pencarian TikTok dan YouTube. Perhatikan saran pencarian otomatis — itu adalah hal yang benar-benar diketik orang.",
          "Lihat 10 video teratas. Kalau banyak video dengan view tinggi tapi kualitasnya biasa saja, itu tanda permintaan ada dan masih ada ruang untukmu.",
        ],
        ["Saran pencarian = permintaan nyata.", "View tinggi + kualitas biasa = peluang.", "Catat pertanyaan yang belum terjawab di komentar."],
        { label: "Sinyal peluang", strong: "Video 'resep rice cooker' dengan 800 ribu views tapi pencahayaan gelap dan tanpa takaran jelas.", note: "Kamu bisa membuat versi yang lebih jelas." },
        { question: "Sinyal bahwa niche masih punya ruang adalah…", options: ["Tidak ada video sama sekali", "View tinggi tapi kualitas biasa", "Semua video dari brand besar", "Komentar dimatikan"], answerIndex: 1, explanation: "Permintaan ada, dan standar kualitas masih bisa kamu lampaui." },
        "Cari 3 kandidat niche-mu dan catat 5 saran pencarian otomatis untuk masing-masing."
      ),
      lesson(
        "niche-statement",
        "Write Your Niche Statement",
        7,
        "Rangkum niche-mu dalam satu kalimat yang memandu semua kontenmu.",
        [
          "Pernyataan niche adalah kompas. Setiap kali ragu mau bikin video apa, kembali ke kalimat ini.",
          "Format: 'Aku bikin konten [topik] untuk [audiens] yang [masalah], lewat [format].' Tempel di bio atau di catatan HP-mu.",
        ],
        ["Pernyataan niche = kompas konten.", "Sertakan topik, audiens, masalah, format.", "Revisi setiap 30 video berdasarkan data."],
        { label: "Pernyataan niche", weak: "Konten tentang produktivitas.", strong: "Aku bikin konten produktivitas untuk mahasiswa rantau yang susah atur waktu, lewat video 30 detik dan rutinitas harian.", note: "Spesifik dan bisa diuji." },
        { question: "Kapan sebaiknya pernyataan niche direvisi?", options: ["Setiap hari", "Setelah sekitar 30 video dengan data", "Tidak pernah", "Saat follower turun sehari"], answerIndex: 1, explanation: "Butuh data yang cukup untuk tahu apa yang berhasil." },
        "Tulis pernyataan niche-mu dan selesaikan misi 'Find Your Content Niche'."
      ),
    ],
  },
  {
    id: "audience-insight",
    title: "Know Your Audience",
    description: "Pahami siapa yang menonton, apa yang mereka butuhkan, dan bahasa yang mereka pakai.",
    category: "Understanding Audience",
    difficulty: "beginner",
    instructor: { name: "Dewi Lestari", role: "Social media strategist" },
    rating: 4.6,
    reviews: 410,
    hue: 330,
    overview: "Belajar membuat persona penonton dan menggali insight dari komentar, DM, dan analytics.",
    outcomes: ["Membuat persona penonton", "Menggali insight dari komentar", "Menyesuaikan gaya bahasa"],
    lessons: [
      lesson(
        "persona",
        "Build a Viewer Persona",
        9,
        "Gambarkan satu penonton ideal secara detail.",
        [
          "Beri nama persona-mu, misalnya 'Rina, 20 tahun, mahasiswi rantau di Jogja'. Tulis jadwal hariannya, apa yang dia khawatirkan, dan kapan dia membuka TikTok.",
          "Sebelum menulis script, tanyakan: apakah Rina akan berhenti scroll untuk ini? Pertanyaan sederhana ini membuat kontenmu lebih tajam.",
        ],
        ["Beri nama dan detail pada persona.", "Pahami kapan dan kenapa dia membuka aplikasi.", "Uji setiap ide dengan persona."],
        { label: "Persona singkat", strong: "Rina, 20, mahasiswi rantau. Uang bulanan Rp1,5 juta. Buka TikTok sebelum tidur. Khawatir nilai dan keuangan.", note: "Detail membuat keputusan konten lebih mudah." },
        { question: "Fungsi utama persona adalah…", options: ["Hiasan presentasi", "Menguji apakah ide relevan untuk penonton", "Menentukan musik", "Menghitung follower"], answerIndex: 1, explanation: "Persona membantu menyaring ide dari sudut pandang penonton." },
        "Tulis persona penonton idealmu dalam 5 kalimat."
      ),
      lesson(
        "comment-mining",
        "Comment Mining",
        8,
        "Gali pertanyaan dan keluhan asli dari kolom komentar.",
        [
          "Buka 5 video populer di niche-mu dan salin komentar yang berisi pertanyaan atau keluhan. Kelompokkan berdasarkan tema.",
          "Tema yang paling sering muncul adalah ide video dengan permintaan terbukti. Gunakan kalimat dari komentar itu sebagai hook.",
        ],
        ["Kumpulkan pertanyaan dan keluhan.", "Kelompokkan berdasarkan tema.", "Pakai kalimat komentar sebagai hook."],
        { label: "Dari komentar ke hook", weak: "Komentar: 'kak kok aku udah diet tapi berat nggak turun2'", strong: "Hook: 'Udah diet tapi berat nggak turun-turun? Mungkin ini yang kamu lewatkan.'", note: "Bahasa asli audiens terasa sangat relevan." },
        { question: "Tema komentar yang sering muncul sebaiknya…", options: ["Diabaikan", "Dijadikan ide video", "Dilaporkan", "Dihapus"], answerIndex: 1, explanation: "Itu adalah permintaan yang sudah terbukti." },
        "Kumpulkan 20 komentar dan ubah 3 tema teratas menjadi hook."
      ),
    ],
  },
  {
    id: "idea-machine",
    title: "The Idea Machine",
    description: "Sistem untuk menghasilkan 30 ide konten dalam satu sesi tanpa menunggu inspirasi.",
    category: "Content Ideas",
    difficulty: "beginner",
    instructor: { name: "Nadia Putri", role: "Educator & creator, 480K followers" },
    rating: 4.8,
    reviews: 733,
    hue: 45,
    overview: "Pelajari pilar konten, matriks format, dan cara menyimpan ide agar kamu tidak pernah kehabisan bahan.",
    outcomes: ["Menentukan 3 pilar konten", "Memakai matriks format", "Membangun bank ide"],
    lessons: [
      lesson(
        "content-pillars",
        "Content Pillars",
        9,
        "Tiga pilar konten menjaga variasi tanpa kehilangan fokus.",
        [
          "Pilar konten adalah 3 kategori besar yang kamu bahas berulang kali. Misalnya untuk niche masak hemat: resep, belanja hemat, dan kehidupan anak kos.",
          "Dengan pilar, kamu punya variasi yang tetap konsisten dengan niche — penonton tahu apa yang akan mereka dapat jika follow.",
        ],
        ["Pilih 3 pilar besar.", "Pilar menjaga variasi dan konsistensi.", "Rotasi pilar setiap minggu."],
        { label: "Contoh pilar", strong: "Niche produktivitas mahasiswa → (1) teknik belajar (2) atur waktu (3) behind the scenes kehidupan kampus.", note: "Pilar ketiga sering jadi pembangun kedekatan." },
        { question: "Berapa pilar yang disarankan untuk pemula?", options: ["1", "3", "10", "Tidak perlu"], answerIndex: 1, explanation: "Tiga pilar cukup untuk variasi tanpa kehilangan fokus." },
        "Tentukan 3 pilar konten untuk niche-mu."
      ),
      lesson(
        "format-matrix",
        "The Format Matrix",
        11,
        "Kalikan pilar dengan format untuk menghasilkan puluhan ide.",
        [
          "Buat tabel: baris berisi pilar, kolom berisi format — tutorial, kesalahan, eksperimen, POV, storytime, review. Setiap sel adalah satu ide.",
          "Tiga pilar dikali enam format sudah menghasilkan 18 ide. Ulangi dengan masalah audiens yang berbeda dan kamu tidak akan kehabisan bahan.",
        ],
        ["Pilar × format = ide.", "6 format andalan untuk short-form.", "Isi tabel tanpa menyaring dulu."],
        { label: "Satu sel matriks", strong: "Pilar 'atur waktu' × format 'eksperimen' → 'Aku coba time blocking selama 7 hari sebagai mahasiswa'.", note: "Satu sel, satu video siap ditulis." },
        { question: "3 pilar × 6 format menghasilkan berapa ide?", options: ["9", "18", "36", "6"], answerIndex: 1, explanation: "3 × 6 = 18 ide dari satu sesi." },
        "Isi matriks 3×6 untuk niche-mu dan simpan ke Content Planner."
      ),
    ],
  },
  {
    id: "story-craft",
    title: "Storytelling for Short Videos",
    description: "Bungkus tips dan pengalaman menjadi cerita 30–60 detik yang diingat.",
    category: "Storytelling",
    difficulty: "intermediate",
    instructor: { name: "Bima Aditya", role: "Filmmaker & storyteller" },
    rating: 4.9,
    reviews: 388,
    hue: 15,
    overview: "Teknik bercerita film, diringkas untuk format vertikal: tegangan, detail, dan payoff.",
    outcomes: ["Memakai struktur 3 babak mini", "Membangun tegangan sejak detik pertama", "Menutup cerita dengan payoff"],
    lessons: [
      lesson(
        "mini-three-act",
        "The Mini Three-Act Structure",
        12,
        "Situasi, konflik, perubahan — dipadatkan jadi 30 detik.",
        [
          "Babak pertama hanya satu kalimat: siapa dan di mana. Babak kedua adalah konflik — bagian terpanjang. Babak ketiga adalah perubahan dan pelajaran.",
          "Di short-form, mulai dari konflik lalu kilas balik ke situasi jika perlu. Penonton butuh alasan untuk bertahan sejak detik pertama.",
        ],
        ["Babak 1: satu kalimat konteks.", "Babak 2: konflik — paling panjang.", "Babak 3: perubahan + pelajaran."],
        { label: "Mulai dari konflik", weak: "Jadi waktu itu aku lagi kuliah semester dua…", strong: "Aku hampir di-DO gara-gara satu kebiasaan kecil.", note: "Konflik di awal langsung membangun tegangan." },
        { question: "Bagian terpanjang dalam struktur mini tiga babak adalah…", options: ["Situasi", "Konflik", "CTA", "Judul"], answerIndex: 1, explanation: "Konflik adalah mesin yang membuat penonton bertahan." },
        "Tulis ulang pengalamanmu menjadi cerita 3 babak yang dimulai dari konflik."
      ),
      lesson(
        "payoff",
        "Land the Payoff",
        9,
        "Akhir cerita yang memuaskan membuat orang menonton ulang dan membagikan.",
        [
          "Payoff adalah momen 'oh, begitu' di akhir cerita. Payoff yang baik menjawab pertanyaan yang kamu tanam di awal.",
          "Hindari akhir yang menggantung tanpa alasan. Jika ingin membuat part 2, tetap beri satu jawaban kecil supaya penonton puas.",
        ],
        ["Payoff menjawab pertanyaan dari hook.", "Beri kepuasan kecil walau ada part 2.", "Payoff kuat memicu rewatch dan share."],
        { label: "Hook dan payoff", strong: "Hook: 'Kenapa aku berhenti beli kopi kekinian?' → Payoff: 'Karena dalam sebulan ternyata habis Rp840 ribu — setara satu tiket pulang kampung.'", note: "Angka spesifik membuat payoff terasa nyata." },
        { question: "Payoff yang baik…", options: ["Mengabaikan hook", "Menjawab pertanyaan yang ditanam di awal", "Selalu berupa CTA", "Harus lucu"], answerIndex: 1, explanation: "Payoff menutup loop rasa penasaran dari hook." },
        "Tulis 3 pasangan hook → payoff untuk cerita-ceritamu."
      ),
    ],
  },
  {
    id: "hook-lab",
    title: "Hook Lab",
    description: "Latihan intensif menulis, menilai, dan memperbaiki hook dengan feedback AI.",
    category: "Hook Writing",
    difficulty: "intermediate",
    instructor: { name: "Nadia Putri", role: "Educator & creator, 480K followers" },
    rating: 4.9,
    reviews: 956,
    hue: 280,
    overview: "Bedah 5 pola hook, pelajari visual hook, dan latih kemampuan menilai hook milikmu sendiri.",
    outcomes: ["Menguasai 5 pola hook", "Menambahkan visual hook", "Menilai hook secara objektif"],
    lessons: [
      lesson(
        "five-patterns",
        "Five Hook Patterns",
        13,
        "Pertanyaan, pernyataan berani, angka, before–after, dan pembuka cerita.",
        [
          "Setiap pola memicu emosi berbeda. Pertanyaan memicu rasa ingin tahu, pernyataan berani memicu reaksi, angka memberi kredibilitas, before–after memberi bukti, dan pembuka cerita memberi empati.",
          "Kenali pola yang paling cocok dengan niche-mu, tapi tetap variasikan agar penonton tidak bosan.",
        ],
        ["5 pola, 5 emosi berbeda.", "Sesuaikan pola dengan niche.", "Variasikan pola setiap minggu."],
        { label: "Satu topik, lima pola", strong: "Topik bangun pagi: (1) Kenapa kamu tetap ngantuk walau tidur 8 jam? (2) Alarm itu musuhmu. (3) 3 kebiasaan jam 9 malam. (4) Dulu bangun jam 10, sekarang jam 5. (5) Hari itu aku telat ujian…", note: "Topik sama, rasa berbeda." },
        { question: "Pola hook yang memberi kredibilitas adalah…", options: ["Pertanyaan", "Angka spesifik", "Sapaan", "Musik"], answerIndex: 1, explanation: "Angka membuat klaim terasa terukur dan nyata." },
        "Tulis satu topik dalam 5 pola hook berbeda."
      ),
      lesson(
        "visual-hooks",
        "Visual Hooks",
        8,
        "Frame pertama harus sama kuatnya dengan kalimat pertama.",
        [
          "Banyak penonton menonton tanpa suara. Frame pertama perlu gerakan atau teks yang langsung menjelaskan apa yang akan terjadi.",
          "Teknik sederhana: mulai di tengah aksi, tampilkan hasil akhir dulu, atau taruh teks hook besar di sepertiga atas layar.",
        ],
        ["Frame pertama butuh gerakan atau teks.", "Mulai di tengah aksi.", "Tampilkan hasil akhir lebih dulu."],
        { label: "Visual hook", strong: "Frame pertama: piring nasi goreng yang sudah jadi + teks 'Cuma pakai rice cooker'.", note: "Hasil akhir di awal langsung menjawab 'kenapa harus nonton'." },
        { question: "Kenapa frame pertama penting?", options: ["Untuk thumbnail saja", "Banyak orang menonton tanpa suara", "Supaya video lebih panjang", "Tidak penting"], answerIndex: 1, explanation: "Tanpa suara, visual-lah yang harus menghentikan scroll." },
        "Rancang frame pertama untuk 3 hook terbaikmu."
      ),
    ],
  },
  {
    id: "script-sprint",
    title: "Script Sprint",
    description: "Tulis script 30 dan 60 detik yang padat, natural, dan mudah direkam.",
    category: "Script Writing",
    difficulty: "intermediate",
    instructor: { name: "Raka Pratama", role: "Creator coach" },
    rating: 4.7,
    reviews: 512,
    hue: 160,
    overview: "Template script, teknik menyunting, dan cara membaca script tanpa terdengar kaku.",
    outcomes: ["Memakai template script", "Menyunting jadi lebih padat", "Membaca script dengan natural"],
    lessons: [
      lesson(
        "script-templates",
        "Script Templates",
        10,
        "Tiga template siap pakai: tips, cerita, dan opini.",
        [
          "Template tips: hook masalah → 3 langkah → hasil → CTA. Template cerita: konflik → kilas balik → perubahan → pelajaran. Template opini: pernyataan berani → alasan → contoh → ajakan diskusi.",
          "Template mempercepat proses, tapi isi tetap harus datang dari pengalaman dan sudut pandangmu.",
        ],
        ["Tiga template: tips, cerita, opini.", "Template mempercepat, bukan menggantikan isi.", "Pilih template sesuai tujuan video."],
        { label: "Template opini", strong: "Unpopular opinion: kamu nggak butuh kamera baru. (alasan) (contoh kreator besar pakai HP) Kamu setuju? Tulis di komentar.", note: "Format opini memancing diskusi." },
        { question: "Template yang paling cocok untuk memancing diskusi adalah…", options: ["Tips", "Cerita", "Opini", "Tutorial"], answerIndex: 2, explanation: "Opini mengundang orang setuju atau tidak setuju." },
        "Tulis satu script dengan masing-masing template."
      ),
      lesson(
        "tighten",
        "Tighten Every Line",
        9,
        "Hapus 30% kata tanpa kehilangan makna.",
        [
          "Draf pertama selalu terlalu panjang. Baca keras-keras dan hapus kata seperti 'jadi', 'sebenarnya', 'nah', dan kalimat pembuka yang mengulang.",
          "Target sederhana: potong 30% dari draf pertama. Script yang padat terdengar lebih percaya diri.",
        ],
        ["Baca keras-keras saat menyunting.", "Hapus kata pengisi.", "Potong 30% dari draf pertama."],
        { label: "Sebelum dan sesudah", weak: "Jadi sebenarnya ada satu cara nih yang menurut aku cukup efektif untuk bisa bangun pagi.", strong: "Satu cara efektif untuk bangun pagi:", note: "Dari 16 kata jadi 6 kata." },
        { question: "Target pemangkasan draf pertama adalah sekitar…", options: ["5%", "30%", "80%", "Tidak perlu"], answerIndex: 1, explanation: "Sekitar 30% biasanya menghapus pengulangan tanpa kehilangan isi." },
        "Ambil script terakhirmu dan potong 30% kata-katanya."
      ),
    ],
  },
  {
    id: "phone-camera",
    title: "Camera Basics with Your Phone",
    description: "Cahaya, suara, dan framing yang rapi hanya dengan HP.",
    category: "Camera Basics",
    difficulty: "beginner",
    instructor: { name: "Bima Aditya", role: "Filmmaker & storyteller" },
    rating: 4.6,
    reviews: 298,
    hue: 190,
    overview: "Setup rekaman budget minim yang terlihat profesional.",
    outcomes: ["Mengatur cahaya alami", "Merekam suara jernih", "Framing vertikal yang rapi"],
    lessons: [
      lesson(
        "light",
        "Natural Light",
        8,
        "Jendela adalah lampu terbaik dan gratis.",
        [
          "Hadapkan wajah ke jendela, bukan membelakangi. Hindari cahaya matahari langsung yang keras — waktu terbaik biasanya pagi atau sore.",
          "Jika cahaya terlalu kuat, tutup jendela dengan gorden tipis sebagai diffuser.",
        ],
        ["Hadap ke jendela.", "Hindari sinar matahari langsung.", "Gorden tipis = diffuser gratis."],
        { label: "Setup cahaya", strong: "Meja menghadap jendela jam 8 pagi, gorden putih tipis, HP di tumpukan buku.", note: "Hasilnya wajah terang tanpa bayangan keras." },
        { question: "Posisi terbaik terhadap jendela adalah…", options: ["Membelakangi jendela", "Menghadap jendela", "Di samping lampu kamar", "Tidak berpengaruh"], answerIndex: 1, explanation: "Cahaya dari depan menerangi wajah secara merata." },
        "Rekam 10 detik menghadap jendela dan 10 detik membelakangi. Bandingkan."
      ),
      lesson(
        "audio",
        "Clean Audio",
        9,
        "Suara jernih membuat penonton bertahan.",
        [
          "Gema adalah musuh terbesar. Ruangan kosong dengan dinding keras memantulkan suara. Rekam di ruangan kecil dengan banyak kain.",
          "Dekatkan mic ke mulut. Jika memakai mic HP, rekam dari jarak sekitar satu lengan dan hindari kipas angin atau AC yang berisik.",
        ],
        ["Hindari ruangan kosong yang bergema.", "Dekatkan mic ke mulut.", "Matikan sumber bising."],
        { label: "Trik suara", strong: "Voice over di dalam lemari baju atau di bawah selimut terdengar seperti studio.", note: "Kain menyerap pantulan suara." },
        { question: "Penyebab utama suara jelek di rumah adalah…", options: ["HP lama", "Gema ruangan", "Bahasa", "Durasi"], answerIndex: 1, explanation: "Pantulan dari dinding keras membuat suara bergema." },
        "Rekam satu kalimat di 3 ruangan berbeda dan pilih yang paling jernih."
      ),
    ],
  },
  {
    id: "edit-for-retention",
    title: "Editing for Retention",
    description: "Prinsip edit yang membuat orang menonton sampai habis — di aplikasi apa pun.",
    category: "Editing Basics",
    difficulty: "intermediate",
    instructor: { name: "Sari Wulandari", role: "Video editor" },
    rating: 4.7,
    reviews: 467,
    hue: 300,
    overview: "Jump cut, teks, b-roll, dan ritme. Praktikkan di CapCut, Canva, atau editor favoritmu.",
    outcomes: ["Membuat ritme dengan jump cut", "Menambahkan teks dan subtitle", "Menyisipkan b-roll yang relevan"],
    lessons: [
      lesson(
        "rhythm",
        "Rhythm and Jump Cuts",
        10,
        "Ritme cepat menjaga perhatian.",
        [
          "Potong setiap jeda lebih dari setengah detik. Jump cut membuat video terasa bergerak walau kamu hanya bicara ke kamera.",
          "Variasikan dengan zoom kecil di poin penting untuk memberi penekanan.",
        ],
        ["Potong jeda > 0,5 detik.", "Zoom kecil untuk penekanan.", "Ritme mengikuti energi bicara."],
        { label: "Ritme", strong: "Kalimat → potong → zoom 110% di kata kunci → potong → kembali normal.", note: "Pola sederhana yang menjaga mata tetap aktif." },
        { question: "Jeda berapa lama yang sebaiknya dipotong?", options: ["Lebih dari 0,5 detik", "Lebih dari 5 detik", "Tidak perlu dipotong", "Hanya di akhir"], answerIndex: 0, explanation: "Jeda pendek pun terasa lambat di short-form." },
        "Edit 30 detik talking head dengan jump cut dan dua zoom penekanan."
      ),
      lesson(
        "text-broll",
        "Text and B-roll",
        9,
        "Visual pendukung membuat penjelasan lebih mudah dipahami.",
        [
          "Tambahkan teks hook di frame pertama dan subtitle di sepanjang video. Gunakan warna penekanan untuk kata kunci.",
          "B-roll adalah gambar pendukung: tangan yang sedang praktik, layar HP, atau hasil akhir. Sisipkan b-roll setiap kali kamu menyebut sesuatu yang bisa ditunjukkan.",
        ],
        ["Teks hook di frame pertama.", "Subtitle dengan kata kunci berwarna.", "B-roll saat menyebut sesuatu yang bisa ditunjukkan."],
        { label: "Kapan pakai b-roll", strong: "Saat bilang 'aku pakai aplikasi ini' → tampilkan rekaman layar aplikasinya.", note: "Show, don't tell." },
        { question: "Kapan b-roll sebaiknya disisipkan?", options: ["Secara acak", "Saat menyebut sesuatu yang bisa ditunjukkan", "Hanya di awal", "Tidak perlu"], answerIndex: 1, explanation: "B-roll memperjelas apa yang sedang dibicarakan." },
        "Tambahkan subtitle dan 3 b-roll ke video latihanmu."
      ),
    ],
  },
  {
    id: "personal-brand",
    title: "Personal Branding for Creators",
    description: "Bangun identitas yang membuat orang mengenali dan mempercayaimu.",
    category: "Personal Branding",
    difficulty: "intermediate",
    instructor: { name: "Dewi Lestari", role: "Social media strategist" },
    rating: 4.8,
    reviews: 544,
    hue: 240,
    overview: "Positioning, visual identity sederhana, dan konsistensi pesan di semua platform.",
    outcomes: ["Menentukan positioning", "Membuat ciri khas visual", "Menulis bio yang jelas"],
    lessons: [
      lesson(
        "positioning",
        "Positioning",
        10,
        "Apa yang membuatmu berbeda dari kreator lain di niche yang sama?",
        [
          "Positioning adalah sudut pandang unikmu. Bisa dari latar belakang, gaya penyampaian, atau nilai yang kamu pegang.",
          "Contoh: banyak kreator keuangan, tapi kamu adalah 'mahasiswa akuntansi yang menjelaskan keuangan dengan bahasa tongkrongan'.",
        ],
        ["Positioning = sudut pandang unik.", "Gabungkan latar belakang + gaya + nilai.", "Ulangi positioning di bio dan konten."],
        { label: "Positioning", weak: "Kreator tips keuangan.", strong: "Mahasiswa akuntansi yang menjelaskan keuangan pakai bahasa tongkrongan.", note: "Lebih mudah diingat dan dibedakan." },
        { question: "Positioning yang kuat berasal dari…", options: ["Meniru kreator besar", "Sudut pandang unikmu", "Jumlah upload", "Hashtag"], answerIndex: 1, explanation: "Keunikan membuat orang mengingatmu." },
        "Tulis positioning-mu dalam satu kalimat."
      ),
      lesson(
        "bio",
        "Write a Bio That Converts",
        7,
        "Bio menjawab: siapa kamu, untuk siapa, dan kenapa harus follow.",
        [
          "Bio yang baik terdiri dari tiga baris: siapa kamu, apa yang kamu bantu, dan ajakan. Hindari bio yang hanya berisi kutipan atau emoji.",
          "Calon follower membaca bio dalam 2 detik setelah menonton video. Pastikan bio melanjutkan janji dari videomu.",
        ],
        ["Tiga baris: siapa, bantu apa, ajakan.", "Hindari bio kutipan saja.", "Bio melanjutkan janji video."],
        { label: "Bio", weak: "✨ live laugh love ✨", strong: "Mahasiswa rantau 🎓\nBantu kamu hemat & produktif\n⬇️ Template budgeting gratis", note: "Jelas dalam 2 detik." },
        { question: "Berapa lama calon follower membaca bio?", options: ["Sekitar 2 detik", "1 menit", "5 menit", "Tidak dibaca"], answerIndex: 0, explanation: "Bio harus dipahami sekilas." },
        "Tulis ulang bio-mu dengan format tiga baris."
      ),
    ],
  },
  {
    id: "analytics-101",
    title: "Reading Your Analytics",
    description: "Pahami retention, engagement, dan sumber trafik untuk keputusan konten yang lebih baik.",
    category: "Analytics",
    difficulty: "intermediate",
    instructor: { name: "Raka Pratama", role: "Creator coach" },
    rating: 4.6,
    reviews: 321,
    hue: 175,
    overview: "Berhenti menebak. Gunakan tiga metrik utama untuk memperbaiki video berikutnya.",
    outcomes: ["Membaca grafik retention", "Menghitung engagement rate", "Membuat eksperimen konten"],
    lessons: [
      lesson(
        "retention",
        "Retention Curves",
        11,
        "Grafik retention menunjukkan di detik mana penonton pergi.",
        [
          "Penurunan tajam di 3 detik pertama berarti hook belum bekerja. Penurunan di tengah berarti ada bagian yang lambat atau tidak relevan.",
          "Bandingkan grafik retention antar video. Pola yang berulang adalah petunjuk paling jujur tentang apa yang perlu diperbaiki.",
        ],
        ["Turun di awal = masalah hook.", "Turun di tengah = bagian lambat.", "Cari pola antar video."],
        { label: "Membaca retention", strong: "Video A: 45% bertahan di detik 3. Video B: 72%. Bedanya: video B dimulai dengan hasil akhir.", note: "Data memberi tahu pola hook yang berhasil." },
        { question: "Penurunan tajam di 3 detik pertama menandakan…", options: ["Musik jelek", "Hook belum bekerja", "Video terlalu pendek", "Caption salah"], answerIndex: 1, explanation: "Penonton belum menemukan alasan untuk bertahan." },
        "Buka analytics 3 video terakhirmu dan catat di detik berapa penonton paling banyak pergi."
      ),
      lesson(
        "engagement",
        "Engagement Rate",
        8,
        "Engagement rate = (like + komentar + share) ÷ views.",
        [
          "Views besar belum tentu berarti audiens peduli. Engagement rate menunjukkan seberapa banyak penonton yang benar-benar bereaksi.",
          "Untuk short-form, engagement rate 4–8% sudah tergolong sehat. Bandingkan dengan rata-ratamu sendiri, bukan dengan kreator lain.",
        ],
        ["Rumus: interaksi ÷ views.", "4–8% tergolong sehat.", "Bandingkan dengan rata-ratamu sendiri."],
        { label: "Menghitung", strong: "10.000 views, 600 like, 80 komentar, 40 share → (600+80+40)/10.000 = 7,2%.", note: "Engagement sehat untuk short-form." },
        { question: "Engagement rate dihitung dari…", options: ["Follower ÷ views", "Interaksi ÷ views", "Like saja", "Durasi ÷ views"], answerIndex: 1, explanation: "Interaksi dibagi views menunjukkan persentase penonton yang bereaksi." },
        "Hitung engagement rate 5 video terakhirmu dan cari yang tertinggi."
      ),
    ],
  },
  {
    id: "monetization-start",
    title: "Your First Rupiah as a Creator",
    description: "Jalur monetisasi realistis untuk kreator kecil: affiliate, brand deal, dan produk digital.",
    category: "Monetization",
    difficulty: "advanced",
    instructor: { name: "Dewi Lestari", role: "Social media strategist" },
    rating: 4.7,
    reviews: 389,
    hue: 140,
    overview: "Kamu tidak perlu 100 ribu follower untuk mulai menghasilkan. Pelajari jalur yang cocok dengan ukuran audiensmu.",
    outcomes: ["Memilih jalur monetisasi", "Menyiapkan media kit sederhana", "Menetapkan rate card awal"],
    lessons: [
      lesson(
        "paths",
        "Monetization Paths",
        10,
        "Affiliate, brand deal, jasa, dan produk digital — mana yang cocok untukmu?",
        [
          "Affiliate cocok untuk niche review dan rekomendasi produk. Brand deal mulai mungkin di 5–10 ribu follower dengan engagement yang sehat. Jasa dan produk digital cocok untuk niche edukasi.",
          "Pilih satu jalur yang paling dekat dengan isi kontenmu. Monetisasi yang tidak sesuai niche akan menurunkan kepercayaan.",
        ],
        ["Affiliate untuk niche review.", "Brand deal mulai di 5–10 ribu follower.", "Pilih jalur yang sesuai niche."],
        { label: "Jalur sesuai niche", strong: "Niche masak hemat → affiliate peralatan dapur murah + e-book 30 resep rice cooker.", note: "Produk relevan dengan kebutuhan audiens." },
        { question: "Kenapa monetisasi harus sesuai niche?", options: ["Supaya lebih mahal", "Agar tidak menurunkan kepercayaan audiens", "Wajib dari platform", "Tidak perlu sesuai"], answerIndex: 1, explanation: "Audiens follow karena niche-mu; produk yang tidak relevan terasa memaksa." },
        "Tentukan satu jalur monetisasi yang paling cocok dengan niche-mu."
      ),
      lesson(
        "media-kit",
        "Simple Media Kit",
        9,
        "Satu halaman yang menjelaskan siapa kamu dan apa yang bisa kamu tawarkan ke brand.",
        [
          "Media kit berisi: profil singkat, niche, demografi audiens, statistik utama (views rata-rata dan engagement rate), contoh konten, dan paket kerja sama.",
          "Brand lebih peduli pada engagement dan kecocokan audiens daripada jumlah follower semata.",
        ],
        ["Isi: profil, audiens, statistik, contoh, paket.", "Engagement > jumlah follower.", "Perbarui setiap bulan."],
        { label: "Statistik utama", strong: "Rata-rata 12 ribu views/video • ER 7,4% • 68% audiens usia 18–24 • 61% perempuan.", note: "Angka spesifik membangun kepercayaan brand." },
        { question: "Apa yang paling dipedulikan brand selain follower?", options: ["Warna feed", "Engagement dan kecocokan audiens", "Jumlah hashtag", "Umur akun"], answerIndex: 1, explanation: "Brand ingin pesan mereka sampai ke audiens yang tepat dan aktif." },
        "Susun draf media kit satu halaman."
      ),
    ],
  },
]
