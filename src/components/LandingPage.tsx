import React from 'react';
import {
  Wifi,
  Zap,
  TrendingUp,
  ShieldCheck,
  Database,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calculator,
  LogIn,
  Sun,
  Moon,
  ChevronRight,
  Globe,
} from 'lucide-react';

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
  return (
    <div className="min-h-screen h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans overflow-y-auto lg:overflow-hidden transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wifi className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight block leading-tight">
                EgyToolsOxy <span className="text-blue-600 dark:text-blue-400"> </span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                ISP Revenue & Commission Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register</span>
                </button>
                <button
                  onClick={onEnterApp}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Coba (Guest)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Content - Fit to Screen */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Monitoring Revenue & Komisi</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Kelola Pelanggan, Revenue, & Komisi Sales{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Secara Akurat & Real-Time
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Sistem kalkulasi otomatis Revenue dan Komisi bulanan
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Masuk Dashboard / Guest</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Login / Register Akun</span>
              </button>
            )}
          </div>

          {/* Clean minimal hero layout without feature cards */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-3 px-4 text-center text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0F172A] shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              EgyToolsOxy Revenue Control System
            </span>
          </div>
          <p>© {new Date().getFullYear()} EgyToolsOxy • 2026</p>
        </div>
      </footer>
    </div>
  );
};
