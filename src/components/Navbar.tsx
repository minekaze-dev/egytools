import React, { useState } from 'react';
import { Sun, Moon, Sparkles, ChevronDown, Menu, Cloud, LogIn, LogOut, Database, User as UserIcon, Pencil, Calendar } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';
import { AppTheme } from '../types/customer';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  theme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
  selectedYear: string;
  onChangeYear: (year: string) => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  onToggleSidebar?: () => void;
  user: any;
  onUpdateUser?: (updatedUser: any) => void;
  isLanding?: boolean;
  onOpenAuth: () => void;
  onOpenSqlModal?: () => void;
  onOpenLanding?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  theme = darkMode ? 'dark' : 'light',
  onSelectTheme,
  selectedMonth,
  onChangeMonth,
  selectedYear,
  onChangeYear,
  searchQuery,
  onChangeSearch,
  onToggleSidebar,
  user,
  onUpdateUser,
  isLanding,
  onOpenAuth,
  onOpenSqlModal,
  onOpenLanding,
  onLogout,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [guestName, setGuestName] = useState<string>(() => {
    return localStorage.getItem('isp_crm_guest_name') || 'Guest';
  });

  const userDisplayName = user
    ? (user.user_metadata?.full_name || localStorage.getItem('isp_crm_user_name') || user.email?.split('@')[0] || 'User')
    : guestName;

  const handleEditSuccess = (updatedUser?: any, newName?: string) => {
    if (updatedUser && onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    if (newName) {
      if (!user) {
        setGuestName(newName);
      } else {
        localStorage.setItem('isp_crm_user_name', newName);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-0 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Sidebar Toggle */}
        <div className="flex items-center gap-3.5">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-none border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors lg:hidden cursor-pointer"
              title="Buka Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right: Search, Month, Year, Storage Badge, Auth, Dark Mode */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs sm:text-sm">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="bg-transparent focus:outline-hidden cursor-pointer font-bold uppercase"
              title="Filter Bulan Active"
            >
              <option value="ALL">Semua Bulan</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={idx} value={idx.toString()}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            <select
              value={selectedYear}
              onChange={(e) => onChangeYear(e.target.value)}
              className="bg-transparent focus:outline-hidden cursor-pointer font-bold uppercase"
              title="Filter Tahun Active"
            >
              <option value="ALL">Semua Tahun</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Storage & Auth Badge/Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                  title={`Login sebagai: ${user.email} (Klik pensil untuk edit nama)`}
                >
                  <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm max-w-[120px] truncate uppercase">
                    {userDisplayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 rounded-none transition-colors cursor-pointer text-emerald-700 dark:text-emerald-300"
                    title="Edit Nama Pengguna"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 border-2 border-rose-300 dark:border-rose-900 font-extrabold text-xs uppercase transition-colors cursor-pointer"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div 
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-none bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase"
                  title="Mode Tamu (Local Storage)"
                >
                  <Cloud className="w-3.5 h-3.5 text-amber-500" />
                  <span>{userDisplayName}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 hover:bg-amber-200 dark:hover:bg-amber-900/60 rounded-none transition-colors cursor-pointer text-amber-700 dark:text-amber-300"
                    title="Edit Nama Pengguna Tamu"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all border-2 border-blue-700 cursor-pointer uppercase"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Selector Popover (Light, Dark, Space) */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title={`Tema Saat Ini: ${theme === 'space' ? 'Space (Ungu Gradasi Oren)' : darkMode ? 'Mode Gelap' : 'Mode Terang'}. Klik untuk ganti.`}
              className={`h-9 px-2.5 flex items-center gap-1.5 rounded-none border-2 transition-all cursor-pointer ${
                theme === 'space'
                  ? 'bg-gradient-to-r from-purple-900/80 to-orange-900/80 text-orange-200 border-orange-500/60 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              {theme === 'space' ? (
                <>
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="hidden sm:inline text-xs font-black uppercase tracking-wider text-orange-200">Space</span>
                </>
              ) : darkMode ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline text-xs font-bold uppercase">Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline text-xs font-bold uppercase">Terang</span>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-70" />
            </button>

            {isThemeMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#0F172A] border-2 border-slate-300 dark:border-slate-700 shadow-2xl z-50 py-1.5 text-xs font-bold uppercase">
                  <div className="px-3 py-1 text-[10px] text-slate-400 tracking-wider">Pilihan Tema</div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('light');
                      else onToggleDarkMode();
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      theme === 'light' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-black' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Mode Terang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('dark');
                      else onToggleDarkMode();
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      theme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-black' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Mode Gelap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('space');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      theme === 'space' ? 'bg-gradient-to-r from-purple-900/40 to-orange-900/40 text-orange-300 font-black border-l-2 border-orange-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="flex items-center gap-1.5">
                      Tema Space
                      <span className="text-[9px] px-1 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-extrabold rounded-none">Ungu-Oren</span>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile / Name Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={userDisplayName}
        user={user}
        onSuccess={handleEditSuccess}
      />
    </header>
  );
};

