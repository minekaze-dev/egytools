import React, { useState, useMemo } from 'react';
import { Lead, LeadSurveyStatus, LeadSource, FollowUpType } from '../types/crm';
import { MASTER_PACKAGES } from '../data/packages';
import { BillingPeriod } from '../types/customer';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Clock, 
  Trash2, 
  X, 
  MapPin, 
  Calendar,
  Sparkles,
  Phone,
  UserCheck,
  Edit3,
  Check
} from 'lucide-react';

export const INDONESIA_PROVINCES = [
  '-',
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Barat Daya'
];

export const LEAD_SOURCES: LeadSource[] = [
  'MGM',
  'Qiscus FB',
  'Qiscus Live Chat',
  'Qiscus Website',
  'Ads Personal',
  'Webcover',
  'Tiktok',
  'Whatsapp',
  'Lainnya',
];

// Status list for NEW Lead creation
export const ADD_LEAD_STATUSES: LeadSurveyStatus[] = [
  'New Customer',
  'NBP',
  'Interest',
  'Thinking',
  'Uncover',
  'Already Active',
  'Area Full',
  'Ghosting',
];

// Status list for Table & Edit (includes Pemasangan, Refund, Aktif - NO survey statuses)
export const TABLE_EDIT_STATUSES: LeadSurveyStatus[] = [
  'New Customer',
  'NBP',
  'Interest',
  'Thinking',
  'Uncover',
  'Already Active',
  'Area Full',
  'Pemasangan',
  'Refund',
  'Aktif',
  'Closing',
  'Ghosting',
  'Batal',
];

