# 00 — JEBAT MASTER ENGINEERING AUDIT & STRATEGIC SYNTHESIS

**Project:** LAMBORGHINI — THE ART OF MOTION  
**Lead AI Orchestrator & Principal Engineering Manager:** JEBAT  
**Date of Synthesis:** 12 October 2026  
**Mission Classification:** Elite Multi-Agent Technical Audit, Visual Critique, Ecosystem Research & Implementation Blueprint  
**Status:** COMPLETE (All 10 Specialist Audits Synthesized)

---

## 1. Executive Summary & Master Quality Scorecard

### 1.1 Executive Assessment
Projek **LAMBORGHINI — THE ART OF MOTION** kini berada di persimpangan kritikal (critical architectural juncture). Berikutan integrasi pantas prototaip `lamborghini_official_store.html` ke dalam `src/app/Experience.tsx`, laman web ini berjaya membina impak visual awal dan melepasi kompilasi asas Vite, TypeScript, dan unit test sekuens. Aset fotografi (`public/media/`) yang telah diaudit mempunyai gred kurator mewah yang cemerlang (**9.5/10**) dengan perlesenan sah Wikimedia Commons (CC BY-SA 4.0 / CC0 1.0).

Walau bagaimanapun, audit forensik mendalam oleh 10 ejen pakar mendedahkan **tiga krisis struktur utama**:
1. **Pemisahan Senibina (Architectural Bifurcation):** `Experience.tsx` wujud sebagai monolit 540-baris yang memintas (bypasses) hampir 80% komponen modular berkualiti tinggi yang telah dibina sebelum ini di `src/chapters/`, `src/features/`, `src/components/`, dan `src/motion/`.
2. **Kerosakan Aliran & Interaksi (Motion & Ticker Desynchronization):** Enjin lancar Lenis berjalan secara berasingan daripada ticker GSAP (`autoRaf: true` vs `gsap.ticker`), menyebabkan *scroll scrubbing jitter*, teks tajuk seksyen hilang ketika discroll, dan kesan keterlaluan pada skrol mudah alih (mobile horizontal overflow +105px).
3. **Pencerobohan "AI Slop" & Pengabaian Aksesibiliti:** Laman web ini terperangkap dalam estetika e-dagang murah ("Shopify supercar dealer") dengan lencana wireframe mentah (`data-annotation`), tanda harga MSRP yang tidak disahkan, ketiadaan `<main>` landmark, kontras teks gagal WCAG 2.1 AA, dan penghantaran fail gergasi 6.47 MB ke telefon pintar tanpa memanfaatkan varian `-800.webp`.

### 1.2 Master Scorecard Matrix

| Bidang Audit | Ejen Pakar | Skor (0-10) | Status / Keputusan | Isu Utama |
|---|---|---|---|---|
| **UI/UX Engineering** | REKA | **4.4 / 10** | Memerlukan Baik Pulih | Navigasi hilang, hierarki e-dagang murah, kad tanpa kedalaman interaktif |
| **Visual Art Direction** | ARCA | **3.6 / 10** | AI-Slop Kritikal | Lencana wireframe mentah, faux-luxury gold glow, progress bar peratusan palsu |
| **GSAP & Motion Engineering** | GERAK | **3.3 / 10** | Desync / Jitter | Lenis ticker terpisah, tajuk seksyen hilang (`play reverse play reverse`), tiada reduced-motion |
| **Scroll Storytelling** | ALIR | **3.08 / 10** | Terputus Ritma | Tiada kesinambungan sinematik antara bab, teks melompat, tiada ganjaran skrol |
| **Software Architecture** | KOD | **3.8 / 10** | Monolitik | Monolit 540 baris memintas komponen modular, 80% kod sedia ada menjadi 'dead code' |
| **Strict QA Verification** | BENTENG | **7.4 / 10** | Lulus Bersyarat | Lulus typecheck/lint/build, tetapi limpahan mudah alih (+105px) dan `browser-qa.mjs` gagal |
| **GitHub & Skills Ecosystem** | JEJAK | **8.5 / 10** | Rujukan Mantap | Penyelidikan stack mantap: Ticker coupling, Curtains.js/Canvas 2D, Framer Motion |
| **Performance & Accessibility** | PANTAS | **Perf: 6.8 / A11y: 5.9** | Risiko Sederhana | Beban 6.47 MB ke telefon mudah alih, LCP desktop 2.7s (opacity delay), 5 Axe WCAG violations |
| **Visual Asset Director** | LENSA | **9.5 / 10** | Kualiti Tertinggi | 100% foto tulen, model tepat (Revuelto/Temerario/Urus SE), perlesenan sah |
| **WebGL & Cinematic** | SINEMA | **8.4 / 10** | Berdaya Maju | Pelan integrasi Canvas 2D LRU caching & micro-WebGL shader tanpa beban 3D poligon berat |
| **PURATA KESELURUHAN (WEIGHTED)** | **JEBAT** | **5.45 / 10** | **REMEDIATION MANDATORY** | **Potensi estetik tinggi; pelaksanaan teknikal memerlukan refactoring berfasa** |

