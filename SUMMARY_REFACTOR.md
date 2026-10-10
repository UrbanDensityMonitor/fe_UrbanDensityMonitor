# Ringkasan Refactoring Frontend (Next.js)

File ini merangkum semua perubahan dan optimasi yang telah dilakukan pada folder `fe_UrbanDensityMonitor` untuk menyesuaikan dengan arsitektur backend yang baru.

## 1. Penyesuaian Endpoint API & WebSocket (v1)
- **`next.config.js`**: Mengubah konfigurasi `rewrites()` agar semua request dari `/api/:path*` diarahkan ke `http://localhost:8000/api/v1/:path*` dan `/ws/:path*` diarahkan ke `http://localhost:8000/ws/v1/:path*`.
- **`trafficWebSocketService.ts`**: Mengubah path koneksi WebSocket di frontend dari `/ws/live/` menjadi `/ws/v1/live/` agar selaras dengan versi terbaru backend.

## 2. Perbaikan Error API Alerts (Supabase)
- **`src/app/api/alerts/route.ts`**:
  - **Penghapusan JOIN Otomatis**: Menghapus metode `select("*, streams(location_name)")` yang menyebabkan error "schema cache" pada Supabase (karena ketiadaan Foreign Key yang valid ke tabel `streams` maupun `private_streams`).
  - **Implementasi Lookup Manual**: Mengubah logika untuk melakukan query ke tabel `alerts` terlebih dahulu, mengumpulkan semua `stream_id` unik, lalu melakukan pencarian (lookup) secara paralel ke tabel `streams` (public) dan `private_streams` (private).
  - **Kompatibilitas TypeScript**: Mengganti sintaks spread pada Set (`[...new Set(...)]`) menjadi `Array.from(new Set(...))` untuk mencegah error kompilasi pada target TypeScript yang lebih lama.

## Kesimpulan
Perubahan pada frontend difokuskan untuk menjaga konektivitas yang stabil dengan backend FastAPI v1 yang baru, serta menyelesaikan konflik database/Supabase tanpa harus merubah skema database di sisi Supabase.
