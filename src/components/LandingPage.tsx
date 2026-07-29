import React from 'react';
import {
  Wifi,
  Zap,
  ArrowRight,
  LogIn,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
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
    <div className="h-screen w-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans overflow-hidden transition-colors duration-200 select-none">
      {/* Navbar */}
      <header className="bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 flex items-center justify-center text-white border-2 border-blue-700 shrink-0">
              <Wifi className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-wider uppercase block leading-none">
                Oxy<span className="text-blue-600 dark:text-blue-400">Mod</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-tight">
                Revenue Control System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              title="Ganti Tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Hero Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 max-w-3xl mx-auto w-full text-center">
        <div className="space-y-4 sm:space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>OxyMod V.1.0 by E61</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase">
            Monitoring Revenue & Komisi Sales Oxygen{' '}
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold leading-relaxed">
            Sistem & monitoring kontrol pendapatan, estimasi revenue, dan kenaikan tier Sales.
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm border-2 border-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-xs"
              >
                <span>Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm border-2 border-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-xs"
                >
                  <Zap className="w-4 h-4 fill-current text-amber-300" />
                  <span>Guest</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-black text-xs sm:text-sm border-2 border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Login Akun</span>
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer Minimalist */}
      <footer className="border-t-2 border-slate-200 dark:border-slate-800 py-3 px-6 text-center text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0F172A] shrink-0 font-extrabold uppercase">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span>OxyMod Online System</span>
          <span>© {new Date().getFullYear()} Beta Version</span>
        </div>
      </footer>
    </div>
  );
};