---

## 2. Status & Hasil 10 Ejen Pakar (Specialist Breakdown)

### 2.1 REKA — Principal UI/UX Engineer (`01_REKA_UIUX_AUDIT.md`)
- **Penemuan:** Pengalaman pengguna terjejas akibat kehilangan navigasi global (header/modal menu hilang terus), kad inventori mempunyai butang "QUICK VIEW" yang mati (tiada modal atau fungsi), borang ujian pandu (test drive) membenarkan penyerahan kosong tanpa sebarang pengesahan input, dan pengalaman mudah alih terasa seperti laman web generik yang dipaksa muat.
- **Syor Utama:** Wujudkan semula navigasi berstrata (Global HUD Header), integrasikan Quick View Modal dengan spesifikasi telemetri penuh, bina semula borang tempahan dengan pengesahan interaktif, dan format semula kad pameran model agar berskala editorial mewah.

### 2.2 ARCA — Anti-AI-Slop Art Director (`02_ARCA_ANTI_SLOP_AUDIT.md`)
- **Penemuan:** Terdapat 7 pelanggaran estetik serius:
  1. *Faux-technical wireframe badges* (`data-annotation="01 // SPEC-HUD"`) yang kelihatan seperti prototaip yang tidak siap.
  2. Palet aksen emas kuning kusam (`#C8A951`) dan merah standard (`#FF3B00`) yang bercanggah dengan bahasa visual monokromatik agresif Lamborghini (*Nero Nemesis*, *Giallo Auge*, *Verde Scandal*).
  3. Bar kemajuan peratusan enjin palsu (88%, 95%) yang kelihatan seperti templat resume web amatur.
  4. Harga MSRP e-dagang yang menjatuhkan martabat jenama daripada sebuah *hypercar art piece* kepada kedai jualan kereta terpakai.
- **Syor Utama:** Beralih ke konsep **"Darkroom Minimalist & Telemetry HUD"** — tipografi monokromatik ketepatan industri, grid asimetri brutalist, dan lencana teknikal yang bermakna.

### 2.3 GERAK — GSAP & Motion Engineer (`03_GERAK_GSAP_AUDIT.md`)
- **Penemuan:** 
  1. Dual-loop RAF conflict: `Lenis({ autoRaf: true })` bertelagah dengan `gsap.ticker.add()`, menyebabkan kegagapan bingkai (frame jitter).
  2. Pinning ScrollTrigger pada `.showroom-container` menggunakan `end: () => '+=' + track.scrollWidth` tanpa menolak `window.innerWidth`, menyebabkan skrol mendatar terlebih lajak dan ruang kosong gelap di penghujung.
  3. ToggleActions `play reverse play reverse` pada tajuk seksyen menyebabkan tajuk hilang secara tiba-tiba apabila pengguna menatal ke tengah seksyen.
  4. Ketiadaan semakan `prefers-reduced-motion` melanggar piawaian kebolehcapaian antarabangsa.
- **Syor Utama:** Sambungkan Lenis terus ke dalam GSAP ticker (`lenis.on('scroll', ScrollTrigger.update)`), baiki formula pinning, tukar toggleActions kepada `play none none reverse`, dan integrasikan `gsap.matchMedia()` untuk mod kurangkan pergerakan.

### 2.4 ALIR — Scroll & Transition Architect (`04_ALIR_SCROLL_STORYTELLING.md`)
- **Penemuan:** Laman web ini kekurangan "ritma pernafasan sinematik" (cinematic pacing). Peralihan antara bab berlaku secara mengejut (hard cuts), pengguna tidak merasai naratif "The Awakening" -> "Telemetry Benchmark" -> "Model Hierarchy" -> "The Road Ahead". Skrol terasa mekanikal dan meletihkan tanpa ganjaran visual mikro.
- **Syor Utama:** Susun semula koreografi skrol kepada 5 Bab Sinematik yang jelas dengan peralihan berasaskan bayang-bayang (*curtain reveal / chiaroscuro vignette fade*), parallax kedalaman 2.5D pada gambar kereta, dan indikator kemajuan skrol bercirikan instrumen kokpit.

