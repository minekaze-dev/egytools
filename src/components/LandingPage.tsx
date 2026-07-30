import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wifi,
  Zap,
  ArrowRight,
  LogIn,
  ShieldCheck,
  Info,
  Calculator,
  Sun,
  Moon,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Calendar,
  Clock,
  CalendarDays,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { QuickCalculator } from './QuickCalculator';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  user: any;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  user,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div
      className={`h-screen max-h-screen w-full relative flex flex-col justify-between font-sans select-none bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-200 ${
        showCalculator ? 'overflow-y-auto' : 'overflow-hidden'
      }`}
    >
      {/* Background Graphic Grid & Technical Diagram Overlay */}
      {!showCalculator && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Technical Dot & Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] opacity-80 dark:opacity-40" />
          
          {/* Subtle Radial Gradient Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-slate-50/50 dark:via-[#020617]/60 to-slate-100 dark:to-[#020617]" />

          {/* Floating Animated Diagram 1: Top-Left Revenue Trend Curve */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0.8, 1, 0.8],
              y: [0, -8, 0],
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="hidden lg:block absolute top-20 left-8 xl:left-16 w-80 p-4 bg-white/85 dark:bg-[#0F172A]/85 border-2 border-slate-200 dark:border-slate-800/80 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Est. Net Revenue Trend
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                +28.4% YoY
              </span>
            </div>
            <div className="flex items-baseline justify-between my-1">
              <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                Rp 18.500.000
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">Target 100%</span>
            </div>
            {/* Area Chart SVG */}
            <div className="h-12 w-full mt-2">
              <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,35 Q30,28 60,32 T120,15 T180,8 L200,5 L200,40 L0,40 Z"
                  fill="url(#gradRev)"
                />
                <path
                  d="M0,35 Q30,28 60,32 T120,15 T180,8 L200,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="120" cy="15" r="3.5" className="fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
                <circle cx="200" cy="5" r="4" className="fill-emerald-500 animate-ping" />
                <circle cx="200" cy="5" r="3.5" className="fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* Floating Animated Diagram 2: Top-Right Tier Progression Diagram */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0.85, 1, 0.85],
              y: [0, 8, 0],
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              opacity: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="hidden lg:block absolute top-20 right-8 xl:right-16 w-80 p-4 bg-white/85 dark:bg-[#0F172A]/85 border-2 border-slate-200 dark:border-slate-800/80 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Tier Commission Model
                </span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-amber-500 text-slate-950 animate-pulse">
                TIER 3 AKTIF
              </span>
            </div>
            
            {/* Tier Flow Nodes */}
            <div className="space-y-2 my-2">
              <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-extrabold text-slate-500">Tier 1 &bull; 15 SA</span>
                <span className="font-mono font-black text-slate-600 dark:text-slate-400">25% Komisi</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-extrabold text-slate-500">Tier 2 &bull; 18 SA</span>
                <span className="font-mono font-black text-slate-600 dark:text-slate-400">30% Komisi</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-100/90 dark:bg-amber-950/80 border-2 border-amber-400 text-xs font-black shadow-xs">
                <span className="text-amber-950 dark:text-amber-200 uppercase">Tier 3 &bull; 22 SA</span>
                <span className="font-mono text-amber-800 dark:text-amber-300">35% Komisi</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Animated Diagram 3: Bottom-Left Sales Active Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.8, 1, 0.8],
              y: [0, -6, 0],
            }}
            transition={{
              y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="hidden lg:block absolute bottom-12 left-12 xl:left-20 w-72 p-4 bg-white/85 dark:bg-[#0F172A]/85 border-2 border-slate-200 dark:border-slate-800/80 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Closing SA Volume
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                22 SA
              </span>
            </div>
            {/* CSS Bar Chart */}
            <div className="flex items-end justify-between h-14 gap-2 pt-2">
              <div className="flex-1 bg-indigo-200 dark:bg-indigo-950/60 h-[40%] relative group">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500">12</span>
              </div>
              <div className="flex-1 bg-indigo-300 dark:bg-indigo-900/60 h-[58%] relative group">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500">15</span>
              </div>
              <div className="flex-1 bg-indigo-400 dark:bg-indigo-800/80 h-[70%] relative group">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500">18</span>
              </div>
              <motion.div
                animate={{ height: ['90%', '100%', '90%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex-1 bg-indigo-600 dark:bg-indigo-500 h-[100%] relative group border-t-2 border-indigo-400"
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-indigo-600 dark:text-indigo-300">22</span>
              </motion.div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 uppercase">
              <span>Bln 1</span>
              <span>Bln 2</span>
              <span>Bln 3</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-black">Sekarang</span>
            </div>
          </motion.div>

          {/* Floating Animated Diagram 4: Bottom-Right Schedule / Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.85, 1, 0.85],
              y: [0, 6, 0],
            }}
            transition={{
              y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="hidden lg:block absolute bottom-12 right-12 xl:right-20 w-80 p-4 bg-white/85 dark:bg-[#0F172A]/85 border-2 border-slate-200 dark:border-slate-800/80 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Schedule &amp; Follow-Up Sync
                </span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Cloud
              </span>
            </div>
            {/* Schedule Items List Preview */}
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">PT Oxy Digital</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>31 Jul &bull; 10:00 WIB</span>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                  Follow-Up
                </span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">Warkop Barokah</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <span>01 Ags &bull; 14:00 WIB</span>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-black text-[9px] uppercase">
                  Closing Deal
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navbar Header */}
      <header className="relative z-10 border-b px-4 sm:px-6 py-3.5 shrink-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 flex items-center justify-center text-white border-2 border-blue-500 shrink-0 shadow-md">
              <Wifi className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider uppercase block leading-none text-slate-900 dark:text-slate-100">
                Oxy<span className="text-blue-600 dark:text-blue-400">Mod</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-tight text-slate-500 dark:text-slate-400">
                Revenue & Commission Control System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`px-3 py-2 text-xs font-black uppercase border-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                showCalculator
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600 shadow-md'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">
                {showCalculator ? 'Beranda' : 'Simulasi Revenue'}
              </span>
            </button>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 border-2 transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
              title={darkMode ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 shrink-0" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-7xl mx-auto my-auto">
        {showCalculator ? (
          <div className="w-full my-0 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <QuickCalculator
              onBackToLanding={() => setShowCalculator(false)}
              onEnterDashboard={onEnterApp}
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl my-auto space-y-5 text-center py-4 sm:py-6"
          >
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider border border-blue-500 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" />
                <span>OxyMod V.1.0 by E61</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider border border-emerald-500 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
                <span>Akurasi Est Komisi 90% Sesuai</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase">
              Monitoring Revenue &amp; Komisi Sales
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base font-bold leading-relaxed">
              Sistem &amp; monitoring kontrol pendapatan, estimasi revenue, dan kenaikan tier Sales secara akurat dan transparan.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
              {user ? (
                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm border-2 border-blue-700 dark:border-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg hover:scale-[1.02] whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">Masuk Dashboard</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              ) : (
                <>
                  <button
                    onClick={onEnterApp}
                    className="w-full sm:w-auto py-3.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm border-2 border-blue-700 dark:border-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg hover:scale-[1.02] whitespace-nowrap"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300 shrink-0" />
                    <span className="whitespace-nowrap">Masuk Sebagai Tamu (Guest)</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={onOpenAuth}
                    className="w-full sm:w-auto py-3.5 px-5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-black text-xs sm:text-sm border-2 border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg hover:scale-[1.02] whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap">Login / Daftar Akun</span>
                  </button>
                </>
              )}
            </div>

            {/* Guest vs Login Note */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="p-3 sm:p-3.5 bg-white dark:bg-slate-900/90 border-2 border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 text-xs font-medium text-center flex items-start gap-2.5 justify-center leading-relaxed shadow-md">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong> Anda</strong> dapat menggunakan aplikasi ini sebagai <strong>Tamu (Guest)</strong>. Namun, jika ingin data tersimpan permanen di cloud dan bisa semua fitur, disarankan untuk <strong>Login / Mendaftar Akun</strong>.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer Minimalist */}
      <footer className="relative z-10 border-t py-3 px-6 text-center text-xs font-extrabold uppercase shrink-0 transition-colors border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0F172A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Support for Oxygen</span>
          <span>&copy; {new Date().getFullYear()} Beta Version</span>
        </div>
      </footer>
    </div>
  );
};


