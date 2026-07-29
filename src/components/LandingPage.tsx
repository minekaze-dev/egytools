import React, { useState } from 'react';
import {
  Wifi,
  Zap,
  ArrowRight,
  LogIn,
  ShieldCheck,
  Info,
  Calculator,
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
      className={`min-h-screen w-full relative flex flex-col justify-between font-sans overflow-y-auto select-none transition-colors duration-200 ${
        showCalculator
          ? 'bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100'
          : 'bg-slate-950 text-white bg-no-repeat bg-cover bg-center'
      }`}
      style={
        !showCalculator
          ? { backgroundImage: `url('https://i.imgur.com/BH1j0tN.jpg')` }
          : undefined
      }
    >
      {!showCalculator && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px] pointer-events-none" />
      )}

      {/* Navbar */}
      <header
        className={`relative z-10 border-b px-4 sm:px-6 py-3.5 shrink-0 transition-colors ${
          showCalculator
            ? 'bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-slate-200 dark:border-slate-800'
            : 'bg-slate-950/80 backdrop-blur-md border-slate-800/80 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 flex items-center justify-center text-white border-2 border-blue-500 shrink-0 shadow-md">
              <Wifi className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span
                className={`font-black text-lg tracking-wider uppercase block leading-none ${
                  showCalculator
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-white'
                }`}
              >
                Oxy<span className="text-blue-500">Mod</span>
              </span>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-tight ${
                  showCalculator
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-300'
                }`}
              >
                Revenue & Commision Control System
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
                {showCalculator ? 'Beranda' : 'Quick Calc'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 w-full max-w-7xl mx-auto">
        {showCalculator ? (
          <div className="w-full my-0 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <QuickCalculator
              onBackToLanding={() => setShowCalculator(false)}
              onEnterDashboard={onEnterApp}
            />
          </div>
        ) : (
          <div className="w-full max-w-3xl my-auto space-y-6 text-center py-6 sm:py-12 animate-in fade-in zoom-in-95 duration-300">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-wider border border-blue-400 shadow-xl">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>OxyMod V.1.0 by E61</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-lg">
              Monitoring Revenue & Komisi Sales
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-slate-200 text-sm sm:text-base font-bold leading-relaxed drop-shadow-md">
              Sistem & monitoring kontrol pendapatan, estimasi revenue, dan kenaikan tier Sales.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
              {user ? (
                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm border-2 border-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-xl hover:scale-[1.02] whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">Masuk Dashboard</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              ) : (
                <>
                  <button
                    onClick={onEnterApp}
                    className="w-full sm:w-auto py-3.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm border-2 border-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-xl hover:scale-[1.02] whitespace-nowrap"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-300 shrink-0" />
                    <span className="whitespace-nowrap">Masuk Sebagai Tamu (Guest)</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={onOpenAuth}
                    className="w-full sm:w-auto py-3.5 px-5 bg-slate-900/90 hover:bg-slate-800 text-white font-black text-xs sm:text-sm border-2 border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-xl hover:scale-[1.02] whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap">Login / Daftar Akun</span>
                  </button>
                </>
              )}
            </div>

            {/* Guest vs Login Note */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="p-3 sm:p-3.5 bg-slate-900/85 border-2 border-slate-700 text-amber-300 text-xs font-medium text-center flex items-start gap-2.5 justify-center leading-relaxed backdrop-blur-md shadow-lg">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Anda dapat menggunakan aplikasi ini sebagai <strong>Tamu (Guest)</strong>. Namun, jika ingin data tersimpan permanen di cloud dan bisa semua fitur, disarankan untuk <strong>Login / Mendaftar Akun</strong>.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Minimalist */}
      <footer
        className={`relative z-10 border-t py-3.5 px-6 text-center text-xs font-extrabold uppercase shrink-0 transition-colors ${
          showCalculator
            ? 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0F172A]'
            : 'border-slate-800/80 text-slate-400 bg-slate-950/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Support for Oxygen</span>
          <span>© {new Date().getFullYear()} Beta Version</span>
        </div>
      </footer>
    </div>
  );
};