### 2.5 KOD — Frontend Software Architect (`05_KOD_ARCHITECTURE_AUDIT.md`)
- **Penemuan:**
  1. `Experience.tsx` mengandungi 540 baris kod monolitik yang menggabungkan state, manipulasi DOM mentah, pembolehubah animasi, dan render markup di satu tempat.
  2. Komponen modular sedia ada di `src/chapters/`, `src/components/`, `src/features/` ditinggalkan terbiar (*dead code*).
  3. Jenis data TypeScript tidak lengkap — data kereta diulang secara manual dalam `Experience.tsx` dan tidak menggunakan `src/data/models.ts` atau `src/data/media.ts`.
- **Syor Utama:** Laksanakan refactoring berperingkat untuk menghubungkan semula `Experience.tsx` dengan komponen modular (`HeroSection`, `ShowroomSection`, `EngineeringSection`, `GallerySection`, `InventorySection`, `BookingModal`) dengan mengekalkan layout baru yang dimahukan oleh pengguna.

### 2.6 BENTENG — Strict QA Engineer (`06_BENTENG_QA_REPORT.md`)
- **Penemuan (Live Verification):**
  - `npm run typecheck`, `npm run lint`, `npm run build`: **LULUS SEMPURNA (0 ralat)**.
  - `node --test scripts/sequence-tests.mjs`: **LULUS (4/4 ujian)**.
  - `node scripts/verify-new-layout.mjs`: **LULUS (7 seksyen, 4 spec bars, 8 kad)**.
  - `node scripts/browser-qa.mjs`: **GAGAL** (kerana skrip menguji struktur legasi `<main section.chapter>` yang telah digantikan oleh seksyen baru).
  - Multi-Viewport Testing: Desktop 1920x1080 & Laptop 1440x900 lulus dengan sifar ralat. Tablet 768x1024 runtuh secara kemas. Namun **Mobile 390x844 GAGAL akibat limpahan mendatar (+105px)** (`scrollWidth = 495px` berbanding `innerWidth = 390px`).
- **Syor Utama:** Baiki saiz `.hero-title` dan lebar `.model-panel` pada media query mobil, kemas kini skrip QA `browser-qa.mjs` agar selari dengan struktur layout terkini, dan baiki interaktiviti borang CTA.

### 2.7 JEJAK — GitHub Researcher & Skills Librarian (`07_JEJAK_GITHUB_RESEARCH.md`)
- **Penemuan:** Meneliti ekosistem moden untuk web interaktif automotif bertaraf dunia (rujukan: Porsche Taycan, Ferrari Roma, Awwwards Site of the Year).
- **Syor Utama:**
  - Elakkan memuatkan fail 3D model GLTF/GLB berat (15-40 MB) yang membebankan peranti pengguna.
  - Gunakan pendekatan **Canvas 2D Image Sequence Scrubbing** yang dioptimumkan dengan *LRU Cache* dan *OffscreenCanvas* seperti disahkan oleh ujian sekuens sedia ada.
  - Pasangkan kemahiran `generative_ui` dan integrasi Lenis-GSAP rasmi untuk memastikan kelancaran animasi 60 FPS.

### 2.8 PANTAS — Performance & Accessibility Engineer (`08_PANTAS_PERFORMANCE.md`)
- **Penemuan:**
  1. Laman web memuatkan aset seberat **6.47 MB** secara seragam kepada semua peranti, termasuk telefon pintar dengan sambungan 4G/5G, kerana mengabaikan atribut `srcSet` dengan imej `-800.webp` sedia ada.
  2. LCP Desktop adalah 2.70 saat (lambat) kerana tajuk hero disembunyikan secara buatan dengan `opacity: 0` dalam CSS sebelum GSAP dimuatkan.
  3. Lima pelanggaran kebolehcapaian WCAG 2.1 AA dikesan: kontras warna teks rendah pada `.panel-name` (1.09:1), elemen `<select>` tanpa label, ketiadaan `<main>` landmark, fokus papan kekunci (`outline: none`) disembunyikan, dan `prefers-reduced-motion` diabaikan.
