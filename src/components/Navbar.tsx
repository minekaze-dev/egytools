import React, { useState } from 'react';
import { Sun, Moon, Menu, Cloud, LogIn, LogOut, Database, User as UserIcon, Pencil, Calendar } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';

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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Branding & Subtitle */}
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
          <div
            onClick={onOpenLanding}
            className={onOpenLanding ? 'cursor-pointer group' : ''}
          >
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">
                Sistem
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 hidden sm:block font-medium">
              Monitoring Customer & Perhitungan Revenue
            </p>
          </div>
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

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-600" />
            )}
          </button>
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