interface LeadsViewProps {
  leads: Lead[];
  currentUserName?: string;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLead: (id: string, lead: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
  onConvertToClosing: (leadData: Lead, convertDetails: {
    packageId: string;
    packageName: string;
    packagePrice: number;
    periode: BillingPeriod;
    tanggalPasang: string;
    nomorInternet: string;
    catatan?: string;
  }) => void;
  onScheduleFollowUp: (schedule: {
    namaCustomer: string;
    nomorHP: string;
    tipeFollowUp: any;
    tanggalFollowUp: string;
    waktuFollowUp: string;
    assignedCS: string;
    customerType: 'Prospek / Lead';
    referenceId: string;
    catatanHasil?: string;
  }) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  currentUserName = 'OxyMod',
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  onConvertToClosing,
  onScheduleFollowUp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [areaFilter, setAreaFilter] = useState<string>('ALL');

  // Inline Customer Name Edit State
  const [editingCustomerNameId, setEditingCustomerNameId] = useState<string | null>(null);
  const [inlineCustomerName, setInlineCustomerName] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [schedulingLead, setSchedulingLead] = useState<Lead | null>(null);

  // Form states for Add / Edit Lead
  const [formNama, setFormNama] = useState('Customer');
  const [formHP, setFormHP] = useState('');
  const [formSource, setFormSource] = useState<LeadSource>('MGM');
  const [formStatus, setFormStatus] = useState<LeadSurveyStatus>('New Customer');
  const [formArea, setFormArea] = useState('-');
  const [formSales, setFormSales] = useState(currentUserName);

  // Form states for Convert to Closing Modal
  const [convertPackageId, setConvertPackageId] = useState(MASTER_PACKAGES[0].id);
  const [convertPeriode, setConvertPeriode] = useState<BillingPeriod>('Bulanan');
  const [convertTanggalPasang, setConvertTanggalPasang] = useState(new Date().toISOString().split('T')[0]);
  const [convertNomorInternet, setConvertNomorInternet] = useState('');
  const [convertCatatan, setConvertCatatan] = useState('');

  // Form states for Schedule Follow Up Modal
  const [fuTanggal, setFuTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [fuWaktu, setFuWaktu] = useState('10:00');
  const [fuTipe, setFuTipe] = useState<FollowUpType>('-');
  const [fuCatatan, setFuCatatan] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const total = leads.length;
    const newCustomer = leads.filter(l => l.statusSurvei === 'New Customer').length;
    const nbp = leads.filter(l => l.statusSurvei === 'NBP').length;
    const interest = leads.filter(l => l.statusSurvei === 'Interest').length;
    const thinking = leads.filter(l => l.statusSurvei === 'Thinking').length;
    const uncover = leads.filter(l => l.statusSurvei === 'Uncover').length;
    const areaFull = leads.filter(l => l.statusSurvei === 'Area Full').length;
    const pemasangan = leads.filter(l => l.statusSurvei === 'Pemasangan').length;
    const aktif = leads.filter(l => l.statusSurvei === 'Aktif').length;
    const refund = leads.filter(l => l.statusSurvei === 'Refund').length;
    const closing = leads.filter(l => l.statusSurvei === 'Closing').length;
    return { total, newCustomer, nbp, interest, thinking, uncover, areaFull, pemasangan, aktif, refund, closing };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch = 
        lead.nomorHP.includes(searchQuery) ||
        (lead.namaCalonPelanggan && lead.namaCalonPelanggan.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.area && lead.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.assignedSales && lead.assignedSales.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || lead.statusSurvei === statusFilter;
      const matchSource = sourceFilter === 'ALL' || lead.sumberLead === sourceFilter;
      const matchArea = areaFilter === 'ALL' || lead.area === areaFilter;

      return matchSearch && matchStatus && matchSource && matchArea;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, areaFilter]);

  // Open Add Modal
  const openAddModal = () => {
    setFormHP('');
    setFormSource('MGM');
    setFormStatus('New Customer');
    setFormNama('Customer');
    setFormArea('-');
    setFormSales(currentUserName);
    setEditingLead(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormHP(lead.nomorHP);
    setFormSource(lead.sumberLead);
    setFormStatus(lead.statusSurvei);
    setFormNama(lead.namaCalonPelanggan || 'Customer');
    setFormArea(lead.area || 'DKI Jakarta');
    setFormSales(lead.assignedSales || currentUserName);
    setIsAddModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHP = formHP.replace(/\D/g, '');
    if (!cleanHP) {
      alert('Nomor HP wajib diisi dengan angka valid!');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const customerName = formNama.trim() || 'Customer';
    const salesName = formSales.trim() || currentUserName;

    if (editingLead) {
      onUpdateLead(editingLead.id, {
        nomorHP: cleanHP,
        sumberLead: formSource,
        statusSurvei: formStatus,
        namaCalonPelanggan: customerName,
        area: formArea,
        assignedSales: salesName,
      });
    } else {
      onAddLead({
        namaCalonPelanggan: customerName,
        nomorHP: cleanHP,
        alamat: formArea,
        area: formArea,
        paketDiminati: 'Stream 30 Mbps',
        statusSurvei: formStatus,
        assignedSales: salesName, // Sales sesuai nama akun user login
        assignedCS: 'Siti Rahma',
        sumberLead: formSource,
        tanggalKontak: todayStr,
        catatan: `Lead dibuat dari ${formSource} (${formStatus}) oleh ${salesName}`,
      });
    }

    setIsAddModalOpen(false);
  };

  // Save Inline Customer Name Edit
  const handleSaveInlineCustomerName = (id: string) => {
    if (inlineCustomerName.trim()) {
      onUpdateLead(id, { namaCalonPelanggan: inlineCustomerName.trim() });
    }
    setEditingCustomerNameId(null);
  };

  // Open Convert to Closing Modal
  const openConvertModal = (lead: Lead) => {
    setConvertingLead(lead);
    setConvertPackageId(MASTER_PACKAGES[0].id);
    setConvertPeriode('Bulanan');
    setConvertTanggalPasang(new Date().toISOString().split('T')[0]);
    const randomId = '12' + Math.floor(100000 + Math.random() * 900000);
    setConvertNomorInternet(randomId);
    setConvertCatatan(`Konversi dari Lead (${lead.sumberLead})`);
  };

  const handleConfirmConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;

    const pkg = MASTER_PACKAGES.find(p => p.id === convertPackageId) || MASTER_PACKAGES[0];

    onConvertToClosing(convertingLead, {
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: pkg.price,
      periode: convertPeriode,
      tanggalPasang: convertTanggalPasang,
      nomorInternet: convertNomorInternet || '12888999',
      catatan: convertCatatan,
    });

    setConvertingLead(null);
  };

  // Open Schedule FU Modal
  const openScheduleModal = (lead: Lead) => {
    setSchedulingLead(lead);
    setFuTanggal(new Date().toISOString().split('T')[0]);
    setFuWaktu('10:00');
    setFuTipe('-');
    setFuCatatan(`Follow up lead HP: ${lead.nomorHP}`);
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingLead) return;

    onScheduleFollowUp({
      namaCustomer: schedulingLead.namaCalonPelanggan || 'Customer',
      nomorHP: schedulingLead.nomorHP,
      tipeFollowUp: fuTipe,
      tanggalFollowUp: fuTanggal,
      waktuFollowUp: fuWaktu,
      customerType: schedulingLead.statusSurvei === 'Pemasangan' ? 'Prospek' : 'Lead',
      referenceId: schedulingLead.id,
      catatanHasil: fuCatatan,
    });

    setSchedulingLead(null);
  };

  // Format WhatsApp Link
  const getWhatsAppLink = (phone: string, salesName: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Halo Kak, saya ${salesName} dari Oxygen.id Internet Provider. Terima kasih telah menghubungi kami. Apakah ada informasi paket internet yang bisa kami bantu?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getStatusBadgeStyle = (status: LeadSurveyStatus) => {
    switch (status) {
      case 'New Customer':
        return 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      case 'NBP':
        return 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
      case 'Interest':
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Thinking':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Uncover':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Already Active':
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800';
      case 'Area Full':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Pemasangan':
        return 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      case 'Refund':
        return 'bg-pink-100 dark:bg-pink-950/80 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-800';
      case 'Aktif':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Closing':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'Ghosting':
        return 'bg-purple-950 text-purple-200 border-purple-800 font-extrabold';
      case 'Batal':
        return 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0F172A] p-5 border-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Manajemen Data Customer (Leads)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            Akun Sales Aktif: <span className="text-blue-600 dark:text-blue-400 font-black">{currentUserName}</span> &bull; Status Lead: New Customer, NBP, Interest, Thinking, Uncover, Already Active, Area Full, Pemasangan, Refund, Aktif.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lead Baru</span>
        </button>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400">Total</div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{stats.total}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-teal-600 dark:text-teal-400">New Cust</div>
          <div className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5">{stats.newCustomer}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400">Interest</div>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">{stats.interest}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">Thinking</div>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{stats.thinking}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-slate-700 dark:text-slate-300">NBP</div>
          <div className="text-lg font-black text-slate-700 dark:text-slate-300 mt-0.5">{stats.nbp}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-orange-600 dark:text-orange-400">Pasang</div>
          <div className="text-lg font-black text-orange-600 dark:text-orange-400 mt-0.5">{stats.pemasangan}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-pink-600 dark:text-pink-400">Refund</div>
          <div className="text-lg font-black text-pink-600 dark:text-pink-400 mt-0.5">{stats.refund}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-rose-600 dark:text-rose-400">Area Full</div>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">{stats.areaFull}</div>
        </div>

        <div className="p-2.5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800">
          <div className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">Aktif</div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.aktif + stats.closing}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No HP, nama customer, area provinsi, sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            {TABLE_EDIT_STATUSES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Sumber Lead</option>
            {LEAD_SOURCES.map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          {/* Area Filter */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer max-w-[150px]"
          >
            <option value="ALL">Semua Area (38 Prov)</option>
            {INDONESIA_PROVINCES.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 font-black uppercase text-[10px] border-b-2 border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-3 py-3 w-12 text-center">No</th>
              <th className="px-4 py-3">No. HP &amp; Nama Customer</th>
              <th className="px-4 py-3">Area (38 Provinsi)</th>
              <th className="px-4 py-3 text-center">Status Lead</th>
              <th className="px-4 py-3">Sumber &amp; Tgl</th>
              <th className="px-4 py-3">Sales (User)</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-slate-400" />
                    <p className="font-bold text-sm">Tidak ada data Lead calon pelanggan yang ditemukan.</p>
                    <button
                      onClick={openAddModal}
                      className="px-3 py-1.5 bg-blue-600 text-white font-extrabold text-xs uppercase mt-2 cursor-pointer"
                    >
                      + Tambah Lead Baru
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* 1. No. Urut */}
                  <td className="px-3 py-3 text-center font-extrabold text-slate-500 dark:text-slate-400 text-xs">
                    {idx + 1}
                  </td>

                  {/* 2. No HP & Nama Customer (Editable) */}
                  <td className="px-4 py-3">
                    <a
                      href={getWhatsAppLink(lead.nomorHP, lead.assignedSales || currentUserName)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-black text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1.5"
                      title="Klik untuk membuka WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5 text-green-500" />
                      <span>{lead.nomorHP}</span>
                    </a>

                    {/* Inline edit customer name */}
                    {editingCustomerNameId === lead.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="text"
                          value={inlineCustomerName}
                          onChange={(e) => setInlineCustomerName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInlineCustomerName(lead.id);
                            if (e.key === 'Escape') setEditingCustomerNameId(null);
                          }}
                          autoFocus
                          className="px-1.5 py-0.5 text-xs bg-slate-50 dark:bg-slate-900 border border-blue-500 text-slate-900 dark:text-white font-bold w-40"
                          placeholder="Nama Customer..."
                        />
                        <button
                          onClick={() => handleSaveInlineCustomerName(lead.id)}
                          className="p-1 bg-emerald-600 text-white font-bold cursor-pointer"
                          title="Simpan Nama"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingCustomerNameId(null)}
                          className="p-1 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                          title="Batal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-bold mt-0.5 group">
                        <span>{lead.namaCalonPelanggan || 'Customer'}</span>
                        <button
                          onClick={() => {
                            setEditingCustomerNameId(lead.id);
                            setInlineCustomerName(lead.namaCalonPelanggan || '');
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-opacity"
                          title="Edit nama customer langsung"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* 3. Area (38 Provinsi Indonesia Dropdown Editable) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <select
                        value={lead.area || 'DKI Jakarta'}
                        onChange={(e) => onUpdateLead(lead.id, { area: e.target.value })}
                        className="p-1 text-xs font-extrabold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-none cursor-pointer focus:border-blue-600"
                        title="Edit area provinsi langsung dari tabel"
                      >
                        {INDONESIA_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* 4. Status Lead (Single Interactive Colored Badge) */}
                  <td className="px-4 py-3 text-center">
                    <select
                      value={lead.statusSurvei}
                      onChange={(e) => onUpdateLead(lead.id, { statusSurvei: e.target.value as LeadSurveyStatus })}
                      className={`px-2 py-1 text-[10px] font-black uppercase border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500 rounded-none text-center shadow-2xs transition-colors ${getStatusBadgeStyle(lead.statusSurvei)}`}
                      title="Klik untuk mengubah status lead dengan cepat"
                    >
                      {TABLE_EDIT_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xs text-left">
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 5. Sumber & Tgl */}
                  <td className="px-4 py-3 text-[11px]">
                    <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-[9px] uppercase border border-blue-200 dark:border-blue-900">
                      {lead.sumberLead}
                    </span>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{lead.tanggalKontak}</span>
                    </div>
                  </td>

                  {/* 6. Sales (Sesuai nama user akun login) */}
                  <td className="px-4 py-3 text-[11px]">
                    <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate max-w-[120px]" title={lead.assignedSales || currentUserName}>
                        {lead.assignedSales || currentUserName}
                      </span>
                    </div>
                  </td>

                  {/* 7. Aksi */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Konversi ke Closing Button */}
                      {lead.statusSurvei !== 'Closing' && (
                        <button
                          onClick={() => openConvertModal(lead)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          title="Konversi Lead ini menjadi Customer Closing"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Closing</span>
                        </button>
                      )}

                      {/* WhatsApp Button */}
                      <a
                        href={getWhatsAppLink(lead.nomorHP, lead.assignedSales || currentUserName)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Chat WhatsApp Calon Pelanggan"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">WA</span>
                      </a>

                      {/* Schedule Follow Up Button */}
                      <button
                        onClick={() => openScheduleModal(lead)}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Jadwalkan Follow Up CS"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(lead)}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Edit Lead Lengkap"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Hapus Lead No HP: "${lead.nomorHP}"?`)) {
                            onDeleteLead(lead.id);
                          }
                        }}
                        className="p-1.5 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-600 cursor-pointer"
                        title="Hapus Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit Lead */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{editingLead ? 'Edit Lead' : 'Tambah Lead Baru'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs font-bold">
              {/* 1. NAMA CUSTOMER */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase font-black mb-1">
                  Nama Customer (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* 2. NOMOR WHATSAPP (WAJIB) - HANYA ANGKA */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-300 uppercase font-black">
                    Nomor WhatsApp (Wajib)
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">Hanya Angka</span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formHP}
                    onChange={(e) => setFormHP(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 3. AREA (38 PROVINSI INDONESIA) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase font-black mb-1">
                  Area (38 Provinsi Indonesia)
                </label>
                <select
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer focus:border-blue-600"
                >
                  {INDONESIA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. SUMBER LEAD */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase font-black mb-1">
                  Sumber Lead
                </label>
                <select
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value as LeadSource)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer focus:border-blue-600"
                >
                  {LEAD_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. STATUS LEAD (Sesuai mode: Add / Edit) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase font-black mb-1">
                  Status Lead
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as LeadSurveyStatus)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer focus:border-blue-600"
                >
                  {(editingLead ? TABLE_EDIT_STATUSES : ADD_LEAD_STATUSES).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. SALES (USER AKUN LOGIN) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase font-black mb-1">
                  Sales (Akun User Login)
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formSales}
                    onChange={(e) => setFormSales(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase cursor-pointer"
                >
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konversi ke Closing Customer */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-emerald-500 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>Konversi Lead ke Closing</span>
              </h3>
              <button
                onClick={() => setConvertingLead(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmConvert} className="space-y-3 text-xs font-bold">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200">
                <div className="font-extrabold">Customer: {convertingLead.namaCalonPelanggan || convertingLead.nomorHP}</div>
                <div className="text-[10px] text-slate-500">HP: {convertingLead.nomorHP} | Sales: {convertingLead.assignedSales || currentUserName}</div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Pilih Paket Internet
                </label>
                <select
                  value={convertPackageId}
                  onChange={(e) => setConvertPackageId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
                >
                  {MASTER_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.speed}) - Rp {pkg.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Periode Tagihan
                  </label>
                  <select
                    value={convertPeriode}
                    onChange={(e) => setConvertPeriode(e.target.value as BillingPeriod)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Bulanan">Bulanan</option>
                    <option value="Tahunan">Tahunan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Tanggal Pasang
                  </label>
                  <input
                    type="date"
                    required
                    value={convertTanggalPasang}
                    onChange={(e) => setConvertTanggalPasang(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  ID Pelanggan / Nomor Internet
                </label>
                <input
                  type="text"
                  required
                  value={convertNomorInternet}
                  onChange={(e) => setConvertNomorInternet(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Proses Closing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Jadwal Follow Up CS */}
      {schedulingLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-blue-600 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Jadwalkan Follow Up CS</span>
              </h3>
              <button
                onClick={() => setSchedulingLead(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-3 text-xs font-bold">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-slate-800 dark:text-slate-200">
                <div className="font-extrabold">Follow Up HP: {schedulingLead.nomorHP}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Tanggal Follow Up
                  </label>
                  <input
                    type="date"
                    required
                    value={fuTanggal}
                    onChange={(e) => setFuTanggal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Jam Follow Up
                  </label>
                  <input
                    type="time"
                    required
                    value={fuWaktu}
                    onChange={(e) => setFuWaktu(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Respon FU
                </label>
                <select
                  value={fuTipe}
                  onChange={(e) => setFuTipe(e.target.value as FollowUpType)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer font-bold"
                >
                  <option value="-">-</option>
                  <option value="Mikir-mikir">Mikir-mikir</option>
                  <option value="Diskusi">Diskusi</option>
                  <option value="Tidak mau bayar diawal">Tidak mau bayar diawal</option>
                  <option value="Cari yang murah">Cari yang murah</option>
                  <option value="Cari speed kecil">Cari speed kecil</option>
                  <option value="Tidak merespon">Tidak merespon</option>
                  <option value="Awal Bulan">Awal Bulan</option>
                  <option value="Akhir Bulan">Akhir Bulan</option>
                  <option value="Tunggu wifi lama putus">Tunggu wifi lama putus</option>
                  <option value="Menunggu form registrasi">Menunggu form registrasi</option>
                  <option value="Tidak jadi pasang">Tidak jadi pasang</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Catatan Follow Up
                </label>
                <textarea
                  rows={2}
                  value={fuCatatan}
                  onChange={(e) => setFuCatatan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSchedulingLead(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