- **Syor Utama:** Tambah `srcSet` responsif (menjimatkan 74% data mudah alih kepada ~1.65 MB), buang kelewatan keterlihatan hero untuk mencapai LCP < 1.1s, pulihkan cincin fokus papan kekunci yang elegan, dan lengkapkan elemen semantik ARIA.

### 2.9 LENSA — Visual Asset Director (`09_LENSA_ASSET_AUDIT.md`)
- **Penemuan:** Koleksi foto dalam `public/media/` disahkan **100% tulen, resolusi tinggi, tepat modelnya, dan sah di sisi undang-undang**.
  - Tiada imej generik atau palsu AI.
  - Model Revuelto, Temerario, dan Urus SE diasingkan dengan tepat mengikut casis dan tahun keluaran.
  - Semua 18 fail WebP utama dan varian responsif `-800.webp` beroperasi dengan baik.
- **Syor Utama:** Kekalkan 100% direktori aset sedia ada tanpa sebarang penggantian luar; hanya perlu memetakan semula laluan fail imej secara tepat ke dalam komponen kad dan galeri.

### 2.10 SINEMA — WebGL & Cinematic Visual Engineer (`10_SINEMA_VISUAL_ENGINEERING.md`)
- **Penemuan:** Analisis mendalam membuktikan bahawa cubaan memasukkan WebGL 3D poligon kereta penuh (R3F) pada peringkat ini adalah tidak praktikal kerana ketiadaan fail CAD rasmi Lamborghini dan risiko penurunan kadar bingkai pada telefon pintar.
- **Syor Utama:** Laksanakan **Seni Bina Hibrid 2.5D Sinematik**:
  - Salurkan 5 klip video sinematik yang dirancang melalui enjin Canvas 2D image sequence sedia ada dengan *ImageBitmap pre-decoding* dan *strict LRU memory disposal*.
  - Tambah efek pasca-pemprosesan mikroskopik berasaskan CSS/Canvas seperti *subtle scanline chromatic aberration* dan *dynamic headlight flare* semasa interaksi kursor tetikus.

---

## 3. Daftar Kecacatan Utama (Consolidated Defect Register)

Berikut adalah daftar komprehensif kecacatan teknikal dan visual yang disahkan berlaku dalam kod semasa:

| ID Isu | Tahap | Domain | Fail Terlibat | Baris | Keterangan Isu & Bukti | Tindakan Pembetulan |
|---|---|---|---|---|---|---|
| **ISSUE-P0-01** | **P0** | **Mobile / Layout** | `src/styles/experience.css` | L120-135 | Limpahan mendatar +105px pada skrin 390px (scrollWidth = 495px) merosakkan reka letak mobil. | Kurangkan saiz `clamp()` pada `.hero-title` dan tetapkan `max-width: 100vw; overflow-x: clip`. |
| **ISSUE-P0-02** | **P0** | **Motion / Sync** | `src/app/Experience.tsx` | L32-58 | Lenis berjalan `autoRaf: true` bersendirian tanpa disambungkan ke `gsap.ticker`, menyebabkan jitter. | Sambungkan Lenis ke `gsap.ticker.add((time) => lenis.raf(time * 1000))` dan matikan autoRaf. |
| **ISSUE-P1-01** | **P1** | **QA / Testing** | `scripts/browser-qa.mjs` | L18 | Ujian integrasi gagal (`AssertionError: 0 !== 6`) kerana mencari tag `<main section.chapter>` lama. | Kemas kini skrip QA agar mengesahkan struktur 7 seksyen baharu yang diluluskan. |
| **ISSUE-P1-02** | **P1** | **Performance** | `src/app/Experience.tsx` | L210, L340 | Imej 1920px dimuatkan secara seragam tanpa `srcSet`, menghantar 6.47 MB ke peranti mudah alih. | Pasang `srcSet` menggunakan varian `-800.webp` sedia ada untuk menjimatkan 74% data. |
| **ISSUE-P1-03** | **P1** | **Accessibility** | `src/styles/experience.css` | L45 | `* { outline: none; }` memadamkan penunjuk fokus papan kekunci, melanggar WCAG 2.1 AA. | Berikan penunjuk fokus tersuai yang elegan (`:focus-visible { outline: 2px solid var(--accent-gold); }`). |
| **ISSUE-P1-04** | **P1** | **Motion / UX** | `src/app/Experience.tsx` | L102-120 | Tajuk seksyen hilang (`play reverse play reverse`) apabila pengguna menatal ke tengah seksyen. | Tukar parameter ScrollTrigger kepada `toggleActions: 'play none none reverse'`. |
| **ISSUE-P2-01** | **P2** | **Art Direction** | `src/app/Experience.tsx` | L78, L195 | Lencana wireframe mentah (`data-annotation="01 // SPEC-HUD"`) dan peratusan enjin palsu. | Gantikan dengan telemetri teknikal tulen (BHP, Nm, 0-100km/j, RPM) dan reka bentuk elegan. |
| **ISSUE-P2-02** | **P2** | **UI / Interactivity**| `src/app/Experience.tsx` | L380-410 | Butang "QUICK VIEW" pada kad inventori tidak mempunyai fungsi atau modal interaktif. | Sambungkan ke modal Quick View dengan telemetri terperinci dan paparan spesifikasi. |
| **ISSUE-P2-03** | **P2** | **Form Validation** | `src/app/Experience.tsx` | L480-510 | Borang CTA ujian pandu menerima penghantaran kosong tanpa memeriksa nama atau e-mel. | Tambah pengesahan input wajib (HTML5 + validasi regex e-mel) dan maklum balas status visual. |
| **ISSUE-P2-04** | **P2** | **Architecture** | `src/app/Experience.tsx` | L1-540 | Monolit 540 baris memintas kod modular yang bersih di `src/chapters/` dan `src/components/`. | Pecahkan kod monolitik kepada komponen modular yang bersih dengan pemisahan tanggungjawab. |
| **ISSUE-P3-01** | **P3** | **Performance** | `index.html` / `src/` | L12 | Permintaan Google Fonts bertindih dengan fon tempatan dalam projek, menambah latensi rangkaian. | Bersihkan import fon luaran dan gunakan fon tempatan yang telah dioptimumkan sepenuhnya. |

