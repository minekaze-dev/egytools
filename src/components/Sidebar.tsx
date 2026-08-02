import React from 'react';
import { 
  Home,
  BarChart3, 
  ChevronDown,
  ChevronRight,
  PieChart,
  Table,
  ShieldCheck, 
  X,
  Wifi,
  ArrowLeft,
  FileText,
  Settings,
  Users,
  Clock
} from 'lucide-react';
import { formatRupiah } from '../helpers/currency';
import { GlobalStats } from '../types/customer';

export type ActiveTab = 'revenue' | 'revenue_analytics' | 'leads' | 'follow_up' | 'revenue_table' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  stats: GlobalStats;
  onOpenLanding?: () => void;
  showLeadsMenu?: boolean;
  showFollowUpMenu?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  stats,
  onOpenLanding,
  showLeadsMenu = true,
  showFollowUpMenu = true,
}) => {
  const isRevenueActive = activeTab === 'revenue' || activeTab === 'revenue_analytics' || activeTab === 'revenue_table';
  const [isRevenueExpanded, setIsRevenueExpanded] = React.useState<boolean>(true);

  // Keep revenue expanded by default or when revenue tab becomes active
  React.useEffect(() => {
    if (isRevenueActive) {
      setIsRevenueExpanded(true);
    }
  }, [isRevenueActive]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onToggleOpen}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-[#0B132B] border-r-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-none bg-blue-600 flex items-center justify-center text-white border-2 border-blue-700">
                <Wifi className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                Oxy<span className="text-blue-600">Mod</span>
              </span>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onToggleOpen}
              className="lg:hidden p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3.5 space-y-2">
            {/* Item 1: Dashboard (Grafik & Statistik) */}
            <button
              onClick={() => {
                onSelectTab('revenue_analytics');
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className={`w-full text-left px-3.5 py-3 rounded-none flex items-center justify-between transition-all duration-150 group cursor-pointer border-2 ${
                activeTab === 'revenue_analytics' || activeTab === 'revenue'
                  ? 'bg-blue-600 text-white border-blue-700 font-bold'
                  : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BarChart3
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'revenue_analytics' || activeTab === 'revenue'
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-sm font-extrabold leading-tight truncate uppercase">Dashboard</div>
                  <div
                    className={`text-xs mt-0.5 truncate ${
                      activeTab === 'revenue_analytics' || activeTab === 'revenue' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Grafik &amp; Statistik
                  </div>
                </div>
              </div>
            </button>

            {/* Item 2: Leads (Calon Pelanggan) */}
            {showLeadsMenu && (
              <button
                onClick={() => {
                  onSelectTab('leads');
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-none flex items-center justify-between transition-all duration-150 group cursor-pointer border-2 ${
                  activeTab === 'leads'
                    ? 'bg-blue-600 text-white border-blue-700 font-bold'
                    : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Users
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      activeTab === 'leads'
                        ? 'text-white'
                        : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-sm font-extrabold leading-tight truncate uppercase">Leads</div>
                    <div
                      className={`text-xs mt-0.5 truncate ${
                        activeTab === 'leads' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Calon Pelanggan
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Item 3: Follow Up (Reminder & Kontak CS) */}
            {showFollowUpMenu && (
              <button
                onClick={() => {
                  onSelectTab('follow_up');
                  if (window.innerWidth < 1024) onToggleOpen();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-none flex items-center justify-between transition-all duration-150 group cursor-pointer border-2 ${
                  activeTab === 'follow_up'
                    ? 'bg-blue-600 text-white border-blue-700 font-bold'
                    : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Clock
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      activeTab === 'follow_up'
                        ? 'text-white'
                        : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-sm font-extrabold leading-tight truncate uppercase">Follow Up</div>
                    <div
                      className={`text-xs mt-0.5 truncate ${
                        activeTab === 'follow_up' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Reminder &amp; WA CS
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Item 2: Revenue (Tabel Revenue) */}
            <button
              onClick={() => {
                onSelectTab('revenue_table');
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className={`w-full text-left px-3.5 py-3 rounded-none flex items-center justify-between transition-all duration-150 group cursor-pointer border-2 ${
                activeTab === 'revenue_table'
                  ? 'bg-blue-600 text-white border-blue-700 font-bold'
                  : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Table
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'revenue_table'
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-sm font-extrabold leading-tight truncate uppercase">Revenue</div>
                  <div
                    className={`text-xs mt-0.5 truncate ${
                      activeTab === 'revenue_table' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Tabel Revenue
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-none font-bold border ${
                activeTab === 'revenue_table' ? 'bg-white/20 border-white/40 text-white' : 'bg-blue-50 dark:bg-blue-900/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
              }`}>
                {stats.totalClosing}
              </span>
            </button>

            {/* Item 3: Laporan Bulanan (Report) */}
            <button
              onClick={() => {
                onSelectTab('reports');
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className={`w-full text-left px-3.5 py-3 rounded-none flex items-center justify-between transition-all duration-150 group cursor-pointer border-2 ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white border-blue-700 font-bold'
                  : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'reports'
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-sm font-extrabold leading-tight truncate uppercase">Report</div>
                  <div
                    className={`text-xs mt-0.5 truncate ${
                      activeTab === 'reports' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Rekap Revenue & SA
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-none font-bold uppercase border ${
                activeTab === 'reports' ? 'bg-white/20 border-white/40 text-white' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                Report
              </span>
            </button>

            {/* Item 4: Settings (Pengaturan) */}
            <button
              onClick={() => {
                onSelectTab('settings');
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className={`w-full text-left px-3.5 py-3 rounded-none flex items-center justify-between transition-all duration-150 group cursor-pointer border-2 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white border-blue-700 font-bold'
                  : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Settings
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'settings'
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-sm font-extrabold leading-tight truncate uppercase">Settings</div>
                  <div
                    className={`text-xs mt-0.5 truncate ${
                      activeTab === 'settings' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Profil & Target SA
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-none font-bold uppercase border ${
                activeTab === 'settings' ? 'bg-white/20 border-white/40 text-white' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                Atur
              </span>
            </button>
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2.5">
          {onOpenLanding && (
            <button
              onClick={() => {
                onOpenLanding();
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className="w-full py-2.5 px-3 rounded-none border-2 border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group cursor-pointer uppercase"
              title="Kembali ke Halaman Depan / Landing Page"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Halaman Depan</span>
            </button>
          )}
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>OxyMod v.1.0</span>
          </div>
          <p>© 2026</p>
        </div>
      </aside>
    </>
  );
};
