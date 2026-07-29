import React, { useState, useEffect, useMemo } from 'react';
import { Customer, CustomerWithCalculations } from './types/customer';
import { calculateAllCustomerMetrics } from './helpers/commissionCalculator';

import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { TierCard } from './components/TierCard';
import { RevenueChart } from './components/RevenueChart';
import { TierRulesCard } from './components/TierRulesCard';
import { RevenueTable } from './components/RevenueTable';
import { CustomerFormModal } from './components/CustomerFormModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { QuickAddModal } from './components/QuickAddModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseSqlModal } from './components/SupabaseSqlModal';
import { LandingPage } from './components/LandingPage';
import { MonthlyReportView } from './components/MonthlyReportView';
import { TargetSaCard } from './components/TargetSaCard';
import { SettingsView } from './components/SettingsView';

import { getPackageById } from './data/packages';
import { AlertTriangle } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function App() {
  // 0. Navigation & Auth State
  const [activeTab, setActiveTab] = useState<ActiveTab>('revenue_analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals for Auth & SQL
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  // Monthly Target SA state
  const [monthlyTargetSa, setMonthlyTargetSa] = useState<number>(() => {
    const saved = localStorage.getItem('isp_crm_monthly_target_sa');
    return saved ? parseInt(saved, 10) || 15 : 15;
  });

  // Date prefill for customer form when creating skipped months
  const [defaultTanggalPasang, setDefaultTanggalPasang] = useState<string>('');

  // 1. Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isp_crm_theme');
    if (saved !== null) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('isp_crm_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('isp_crm_theme', 'light');
    }
  }, [darkMode]);

  // 2. Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Supabase Auth Listener & Customer Loader
  useEffect(() => {
    let isMounted = true;

    const loadDataForUser = async (currentUser: any) => {
      setIsLoading(true);
      if (currentUser) {
        // Load from Supabase Database
        try {
          // Fetch customers
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('createdAt', { ascending: false });

          if (!error && data && isMounted) {
            setCustomers(data as Customer[]);
          } else {
            // Fallback to local if error or table missing
            const saved = localStorage.getItem('isp_crm_customers');
            if (saved && isMounted) {
              setCustomers(JSON.parse(saved));
            }
          }

          // Fetch profile settings (target SA & full_name)
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, monthly_target_sa')
              .eq('id', currentUser.id)
              .maybeSingle();

            if (profile && isMounted) {
              if (profile.monthly_target_sa) {
                setMonthlyTargetSa(profile.monthly_target_sa);
                localStorage.setItem('isp_crm_monthly_target_sa', profile.monthly_target_sa.toString());
              }
              if (profile.full_name) {
                localStorage.setItem('isp_crm_user_name', profile.full_name);
              }
            }
          } catch (pe) {
            console.error('Error fetching user profile:', pe);
          }
        } catch (e) {
          console.error('Error fetching Supabase customers:', e);
          const saved = localStorage.getItem('isp_crm_customers');
          if (saved && isMounted) {
            setCustomers(JSON.parse(saved));
          }
        }
      } else {
        // Guest mode -> Load from LocalStorage
        const saved = localStorage.getItem('isp_crm_customers');
        if (saved && isMounted) {
          try {
            setCustomers(JSON.parse(saved));
          } catch {
            setCustomers([]);
          }
        } else if (isMounted) {
          setCustomers([]);
        }
      }
      if (isMounted) setIsLoading(false);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user || null);
        loadDataForUser(session?.user || null);
      }
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        const newUser = session?.user || null;
        setUser(newUser);
        loadDataForUser(newUser);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Save Effect for Guest Mode Local Storage
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      localStorage.setItem('isp_crm_customers', JSON.stringify(customers));
    }
  }, [customers, isLoading, user]);

  // Logout Handler & Strict Session Invalidation
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCustomers([]);
    localStorage.removeItem('isp_crm_customers');
    setIsLandingPage(true);
    // Overwrite browser history state to prevent viewing cached data via browser Back button
    window.history.replaceState(null, '', window.location.href);
  };

  // Prevent back-button data leak after logout
  useEffect(() => {
    const checkSessionAndClear = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        setCustomers([]);
        localStorage.removeItem('isp_crm_customers');
        setIsLandingPage(true);
      }
    };

    const handlePopState = () => {
      checkSessionAndClear();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePopState);
    };
  }, []);

  // Helper function to sync DB mutation to Supabase if logged in
  const syncToSupabase = async (customer: Customer, isDelete = false) => {
    if (!user) return;
    try {
      if (isDelete) {
        await supabase
          .from('customers')
          .delete()
          .eq('id', customer.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('customers')
          .upsert({
            ...customer,
            user_id: user.id,
          });
      }
    } catch (err) {
      console.error('Supabase sync error:', err);
    }
  };

  // Settings Save Handler (User name & Monthly Target SA)
  const handleSaveSettings = async (newName: string, newTargetSa: number) => {
    setMonthlyTargetSa(newTargetSa);
    localStorage.setItem('isp_crm_monthly_target_sa', newTargetSa.toString());

    if (user) {
      // Update Supabase Auth user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: newName },
      });
      if (error) {
        console.error('Error updating auth metadata:', error);
      } else if (data.user) {
        setUser(data.user);
      }

      // Upsert into profiles table
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: newName,
          monthly_target_sa: newTargetSa,
          updated_at: new Date().toISOString(),
        });
      } catch (pe) {
        console.error('Error saving profile to Supabase:', pe);
      }

      localStorage.setItem('isp_crm_user_name', newName);
    } else {
      localStorage.setItem('isp_crm_guest_name', newName);
    }
  };

  // 4. Navbar Filter States
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 5. Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerWithCalculations | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<string | null>(null);

  // Filter Customers according to Month, Year, and Navbar Search Query
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (selectedMonth !== 'ALL' && c.tanggalPasang) {
        const month = new Date(c.tanggalPasang).getMonth().toString();
        if (month !== selectedMonth) return false;
      }
      if (selectedYear !== 'ALL' && c.tanggalPasang) {
        const year = new Date(c.tanggalPasang).getFullYear().toString();
        if (year !== selectedYear) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = c.namaPelanggan.toLowerCase().includes(q);
        const matchesID = c.nomorInternet.toLowerCase().includes(q);
        const matchesArea = c.area.toLowerCase().includes(q);
        const matchesSales = c.sales.toLowerCase().includes(q);
        const matchesPkg = c.packageName.toLowerCase().includes(q);
        if (!matchesName && !matchesID && !matchesArea && !matchesSales && !matchesPkg) {
          return false;
        }
      }
      return true;
    });
  }, [customers, selectedMonth, selectedYear, searchQuery]);

  // Realtime Calculation Engine
  const { customersWithCalculations, stats } = useMemo(() => {
    return calculateAllCustomerMetrics(filteredCustomers);
  }, [filteredCustomers]);

  // Handler: Add / Edit Customer
  const handleFormSubmit = (
    data: Omit<Customer, 'id' | 'createdAt' | 'packageName' | 'packagePrice'>
  ) => {
    const pkg = getPackageById(data.packageId);
    const packageName = pkg ? pkg.name : 'Stream 100 Mbps';
    const packagePrice = pkg ? pkg.price : 242000;

    if (editingCustomer) {
      const updatedCustomer: Customer = {
        ...editingCustomer,
        ...data,
        packageName,
        packagePrice,
      };
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? updatedCustomer : c
        )
      );
      syncToSupabase(updatedCustomer);
    } else {
      const newCustomer: Customer = {
        ...data,
        id: `CUST-${Date.now().toString().slice(-4)}`,
        packageName,
        packagePrice,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      syncToSupabase(newCustomer);
    }

    setEditingCustomer(null);
  };

  // Handler: Quick Add Batch Customer
  const handleQuickAddBatch = (
    batch: Omit<Customer, 'id' | 'createdAt' | 'packageName' | 'packagePrice'>[]
  ) => {
    const newCustomersList: Customer[] = batch.map((data, idx) => {
      const pkg = getPackageById(data.packageId);
      const packageName = pkg ? pkg.name : 'Stream 100 Mbps';
      const packagePrice = pkg ? pkg.price : 242000;

      return {
        ...data,
        id: `CUST-Q${Date.now().toString().slice(-4)}${idx + 1}`,
        packageName,
        packagePrice,
        createdAt: new Date().toISOString(),
      };
    });

    setCustomers((prev) => [...newCustomersList, ...prev]);
    newCustomersList.forEach((c) => syncToSupabase(c));
  };

  // Handler: Delete Customer
  const confirmDeleteCustomer = () => {
    if (deletingCustomer) {
      const target = customers.find((c) => c.id === deletingCustomer);
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer));
      if (target) {
        syncToSupabase(target, true);
      }
      setDeletingCustomer(null);
    }
  };

  if (isLandingPage) {
    return (
      <>
        <LandingPage
          onEnterApp={() => setIsLandingPage(false)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsLandingPage(false)}
        />
        <SupabaseSqlModal
          isOpen={isSqlModalOpen}
          onClose={() => setIsSqlModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-row transition-colors duration-200">
      {/* Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        stats={stats}
        onOpenLanding={() => setIsLandingPage(true)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Header */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          selectedYear={selectedYear}
          onChangeYear={setSelectedYear}
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
          onOpenLanding={() => setIsLandingPage(true)}
          onLogout={handleLogout}
        />

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-2 sm:p-3 space-y-2.5 max-w-[1600px] w-full mx-auto">
              {/* TAB 1: REVENUE SUB-VIEWS */}
              {(activeTab === 'revenue' || activeTab === 'revenue_analytics' || activeTab === 'revenue_table') && (
                <div className="space-y-2.5">
                  {/* VIEW 1: Statistik Ringkasan */}
                  {(activeTab === 'revenue' || activeTab === 'revenue_analytics') && (
                    <div className="space-y-2.5 animate-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
                        <div className="lg:col-span-2 space-y-2.5">
                          <StatsCard stats={stats} />
                          <TierRulesCard />
                        </div>
                        <div className="lg:col-span-1">
                          <TargetSaCard
                            currentActiveSa={stats.totalClosing}
                            targetSa={monthlyTargetSa}
                            onOpenSettings={() => setActiveTab('settings')}
                          />
                        </div>
                      </div>
                      <RevenueChart customers={customersWithCalculations} />
                    </div>
                  )}

                  {/* VIEW 2: Revenue Ledger Table */}
                  {activeTab === 'revenue_table' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                      <RevenueTable
                        data={customersWithCalculations}
                        onView={(cust) => setViewingCustomer(cust)}
                        onEdit={(cust) => {
                          setEditingCustomer(cust);
                          setIsFormOpen(true);
                        }}
                        onDelete={(id) => setDeletingCustomer(id)}
                        onAddClick={() => {
                          setEditingCustomer(null);
                          setDefaultTanggalPasang('');
                          setIsFormOpen(true);
                        }}
                        onAddClickWithDate={(dateIso) => {
                          setEditingCustomer(null);
                          setDefaultTanggalPasang(dateIso);
                          setIsFormOpen(true);
                        }}
                        onQuickAddClick={() => setIsQuickAddOpen(true)}
                        selectedMonthExternal={selectedMonth}
                        selectedYearExternal={selectedYear}
                        isLoggedIn={!!user}
                        onOpenAuth={() => setIsAuthModalOpen(true)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MONTHLY REVENUE & SA REPORT */}
              {activeTab === 'reports' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1">
                  <MonthlyReportView
                    customers={customers}
                    isLoggedIn={!!user}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                  />
                </div>
              )}

              {/* TAB 3: SYSTEM SETTINGS VIEW */}
              {activeTab === 'settings' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1">
                  <SettingsView
                    user={user}
                    currentName={user?.user_metadata?.full_name || localStorage.getItem('isp_crm_user_name') || localStorage.getItem('isp_crm_guest_name') || 'User'}
                    monthlyTargetSa={monthlyTargetSa}
                    onSaveSettings={handleSaveSettings}
                    onOpenSqlModal={() => setIsSqlModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      {/* REVENUE MODALS */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
          setDefaultTanggalPasang('');
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
        defaultTanggalPasang={defaultTanggalPasang}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmitBatch={handleQuickAddBatch}
      />

      <CustomerDetailModal
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
      />

      {/* AUTH & SUPABASE SQL MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SupabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Delete Customer Confirmation */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[12px] p-5 max-w-sm w-full shadow-xl space-y-4 text-[12px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-slate-900 dark:text-slate-100">
                  Konfirmasi Hapus Pelanggan
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Apakah Anda yakin ingin menghapus data pelanggan ini? Data komisi akan dikalkulasi ulang.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeletingCustomer(null)}
                className="px-3 py-1.5 font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteCustomer}
                className="px-3.5 py-1.5 font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
