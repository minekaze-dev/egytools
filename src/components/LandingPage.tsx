import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  ArrowRight,
  LogIn,
  ShieldCheck,
  Info,
  Calculator,
  Sun,
  Moon,
  CheckCircle2,
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
      {/* Background Graphic Grid */}
      {!showCalculator && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Technical Dot & Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] opacity-80 dark:opacity-40" />
          
          {/* Subtle Radial Gradient Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-slate-50/50 dark:via-[#020617]/60 to-slate-100 dark:to-[#020617]" />
        </div>
      )}

      {/* Navbar Header */}
      <header className="relative z-10 border-b px-4 sm:px-6 py-3.5 shrink-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-blue-500 shrink-0 shadow-md overflow-hidden">
              <img src="https://i.imgur.com/ENDHLpA.jpg" alt="OxyMod Logo" className="w-full h-full object-cover" />
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
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase whitespace-nowrap">
              Oxygen Sales Workspace
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base font-bold leading-relaxed">
              Sistem follow up customer &amp; monitoring control revenue secara akurat dan transparan.
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
          <span>&copy; {new Date().getFullYear()} | Beta Version</span>
        </div>
      </footer>
    </div>
  );
};