---

## 4. Peluang Transformasi Visual (Visual Transformation Opportunities)

Hasil dapatan ARCA, SINEMA, dan LENSA menunjukkan tiga peluang besar untuk melonjakkan laman web ini ke taraf antarabangsa:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   TRANSFORMASI SENI BINA VISUAL LAMBORGHINI                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. CHIAROSCURO & DARKROOM MINIMALISM                                        │
│    • Latar belakang kelabu digantikan dengan OLED Pure Black (#050505).     │
│    • Pencahayaan spotlight berarah pada siluet gentian karbon kereta.       │
│    • Penyingkiran border kotak kuning murah dan bayang-bayang amatur.       │
│                                                                             │
│ 2. TELEMETRY COCKPIT HUD (AERODYNAMICS & HYBRID POWERTRAIN)                 │
│    • Menyingkirkan bar kemajuan palsu (88%, 95%).                           │
│    • Memasukkan data telemetri sebenar Lamborghini:                         │
│      - Revuelto: 1,015 CV | 6.5L V12 NA + 3 Motor Elektrik | 0-100: 2.5s    │
│      - Temerario: 920 CV | 4.0L Twin-Turbo V8 @ 10,000 RPM | 0-100: 2.7s   │
│      - Urus SE: 800 CV | 4.0L V8 Twin-Turbo Plug-in Hybrid | 800 Nm Tork   │
│                                                                             │
│ 3. DYNAMIC 2.5D PARALLAX & RETICLE HOVER                                    │
│    • Pergerakan mikro kursor tetikus (cursor-driven tilt) pada kad pameran. │
│    • Retikel sasaran optik (corner crosshairs) berinspirasikan paparan jet. │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Resolusi Percanggahan & Analisis Tukar Ganti (Trade-Off Analysis)

Dalam audit selari ini, terdapat perbezaan pendapat antara ejen yang telah diselesaikan oleh JEBAT:

1. **Percanggahan: R3F 3D WebGL vs Canvas 2D Sequence**
   - *Pendapat Asal:* Keinginan untuk model 3D penuh interaktif (Three.js/R3F).
   - *Keputusan JEBAT:* **Tolak 3D poligon berat.** Tiada model CAD 3D rasmi yang ringan (<5MB), dan risiko kejatuhan prestasi pada telefon pintar terlalu tinggi. **Pilih Canvas 2D Sequence Scrubbing** dengan pengurusan memori ketat (`ImageBitmap.close()`). Ini memberikan kualiti visual foto-realistik sebenar Lamborghini tanpa beban pemprosesan.
2. **Percanggahan: Reka Bentuk Semula Menyeluruh vs Pemeliharaan Kod Sedia Ada**
   - *Pendapat Asal:* Cadangan untuk membuang keseluruhan kod lama dan membina semula.
   - *Keputusan JEBAT:* **Kekalkan arahan teras pengguna.** Kekalkan struktur 7 seksyen baharu yang diminta oleh pengguna, kekalkan aset fotografi tulen 9.5/10, dan jangan ubah paip janaan klip video sekuens. Lakukan pembaikan melalui pemfaktoran semula komponen secara modular (modular refactoring) tanpa merobohkan struktur visual yang dimahukan.

---

## 6. Pelan Tindakan Pelaksanaan 6-Peringkat (Prioritized Implementation Roadmap)

Pelan ini bersedia untuk dilaksanakan sejurus menerima kelulusan rasmi daripada pengguna:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              PELAN TINDAKAN PELAKSANAAN (6 STAGES TO PERFECTION)            │
├──────────┬──────────────────────────────────────────────────────┬───────────┤
│ Peringkat│ Tindakan & Skop Pelaksanaan                          │ Sasaran   │
├──────────┼──────────────────────────────────────────────────────┼───────────┤
│ STAGE 1  │ EMERGENCY MOBILE & TICKER STABILIZATION              │ P0 Issues │
│          │ • Baiki limpahan mudah alih (+105px) pada 390px.     │           │
│          │ • Sambungkan Lenis ke GSAP ticker (hapus jitter).    │           │
│          │ • Betulkan formula pinning skrol mendatar.           │           │
├──────────┼──────────────────────────────────────────────────────┼───────────┤
│ STAGE 2  │ ACCESSIBILITY & PERFORMANCE HARDENING                │ P1 Issues │
│          │ • Pasang `srcSet` (-800.webp) untuk jimat 74% data.  │           │
│          │ • Padam kelewatan opacity hero (LCP 2.7s -> 1.1s).   │           │
│          │ • Baiki 5 pelanggaran Axe WCAG 2.1 AA & fokus papan. │           │
├──────────┼──────────────────────────────────────────────────────┼───────────┤
│ STAGE 3  │ ANTI-SLOP ART DIRECTION & TELEMETRY HUD              │ P2 Visual │
│          │ • Singkirkan lencana annotation & progress bar palsu.│           │
│          │ • Terapkan Darkroom Minimalist & data telemetri sahih│           │
│          │ • Pulihkan palet Nero Nemesis & Giallo Auge tulen.   │           │
├──────────┼──────────────────────────────────────────────────────┼───────────┤
│ STAGE 4  │ INTERACTIVE DEPTH & QUICK VIEW MODAL                 │ P2 UX     │
│          │ • Bina Quick View Modal interaktif pada kad inventori│           │
│          │ • Validasi borang pandu uji dengan maklum balas telus│           │
│          │ • Pulihkan navigasi HUD header yang responsif.       │           │
├──────────┼──────────────────────────────────────────────────────┼───────────┤
│ STAGE 5  │ ARCHITECTURAL MODULARIZATION & TEST HARMONIZATION    │ P1/P2 Kod │
│          │ • Pecahkan monolit `Experience.tsx` secara kemas.    │           │
│          │ • Sambungkan semula data `models.ts` & `media.ts`.   │           │
│          │ • Selaraskan `browser-qa.mjs` dengan 7 seksyen baru. │           │
├──────────┼──────────────────────────────────────────────────────┼───────────┤
│ STAGE 6  │ PRE-DELIVERY POLISH & CLIENT HANDOVER VERIFICATION   │ QA Akhir  │
│          │ • Ujian penuh 4 viewport (Desktop, Laptop, Tab, Tel).│           │
│          │ • Ujian regresi prestasi & pematuhan reduced-motion. │           │
└──────────┴──────────────────────────────────────────────────────┴───────────┘
```

---

## 7. Pintu Kelulusan Pelaksanaan (Implementation Approval Gate)

Sebagai mematuhi arahan tegas mod audit: **JEBAT TIDAK AKAN MENGUBAH ATAU MEMBINA SEMULA KOD SUMBER SEBELUM MENDAPAT KELULUSAN RASMI DARIPADA PENGGUNA.**

Segala analisis, bukti ujian langsung, dan cadangan penyelesaian kini telah siap direkodkan secara terperinci dalam direktori `docs/audit/`. JEBAT sedia memimpin fasa pelaksanaan sebaik sahaja arahan diberikan.
