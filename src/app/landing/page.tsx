// src/app/landing/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radar,
  Video,
  BrainCircuit,
  BarChart3,
  BellRing,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  ChevronDown,
  Activity,
  Eye,
  Users,
  MapPin,
} from "lucide-react";

/* ───────────────────────────── data ───────────────────────────── */

const features = [
  {
    icon: Video,
    title: "Real-time CCTV Streaming",
    desc: "Monitor live feeds from multiple CCTV cameras across urban areas with ultra-low latency WebSocket connections.",
    gradient: "from-fuchsia-500/20 to-purple-600/20",
    border: "border-fuchsia-500/30",
    iconColor: "text-fuchsia-400",
  },
  {
    icon: BrainCircuit,
    title: "ML-Powered Detection",
    desc: "YOLOv8 deep learning models detect vehicles, pedestrians, and objects with high accuracy in real-time.",
    gradient: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Comprehensive traffic analytics with density heatmaps, peak hour analysis, and trend visualization.",
    gradient: "from-emerald-500/20 to-green-600/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: BellRing,
    title: "Instant Alerts",
    desc: "Automated alert system triggers notifications when density exceeds thresholds or anomalies are detected.",
    gradient: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

const stats = [
  { value: "99.2%", label: "Detection Accuracy", icon: Eye },
  { value: "<200ms", label: "Processing Latency", icon: Zap },
  { value: "24/7", label: "Monitoring Uptime", icon: Activity },
  { value: "Multi", label: "Camera Support", icon: Video },
];

const techStack = [
  { name: "YOLOv8", category: "ML Model" },
  { name: "FastAPI", category: "Backend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Supabase", category: "Database" },
  { name: "WebSocket", category: "Real-time" },
  { name: "Python", category: "Language" },
];

/* ───────────────────────────── component ───────────────────────── */

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-app-bg text-text-primary overflow-x-hidden">
      {/* ── Floating particles background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,121,249,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,121,249,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(232,121,249,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[100px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ══════════════════════ NAV BAR ══════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 40
            ? "bg-black/70 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(232,121,249,0.15)]">
              <Radar size={18} className="text-accent-primary" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wide text-text-primary">
                URBAN DENSITY
              </span>
              <p className="text-[10px] text-text-secondary tracking-widest uppercase -mt-0.5">
                Monitor
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary/20 hover:bg-accent-primary/30 border border-accent-primary/40 hover:border-accent-primary/60 text-accent-soft text-sm font-semibold transition-all duration-300 group"
            >
              Get Started
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span className="text-xs font-medium text-accent-soft tracking-wide">
              Powered by Machine Learning
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-text-primary">Urban Density</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #E879F9 0%, #A78BFA 50%, #67E8F9 100%)",
              }}
            >
              Monitor
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem monitoring kepadatan perkotaan secara real-time menggunakan
            AI & CCTV. Deteksi otomatis, analitik cerdas, dan peringatan instan
            dalam satu dashboard.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-fuchsia-600/90 to-purple-600/90 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(232,121,249,0.25)] hover:shadow-[0_0_60px_rgba(232,121,249,0.35)]"
            >
              Mulai Monitoring
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-text-secondary hover:text-text-primary bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Lihat Fitur
              <ChevronDown size={16} />
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-all duration-700 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${400 + i * 100}ms` }}
              >
                <stat.icon size={16} className="text-accent-primary mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-text-primary">
                  {stat.value}
                </span>
                <span className="text-[11px] text-text-secondary text-center leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] text-text-secondary/50 uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown size={16} className="text-text-secondary/40" />
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section id="features" className="relative py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <Zap size={12} className="text-accent-primary" />
              <span className="text-xs text-text-secondary font-medium">
                Core Features
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Platform lengkap untuk memantau kepadatan perkotaan dengan
              teknologi computer vision terkini.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className={`group relative p-6 sm:p-8 rounded-2xl border ${feat.border} bg-gradient-to-br ${feat.gradient} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden`}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] to-transparent" />

                <div
                  className={`w-12 h-12 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center mb-4 ${feat.iconColor}`}
                >
                  <feat.icon size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-text-primary">
                  {feat.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <Globe size={12} className="text-accent-primary" />
              <span className="text-xs text-text-secondary font-medium">
                Cara Kerja
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Dari CCTV ke Insight
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Proses otomatis dari pengambilan video hingga analisis kepadatan.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: Video,
                title: "Capture",
                desc: "Stream CCTV terhubung ke server melalui RTSP atau webcam dan mulai mengirim frame secara real-time.",
              },
              {
                step: "02",
                icon: BrainCircuit,
                title: "Analyze",
                desc: "YOLOv8 memproses setiap frame, mendeteksi kendaraan & pejalan kaki dengan bounding box dan confidence score.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Visualize",
                desc: "Data ditampilkan di dashboard interaktif dengan statistik real-time, tren, dan sistem peringatan otomatis.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all duration-300 group"
              >
                {/* Step number */}
                <span className="absolute top-4 right-4 text-4xl font-black text-white/[0.04] group-hover:text-accent-primary/10 transition-colors duration-300">
                  {item.step}
                </span>

                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-accent-primary" />
                </div>
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>

                {/* Connector arrow (not on last) */}
                {i < 2 && (
                  <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight
                      size={14}
                      className="text-text-secondary/30"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TECH STACK ══════════════════════ */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <Shield size={12} className="text-accent-primary" />
              <span className="text-xs text-text-secondary font-medium">
                Tech Stack
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Dibangun dengan Teknologi Modern
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all duration-300 group cursor-default"
              >
                <span className="text-sm font-semibold text-text-primary group-hover:text-accent-soft transition-colors">
                  {tech.name}
                </span>
                <span className="text-[10px] text-text-secondary/60 px-2 py-0.5 rounded-md bg-white/5">
                  {tech.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-accent-primary/10 via-purple-600/5 to-cyan-500/5 border border-accent-primary/20 overflow-hidden">
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(232,121,249,0.06) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(232,121,249,0.2)]">
                <Radar size={28} className="text-accent-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Siap Memulai?
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Akses dashboard monitoring kepadatan urban secara real-time
                sekarang juga.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-fuchsia-600/90 to-purple-600/90 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(232,121,249,0.25)] hover:shadow-[0_0_60px_rgba(232,121,249,0.35)] group"
              >
                Masuk ke Dashboard
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="relative border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/15 border border-accent-primary/20 flex items-center justify-center">
              <Radar size={13} className="text-accent-primary" />
            </div>
            <span className="text-sm font-semibold text-text-secondary">
              Urban Density Monitor
            </span>
          </div>

          <p className="text-xs text-text-secondary/40 font-mono">
            ML Vision Dashboard · YOLOv8 · FastAPI · Next.js · v3.0
          </p>
        </div>
      </footer>
    </div>
  );
}
