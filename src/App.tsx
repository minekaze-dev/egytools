import React, { useState, useEffect, useMemo } from 'react';
import { Customer, CustomerWithCalculations } from './types/customer';
import { calculateAllCustomerMetrics } from './helpers/commissionCalculator';
import { getCurrentTier } from './helpers/tierCalculator';

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
import { LeadsView } from './components/LeadsView';
import { FollowUpView } from './components/FollowUpView';
import { FollowUpReminderWidget } from './components/FollowUpReminderWidget';

import { Lead, FollowUpSchedule } from './types/crm';
import { INITIAL_LEADS, INITIAL_FOLLOW_UPS } from './data/initialCrmData';

import { getPackageById, MASTER_PACKAGES } from './data/packages';
import { parseTanggalPasang } from './helpers/dateFormatter';
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

  // 1. Dark mode & UI Style state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isp_crm_theme');
    if (saved !== null) return saved === 'dark';
    return false;
  });

  const [uiStyle, setUiStyle] = useState<'klasik' | 'modern'>(() => {
    const saved = localStorage.getItem('isp_crm_ui_style');
    return saved === 'modern' ? 'modern' : 'klasik';
  });

  const [showLeadsMenu, setShowLeadsMenu] = useState<boolean>(() => {
    const saved = localStorage.getItem('isp_crm_show_leads_menu');
    return saved !== null ? saved === 'true' : true;
  });

  const [showFollowUpMenu, setShowFollowUpMenu] = useState<boolean>(() => {
    const saved = localStorage.getItem('isp_crm_show_followup_menu');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    if (activeTab === 'leads' && !showLeadsMenu) {
      setActiveTab('revenue_analytics');
    }
    if (activeTab === 'follow_up' && !showFollowUpMenu) {
      setActiveTab('revenue_analytics');
    }
  }, [activeTab, showLeadsMenu, showFollowUpMenu]);

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

  useEffect(() => {
    const root = document.documentElement;
    if (uiStyle === 'modern') {
      root.classList.add('ui-modern');
      localStorage.setItem('isp_crm_ui_style', 'modern');
    } else {
      root.classList.remove('ui-modern');
      localStorage.setItem('isp_crm_ui_style', 'klasik');
    }
  }, [uiStyle]);

  // 2. Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('isp_crm_customers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // 2b. Leads state
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('isp_crm_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // 2c. Follow Up state
  const [followUps, setFollowUps] = useState<FollowUpSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('isp_crm_followups');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('isp_crm_customers', JSON.stringify(customers));
    } catch (e) {}
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('isp_crm_leads', JSON.stringify(leads));
    } catch (e) {}
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('isp_crm_followups', JSON.stringify(followUps));
    } catch (e) {}
  }, [followUps]);

  // Supabase Auth Listener & Realtime Data Loader
  useEffect(() => {
    let isMounted = true;

    const loadDataForUser = async (currentUser: any) => {
      setIsLoading(true);
      if (currentUser) {
        // Load from Supabase Database with localStorage fallback
        try {
          // Fetch customers
          const { data: custData, error: custError } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('createdAt', { ascending: false });

          if (!custError && custData !== null && isMounted) {
            setCustomers(custData as Customer[]);
          } else if (custError) {
            try {
              const localCust = localStorage.getItem('isp_crm_customers');
              if (localCust && isMounted) {
                setCustomers(JSON.parse(localCust));
              }
            } catch (e) {}
          }

          // Fetch leads
          const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('createdAt', { ascending: false });

          if (!leadsError && leadsData !== null && isMounted) {
            setLeads(leadsData as Lead[]);
          } else if (leadsError) {
            try {
              const localLeads = localStorage.getItem('isp_crm_leads');
              if (localLeads && isMounted) {
                setLeads(JSON.parse(localLeads));
              }
            } catch (e) {}
          }

          // Fetch follow_up_schedules
          const { data: fuData, error: fuError } = await supabase
            .from('follow_up_schedules')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('createdAt', { ascending: false });

          if (!fuError && fuData !== null && isMounted) {
            setFollowUps(fuData as FollowUpSchedule[]);
          } else if (fuError) {
            try {
              const localFu = localStorage.getItem('isp_crm_followups');
              if (localFu && isMounted) {
                setFollowUps(JSON.parse(localFu));
              }
            } catch (e) {}
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
          console.error('Error fetching Supabase data:', e);
        }
      } else {
        // Guest mode -> Load from localStorage
        try {
          const localCust = localStorage.getItem('isp_crm_customers');
          if (localCust) setCustomers(JSON.parse(localCust));
          const localLeads = localStorage.getItem('isp_crm_leads');
          if (localLeads) setLeads(JSON.parse(localLeads));
          const localFu = localStorage.getItem('isp_crm_followups');
          if (localFu) setFollowUps(JSON.parse(localFu));
        } catch (e) {}
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

  // Logout Handler & Strict Session Invalidation
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCustomers([]);
    setLeads([]);
    setFollowUps([]);
    localStorage.removeItem('isp_crm_customers');
    localStorage.removeItem('isp_crm_leads');
    localStorage.removeItem('isp_crm_followups');
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

  const syncLeadToSupabase = async (lead: Lead, isDelete = false) => {
    if (!user) return;
    try {
      if (isDelete) {
        await supabase
          .from('leads')
          .delete()
          .eq('id', lead.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('leads')
          .upsert({
            ...lead,
            user_id: user.id,
          });
      }
    } catch (err) {
      console.error('Supabase lead sync error:', err);
    }
  };

  const syncFuToSupabase = async (fu: FollowUpSchedule, isDelete = false) => {
    if (!user) return;
    try {
      if (isDelete) {
        await supabase
          .from('follow_up_schedules')
          .delete()
          .eq('id', fu.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('follow_up_schedules')
          .upsert({
            ...fu,
            user_id: user.id,
          });
      }
    } catch (err) {
      console.error('Supabase FU sync error:', err);
    }
  };

  // Settings Save Handler (User name, Monthly Target SA, UI Style & Module Toggles)
  const handleSaveSettings = async (
    newName: string, 
    newTargetSa: number, 
    newUiStyle?: 'klasik' | 'modern',
    newShowLeads?: boolean,
    newShowFollowUp?: boolean
  ) => {
    if (newUiStyle) {
      setUiStyle(newUiStyle);
    }
    setMonthlyTargetSa(newTargetSa);
    localStorage.setItem('isp_crm_monthly_target_sa', newTargetSa.toString());

    if (newShowLeads !== undefined) {
      setShowLeadsMenu(newShowLeads);
      localStorage.setItem('isp_crm_show_leads_menu', newShowLeads.toString());
    }

    if (newShowFollowUp !== undefined) {
      setShowFollowUpMenu(newShowFollowUp);
      localStorage.setItem('isp_crm_show_followup_menu', newShowFollowUp.toString());
    }

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

  // 4. Navbar Filter States (Default to Current Month & Year)
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(() => now.getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>(() => now.getFullYear().toString());
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
        const parsed = parseTanggalPasang(c.tanggalPasang);
        if (!parsed || parsed.monthIndex.toString() !== selectedMonth) return false;
      }
      if (selectedYear !== 'ALL' && c.tanggalPasang) {
        const parsed = parseTanggalPasang(c.tanggalPasang);
        if (!parsed || parsed.year.toString() !== selectedYear) return false;
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

  // ----------------------------------------------------
  // LEADS HANDLERS
  // ----------------------------------------------------
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    syncLeadToSupabase(newLead);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => {
      const updatedList = prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...updates };
          syncLeadToSupabase(updated);
          return updated;
        }
        return l;
      });
      return updatedList;
    });
  };

  const handleDeleteLead = (id: string) => {
    const target = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (target) {
      syncLeadToSupabase(target, true);
    }
  };

  const handleConvertToClosing = (
    lead: Lead,
    convertDetails: {
      packageId: string;
      packageName: string;
      packagePrice: number;
      periode: any;
      tanggalPasang: string;
      nomorInternet: string;
      catatan?: string;
    }
  ) => {
    // 1. Create new customer record for Revenue
    const newCust: Customer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      namaPelanggan: lead.namaCalonPelanggan,
      nomorInternet: convertDetails.nomorInternet,
      nomorHP: lead.nomorHP,
      area: lead.area,
      sales: lead.assignedSales,
      packageId: convertDetails.packageId,
      packageName: convertDetails.packageName,
      packagePrice: convertDetails.packagePrice,
      periode: convertDetails.periode,
      tanggalPasang: convertDetails.tanggalPasang,
      status: 'Aktif',
      catatan: convertDetails.catatan || `Closing dari Lead (${lead.sumberLead})`,
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) => [newCust, ...prev]);
    syncToSupabase(newCust);

    // 2. Mark lead status as Closing
    const updatedLead: Lead = {
      ...lead,
      statusSurvei: 'Closing',
      convertedCustomerId: newCust.id,
    };
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? updatedLead : l))
    );
    syncLeadToSupabase(updatedLead);

    // 3. Auto-add Follow Up schedule for H+3 installation check
    const pasangDate = new Date(convertDetails.tanggalPasang);
    pasangDate.setDate(pasangDate.getDate() + 3);
    const fuDateStr = pasangDate.toISOString().split('T')[0];

    const newFu: FollowUpSchedule = {
      id: `fu-${Date.now().toString().slice(-5)}`,
      namaCustomer: lead.namaCalonPelanggan || 'Customer',
      nomorHP: lead.nomorHP,
      tipeFollowUp: 'Diskusi',
      tanggalFollowUp: fuDateStr,
      waktuFollowUp: '10:00',
      status: 'Menunggu',
      customerType: 'Pelanggan Aktif',
      referenceId: newCust.id,
      catatanHasil: 'Cek kualitas koneksi & kepuasan H+3 pasang.',
      createdAt: new Date().toISOString(),
    };

    setFollowUps((prev) => [newFu, ...prev]);
    syncFuToSupabase(newFu);

    // 4. Switch to Revenue Table view
    setActiveTab('revenue_table');
  };

  // ----------------------------------------------------
  // FOLLOW UP HANDLERS
  // ----------------------------------------------------
  const handleAddFollowUp = (scheduleData: Omit<FollowUpSchedule, 'id' | 'createdAt'>) => {
    const newFu: FollowUpSchedule = {
      ...scheduleData,
      id: `fu-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    setFollowUps((prev) => [newFu, ...prev]);
    syncFuToSupabase(newFu);
  };

  const handleUpdateFollowUp = (id: string, updates: Partial<FollowUpSchedule>) => {
    setFollowUps((prev) => {
      const updatedList = prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          syncFuToSupabase(updated);
          return updated;
        }
        return s;
      });
      return updatedList;
    });
  };

  const handleDeleteFollowUp = (id: string) => {
    const target = followUps.find((s) => s.id === id);
    setFollowUps((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      syncFuToSupabase(target, true);
    }
  };

  const handleFollowUpConvertToClosing = (s: FollowUpSchedule) => {
    // If customer already created for this referenceId, prevent double insert
    if (s.referenceId && customers.some(c => c.id === s.referenceId)) {
      return;
    }

    const pkg = MASTER_PACKAGES.find((p) => p.id === s.packageId) || MASTER_PACKAGES[0];
    const packageId = s.packageId || pkg.id;
    const packageName = s.packageName || pkg.name;
    const packagePrice = s.packagePrice || pkg.price;
    const periode = s.periode || 'Bulanan';
    const nomorInternet = s.nomorInternet || `88${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newCust: Customer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      namaPelanggan: s.namaCustomer || 'Customer',
      nomorInternet,
      nomorHP: s.nomorHP,
      area: 'General Area',
      sales: s.assignedCS || 'CS Sales',
      packageId,
      packageName,
      packagePrice,
      periode,
      tanggalPasang: s.tanggalFollowUp || new Date().toISOString().split('T')[0],
      status: 'Aktif',
      catatan: `Closing Otomatis dari Menu Follow Up (${s.tipeFollowUp})`,
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) => [newCust, ...prev]);
    syncToSupabase(newCust);

    // Update Follow Up status & reference
    const updatedFu: FollowUpSchedule = {
      ...s,
      status: 'Closing',
      referenceId: newCust.id,
      nomorInternet,
    };
    setFollowUps((prev) =>
      prev.map((item) => (item.id === s.id ? updatedFu : item))
    );
    syncFuToSupabase(updatedFu);

    // If linked to a lead, update lead status too
    if (s.referenceId) {
      setLeads((prev) =>
        prev.map((l) => {
          if (l.id === s.referenceId) {
            const updatedLead = { ...l, statusSurvei: 'Closing' as const, convertedCustomerId: newCust.id };
            syncLeadToSupabase(updatedLead);
            return updatedLead;
          }
          return l;
        })
      );
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
        showLeadsMenu={showLeadsMenu}
        showFollowUpMenu={showFollowUpMenu}
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
                          <TierRulesCard activeTierLevel={getCurrentTier(stats.totalClosing, stats.totalMonthlyNetRevenue).level} />
                        </div>
                        <div className="lg:col-span-1">
                          <TargetSaCard
                            currentActiveSa={stats.totalClosing}
                            targetSa={monthlyTargetSa}
                            onOpenSettings={() => setActiveTab('settings')}
                          />
                        </div>
                      </div>

                      {/* Widget Reminder Follow Up CS Harian & Quick Leads */}
                      {(showFollowUpMenu || showLeadsMenu) && (
                        <FollowUpReminderWidget
                          schedules={followUps}
                          leads={leads}
                          onNavigateTab={setActiveTab}
                          onUpdateScheduleStatus={(id, status) => handleUpdateFollowUp(id, { status })}
                        />
                      )}

                      <RevenueChart customers={calculateAllCustomerMetrics(customers).customersWithCalculations} />
                    </div>
                  )}

                  {/* VIEW 2: Revenue Ledger Table */}
                  {activeTab === 'revenue_table' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                      <RevenueTable
                        data={calculateAllCustomerMetrics(customers).customersWithCalculations}
                        onView={(cust) => setViewingCustomer(cust)}
                        onEdit={(cust) => {
                          setEditingCustomer(cust);
                          setIsFormOpen(true);
                        }}
                        onDelete={(id) => setDeletingCustomer(id)}
                        onAddClick={() => {
                          setEditingCustomer(null);
                          const mNum = selectedMonth !== 'ALL' ? Number(selectedMonth) : new Date().getMonth();
                          const yNum = selectedYear !== 'ALL' ? selectedYear : new Date().getFullYear().toString();
                          const mStr = String(mNum + 1).padStart(2, '0');
                          setDefaultTanggalPasang(`${yNum}-${mStr}-01`);
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

              {/* TAB 2: LEADS MANAGEMENT VIEW */}
              {activeTab === 'leads' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1">
                  <LeadsView
                    leads={leads}
                    currentUserName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || localStorage.getItem('isp_crm_user_name') || localStorage.getItem('isp_crm_guest_name') || 'OxyMod'}
                    onAddLead={handleAddLead}
                    onUpdateLead={handleUpdateLead}
                    onDeleteLead={handleDeleteLead}
                    onConvertToClosing={handleConvertToClosing}
                    onScheduleFollowUp={handleAddFollowUp}
                  />
                </div>
              )}

              {/* TAB 3: FOLLOW UP CS REMINDER VIEW */}
              {activeTab === 'follow_up' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1">
                  <FollowUpView
                    schedules={followUps}
                    onAddSchedule={handleAddFollowUp}
                    onUpdateSchedule={handleUpdateFollowUp}
                    onDeleteSchedule={handleDeleteFollowUp}
                    onConvertToClosing={handleFollowUpConvertToClosing}
                  />
                </div>
              )}

              {/* TAB 4: MONTHLY REVENUE & SA REPORT */}
              {activeTab === 'reports' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 flex-1">
                  <MonthlyReportView
                    customers={customers}
                    isLoggedIn={!!user}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                    selectedMonthExternal={selectedMonth}
                    selectedYearExternal={selectedYear}
                    onSelectMonthYear={(monthIndex, year) => {
                      setSelectedMonth(monthIndex);
                      setSelectedYear(year);
                      setActiveTab('revenue_table');
                    }}
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
                    uiStyle={uiStyle}
                    showLeadsMenu={showLeadsMenu}
                    showFollowUpMenu={showFollowUpMenu}
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
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
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
