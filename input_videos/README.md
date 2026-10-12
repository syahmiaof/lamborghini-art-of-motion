# FOLDER INPUT VIDEO LAMBORGHINI

Sila letakkan fail video anda (contohnya `revuelto_cinematic.mp4`, `hero_intro.mp4`, `temerario_drive.mp4`) di dalam folder ini:

`c:\Users\USER\Desktop\LAMBORGHINI\input_videos\`

Format yang disokong:
- `.mp4`
- `.webm`
- `.mov`

Sebaik sahaja video diletakkan di sini, Ejen Pakar Sekuens Video (`sekuens_video_agent`) akan menjalankan skrip `python scripts/video_to_sequence.py` secara automatik.

Skrip ini akan:
1. Membuka video dalam pelayar tanpa kepala (Headless Playwright + Python).
2. Mengambil tangkapan skrin tepat bingkai demi bingkai (*deterministic seek & frame screenshot*).
3. Menghasilkan sekuens imej WebP berkualiti tinggi untuk Desktop (1920x1080) dan Mobil (800x450).
4. Menjana fail `manifest.json` yang serasi terus dengan enjin Canvas 2D `ScrollImageSequence` laman web!
