import React from 'react';
import { Sun, Moon, Search, Calendar, Wifi, Menu, Cloud, LogIn, LogOut, Database, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
  selectedYear: string;
  onChangeYear: (year: string) => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  onToggleSidebar?: () => void;
  user: any;
  isLanding?: boolean;
  onOpenAuth: () => void;
  onOpenSqlModal?: () => void;
  onOpenLanding?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedMonth,
  onChangeMonth,
  selectedYear,
  onChangeYear,
  searchQuery,
  onChangeSearch,
  onToggleSidebar,
  user,
  isLanding,
  onOpenAuth,
  onOpenSqlModal,
  onOpenLanding,
  onLogout,
}) => {
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
              title="Buka Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div
            onClick={onOpenLanding}
            className={`w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0 ${
              onOpenLanding ? 'cursor-pointer hover:bg-blue-700 transition-colors' : ''
            }`}
            title="Ke Landing Page"
          >
            <Wifi className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div
            onClick={onOpenLanding}
            className={onOpenLanding ? 'cursor-pointer group' : ''}
          >
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] sm:text-[18px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                EgyTools: Revenue Control
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              Perhitungan Komisi & Monitoring Pendapatan
            </p>
          </div>
        </div>

        {/* Right: Search, Month, Year, SQL Button, Auth, Dark Mode */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-[12px]">
          {!isLanding && (
            <>
              {/* Global Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onChangeSearch(e.target.value)}
                  className="w-28 sm:w-36 pl-8 pr-2 py-1 text-[12px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:text-slate-200"
                />
              </div>

              {/* Filter Bulan */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => onChangeMonth(e.target.value)}
                  className="bg-transparent text-[12px] text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">Semua Bulan</option>
                  <option value="0">Januari</option>
                  <option value="1">Februari</option>
                  <option value="2">Maret</option>
                  <option value="3">April</option>
                  <option value="4">Mei</option>
                  <option value="5">Juni</option>
                  <option value="6">Juli</option>
                  <option value="7">Agustus</option>
                  <option value="8">September</option>
                  <option value="9">Oktober</option>
                  <option value="10">November</option>
                  <option value="11">Desember</option>
                </select>
              </div>

              {/* Filter Tahun */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                <select
                  value={selectedYear}
                  onChange={(e) => onChangeYear(e.target.value)}
                  className="bg-transparent text-[12px] text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer font-medium"
                >
                  <option value="ALL">Semua Tahun</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </>
          )}

          {/* Storage & Auth Badge/Buttons */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                  title={`Login sebagai: ${user.email}`}
                >
                  <Cloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-bold text-[11px] max-w-[100px] truncate">
                    {userDisplayName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 transition-colors"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div 
                  className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-[10px] font-semibold"
                  title="Mode Tamu (Local Storage)"
                >
                  <Cloud className="w-3 h-3 text-amber-500" />
                  <span>Guest</span>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
