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
  FileText
} from 'lucide-react';
import { formatRupiah } from '../helpers/currency';
import { GlobalStats } from '../types/customer';

export type ActiveTab = 'revenue' | 'revenue_analytics' | 'revenue_table' | 'reports';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  stats: GlobalStats;
  onOpenLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  stats,
  onOpenLanding,
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
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-[#0B132B] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <Wifi className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                Egy<span className="text-blue-600">ToolsOxy</span>
              </span>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onToggleOpen}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {/* Item 1: Dashboard (Grafik & Statistik) */}
            <button
              onClick={() => {
                onSelectTab('revenue_analytics');
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 group ${
                activeTab === 'revenue_analytics' || activeTab === 'revenue'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BarChart3
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'revenue_analytics' || activeTab === 'revenue'
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-[12px] leading-tight truncate">Dashboard</div>
                  <div
                    className={`text-[10px] truncate ${
                      activeTab === 'revenue_analytics' || activeTab === 'revenue' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    Grafik & Statistik
                  </div>
                </div>
              </div>
            </button>

            {/* Item 2: Revenue (Tabel Revenue) */}
            <button
              onClick={() => {
                onSelectTab('revenue_table');
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 group ${
                activeTab === 'revenue_table'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Table
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'revenue_table'
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-[12px] leading-tight truncate">Revenue</div>
                  <div
                    className={`text-[10px] truncate ${
                      activeTab === 'revenue_table' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    Tabel Revenue
                  </div>
                </div>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'revenue_table' ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
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
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 group ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeTab === 'reports'
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-[12px] leading-tight truncate">Laporan Bulanan</div>
                  <div
                    className={`text-[10px] truncate ${
                      activeTab === 'reports' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    Rekap Revenue & SA
                  </div>
                </div>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'reports' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                Report
              </span>
            </button>
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 space-y-2">
          {onOpenLanding && (
            <button
              onClick={() => {
                onOpenLanding();
                if (window.innerWidth < 1024) onToggleOpen();
              }}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer"
              title="Kembali ke Halaman Depan / Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Keluar ke Landing Page</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>EgyToolsOxy v.1.0</span>
          </div>
          <p>© 2026</p>
        </div>
      </aside>
    </>
  );
};
