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
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { QuickCalculator } from './QuickCalculator';
import { AppTheme } from '../types/customer';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  user: any;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  theme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  uiStyle?: 'modern' | 'klasik';
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  user,
  darkMode,
  onToggleDarkMode,
  theme = darkMode ? 'dark' : 'light',
  onSelectTheme,
  uiStyle = 'klasik',
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
            <div className="flex flex-col select-none">
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  MORA<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-orange-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">COCKPIT</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-blue-600 dark:bg-orange-500 text-white shadow-xs">
                  SALES
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Cockpit Sales &amp; Revenue System
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

            {/* Theme Toggle Button (Light -> Dark -> Space) */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 border-2 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 ${
                theme === 'space'
                  ? 'bg-gradient-to-r from-purple-900/80 to-orange-900/80 text-orange-200 border-orange-500/60'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'
              }`}
              title={
                theme === 'space'
                  ? 'Tema Space Aktif (Ungu-Oren). Klik untuk ganti ke Mode Terang.'
                  : darkMode
                  ? 'Mode Gelap Aktif. Klik untuk ganti ke Tema Space.'
                  : 'Mode Terang Aktif. Klik untuk ganti ke Mode Gelap.'
              }
            >
              {theme === 'space' ? (
                <>
                  <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-[10px] font-black uppercase text-orange-200 hidden md:inline">Space</span>
                </>
              ) : darkMode ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase hidden md:inline">Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-bold uppercase hidden md:inline">Terang</span>
                </>
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
                <span>MoraCockpit V.1.0 by E61</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider border border-emerald-500 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
                <span>Akurasi Est Komisi 90% Sesuai</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase whitespace-nowrap">
              Cockpit Sales
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
                  className={`w-full sm:w-auto py-3.5 px-6 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg hover:scale-[1.02] whitespace-nowrap ${
                    uiStyle === 'modern'
                      ? theme === 'space'
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-2 border-indigo-400 rounded-2xl shadow-indigo-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-700 dark:border-blue-500 rounded-xl'
                      : theme === 'space'
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-2 border-indigo-400 rounded-none shadow-indigo-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-700 dark:border-blue-500 rounded-none'
                  }`}
                >
                  <span className="whitespace-nowrap">Masuk Dashboard</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              ) : (
                <>
                  <button
                    onClick={onEnterApp}
                    className={`w-full sm:w-auto py-3.5 px-5 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg hover:scale-[1.02] whitespace-nowrap ${
                      uiStyle === 'modern'
                        ? theme === 'space'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-2 border-blue-400 rounded-2xl shadow-blue-500/40'
                          : 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-700 dark:border-blue-400 rounded-xl'
                        : theme === 'space'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-2 border-blue-400 rounded-none shadow-blue-500/40'
                          : 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-700 dark:border-blue-400 rounded-none'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300 shrink-0" />
                    <span className="whitespace-nowrap">Masuk Sebagai Tamu (Guest)</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={onOpenAuth}
                    className={`w-full sm:w-auto py-3.5 px-5 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-lg hover:scale-[1.02] whitespace-nowrap ${
                      uiStyle === 'modern'
                        ? theme === 'space'
                          ? 'bg-slate-900/90 hover:bg-slate-900 text-white border-2 border-purple-400/80 rounded-2xl shadow-purple-500/30'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 rounded-xl'
                        : theme === 'space'
                          ? 'bg-slate-900/90 hover:bg-slate-900 text-white border-2 border-purple-400/80 rounded-none shadow-purple-500/30'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 rounded-none'
                    }`}
                  >
                    <LogIn className="w-4 h-4 text-indigo-400 shrink-0" />
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


