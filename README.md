# Urban Density — ML Vision Dashboard

Dashboard monitoring kepadatan urban real-time berbasis Next.js, TypeScript, Tailwind CSS, dan lucide-react dengan Clean Architecture.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka di browser
# http://localhost:3000
```

---

## 🏗️ Arsitektur (Clean Architecture)

```
src/
├── domain/
│   └── entities/
│       └── TrafficMetric.ts       ← Interface TypeScript (TrafficMetric, AlertStatus, DashboardData)
│
├── infrastructure/
│   └── services/
│       └── trafficMockService.ts  ← Mock service: simulasi ML inference response
│
├── application/
│   └── use-cases/
│       └── useTrafficData.ts      ← Custom hook: state management (loading, error, data)
│
├── presentation/
│   └── components/
│       ├── MapBackground.tsx      ← SVG city grid background (full screen)
│       ├── Sidebar.tsx            ← Vertical navigation (Home, Map, Analytics, Settings)
│       ├── Header.tsx             ← Floating header: logo, lokasi, status kamera
│       ├── MetricCard.tsx         ← Dumb card: grid 2-col, icon + label + value + unit
│       ├── StatsPanel.tsx         ← Panel grid MetricCard (Traffic Flow + Anomaly Detection)
│       ├── AlertPanel.tsx         ← Panel daftar alert aktif
│       └── LoadingOverlay.tsx     ← Loading screen saat fetch awal
│
└── app/
    ├── layout.tsx                 ← Root layout + Space Grotesk font
    ├── page.tsx                   ← Entry point: merakit semua komponen + inject data
    └── globals.css                ← Tailwind base + scrollbar
```

---

## 🎨 Design System

| Token | Nilai |
|-------|-------|
| Background App | `#1A171A` |
| Aksen Utama | `#E879F9` |
| Aksen Soft | `#F0ABFC` |
| Teks Utama | `#FFFFFF` |
| Teks Sekunder | `#A3A3A3` |
| Panel Luar | `bg-black/60` + `backdrop-blur-md` |
| Card Inner | `#18181B` + `border-white/10` |
| Font | Space Grotesk (Google Fonts) |

---

## 📊 Mock Data (dari ML Inference)

| Metrik | Nilai | Unit | Ikon |
|--------|-------|------|------|
| Mobil | 12,540 | vehicles | Car |
| Motor | 8,320 | vehicles | Bike |
| Truk | 1,234 | vehicles | Truck |
| Bus | 450 | vehicles | Bus |
| Pejalan Kaki | 7,850 | people | User |
| Kepadatan Tinggi | 85 | % level | BarChart2 (Orange) |
| Darurat | 320 | vehicles | AlertTriangle (Red) |
| Crowd Anomaly | Active | status | Megaphone (Red) |

---

## ⚙️ Fitur

- ✅ Clean Architecture (Domain → Infrastructure → Application → Presentation)
- ✅ Auto-refresh setiap 30 detik
- ✅ Loading state + error handling
- ✅ Floating panels transparan (`backdrop-blur`)
- ✅ SVG city grid background full screen
- ✅ MetricCard grid 2-kolom dengan hover effects
- ✅ Alert panel dengan severity + time ago
- ✅ Sidebar navigasi dengan active state
- ✅ Space Grotesk font via `next/font/google`
- ✅ Fully typed TypeScript
