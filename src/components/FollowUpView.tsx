import React, { useState, useMemo } from 'react';
import { FollowUpSchedule, FollowUpType, FollowUpStatus, LeadSurveyStatus } from '../types/crm';
import { MASTER_PACKAGES } from '../data/packages';
import { BillingPeriod } from '../types/customer';
import { 
  Clock, 
  Search, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  X, 
  User, 
  Phone, 
  Edit3, 
  Trash2, 
  Filter, 
  ExternalLink,
  Check,
  RotateCcw,
  Package,
  Tag,
  CheckSquare
} from 'lucide-react';

interface FollowUpViewProps {
  schedules: FollowUpSchedule[];
  onAddSchedule: (schedule: Omit<FollowUpSchedule, 'id' | 'createdAt'>) => void;
  onUpdateSchedule: (id: string, updates: Partial<FollowUpSchedule>) => void;
  onDeleteSchedule: (id: string) => void;
  onBulkDeleteSchedules?: (ids: string[]) => void;
  onConvertToClosing?: (schedule: FollowUpSchedule) => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onBulkDeleteSchedules,
  onConvertToClosing,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'all'>('today');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Bulk Selection States
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkCompleteModalOpen, setIsBulkCompleteModalOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<FollowUpSchedule | null>(null);
  const [completingSchedule, setCompletingSchedule] = useState<FollowUpSchedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<FollowUpSchedule | null>(null);
  const [completeNotes, setCompleteNotes] = useState('');

  // Form states for Add / Edit
  const [formNama, setFormNama] = useState('');
  const [formHP, setFormHP] = useState('');
  const [formTipe, setFormTipe] = useState<FollowUpType>('-');
  const [formTanggal, setFormTanggal] = useState(todayStr);
  const [formWaktu, setFormWaktu] = useState('10:00');
  const [formCustomerType, setFormCustomerType] = useState<'Lead' | 'Prospek' | 'Pelanggan Aktif'>('Lead');
  const [formStatus, setFormStatus] = useState<FollowUpStatus>('Thinking');
  const [formPackageId, setFormPackageId] = useState<string>('pkg-50-a');
  const [formPeriode, setFormPeriode] = useState<BillingPeriod>('Bulanan');
  const [formNomorInternet, setFormNomorInternet] = useState<string>('');
  const [formCatatan, setFormCatatan] = useState('');
  const [formKeterangan, setFormKeterangan] = useState('');

  const getStatusBadgeStyle = (status: string) => {
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
        return 'bg-emerald-600 text-white border-emerald-700 font-extrabold';
      case 'Ghosting':
        return 'bg-purple-950 text-purple-200 border-purple-800 font-extrabold';
      case 'Batal':
        return 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600';
      case 'Selesai':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Reschedule':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300';
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const todaySchedules = schedules.filter(s => s.tanggalFollowUp === todayStr && s.status === 'Menunggu');
    const overdueSchedules = schedules.filter(s => s.tanggalFollowUp < todayStr && s.status === 'Menunggu');
    const completedToday = schedules.filter(s => s.tanggalFollowUp === todayStr && s.status === 'Selesai');
    const total = schedules.length;

    return {
      todayCount: todaySchedules.length,
      overdueCount: overdueSchedules.length,
      completedTodayCount: completedToday.length,
      total,
    };
  }, [schedules, todayStr]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      // Search
      const matchSearch =
        (s.namaCustomer && s.namaCustomer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.nomorHP.includes(searchQuery) ||
        (s.catatanHasil && s.catatanHasil.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const matchType = typeFilter === 'ALL' || s.tipeFollowUp === typeFilter;

      // Tab filter
      let matchTab = true;
      if (activeTab === 'today') {
        matchTab = s.tanggalFollowUp === todayStr;
      } else if (activeTab === 'upcoming') {
        matchTab = s.tanggalFollowUp > todayStr && s.status === 'Menunggu';
      } else if (activeTab === 'overdue') {
        matchTab = s.tanggalFollowUp < todayStr && s.status === 'Menunggu';
      } else if (activeTab === 'completed') {
        matchTab = s.status === 'Selesai';
      }

      return matchSearch && matchType && matchTab;
    });
  }, [schedules, searchQuery, typeFilter, activeTab, todayStr]);

  // Bulk Selection Helpers
  const isAllSelected = useMemo(() => {
    return (
      filteredSchedules.length > 0 &&
      filteredSchedules.every((s) => selectedScheduleIds.includes(s.id))
    );
  }, [filteredSchedules, selectedScheduleIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedScheduleIds([]);
    } else {
      setSelectedScheduleIds(filteredSchedules.map((s) => s.id));
    }
  };

  const handleToggleSelectSchedule = (id: string) => {
    setSelectedScheduleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedScheduleIds.length === 0) return;
    if (onBulkDeleteSchedules) {
      onBulkDeleteSchedules(selectedScheduleIds);
    } else {
      selectedScheduleIds.forEach((id) => onDeleteSchedule(id));
    }
    setSelectedScheduleIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleConfirmBulkComplete = () => {
    if (selectedScheduleIds.length === 0) return;
    selectedScheduleIds.forEach((id) => {
      onUpdateSchedule(id, {
        status: 'Selesai',
        catatanHasil: 'Selesai di-follow up massal',
      });
    });
    setSelectedScheduleIds([]);
    setIsBulkCompleteModalOpen(false);
  };

  // Handle WhatsApp Message template generator
  const getWhatsAppLink = (s: FollowUpSchedule) => {
    let cleanPhone = s.nomorHP.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    let defaultMsg = `Halo Kak ${s.namaCustomer || 'Customer'}, dari Oxygen.id Internet.`;

    switch (s.tipeFollowUp) {
      case 'Mikir-mikir':
        defaultMsg += ` Mengenai rencana pemasangan internet Oxygen.id, apakah ada hal yang masih dipertimbangkan Kak? Kami siap membantu penjelasan lebih detail.`;
        break;
      case 'Diskusi':
        defaultMsg += ` Mengenai rencana perbandingan & diskusi paket internet Oxygen.id, apakah ada informasi paket yang perlu kami bantu jelaskan lagi?`;
        break;
      case 'Tidak mau bayar diawal':
        defaultMsg += ` Mengenai skema pembayaran promo paket internet Oxygen.id, kami ada penjelasan promo terbaik yang fleksibel sesuai kebutuhan Kakak.`;
        break;
      case 'Cari yang murah':
        defaultMsg += ` Mengenai pencarian paket internet hemat, kami punya pilihan paket promo terjangkau Oxygen.id khusus bulan ini.`;
        break;
      case 'Cari speed kecil':
        defaultMsg += ` Mengenai kebutuhan kecepatan internet rumah tangga, kami memiliki paket kecepatan hemat dan fleksibel.`;
        break;
      case 'Tidak merespon':
        defaultMsg += ` Mengonfirmasi kembali mengenai minat pesan internet Oxygen.id. Apabila Kakak membutuhkan informasi promo & pendaftaran, silakan hubungi kami kembali ya Kak.`;
        break;
      case 'Awal Bulan':
        defaultMsg += ` Mengingatkan kembali jadwal pendaftaran & pemasangan internet Oxygen.id Kakak di awal bulan ini. Apakah sudah siap diproses?`;
        break;
      case 'Akhir Bulan':
        defaultMsg += ` Mengingatkan kembali jadwal pendaftaran & pemasangan internet Oxygen.id Kakak di akhir bulan ini. Apakah sudah siap diproses?`;
        break;
      case 'Tunggu wifi lama putus':
        defaultMsg += ` Mengonfirmasi masa aktif layanan wifi lama Kakak. Apakah jadwal peralihan ke internet Oxygen.id sudah bisa kami jadwalkan?`;
        break;
      case 'Menunggu form registrasi':
        defaultMsg += ` Mengenai pendaftaran akun internet Oxygen.id, apakah form registrasi Kakak butuh bantuan untuk pengisian data?`;
        break;
      case 'Tidak jadi pasang':
        defaultMsg += ` Halo Kak, mengonfirmasi kembali mengenai layanan internet Oxygen.id. Apabila membutuhkan bantuan di kemudian hari, kami siap melayani Kakak.`;
        break;
      default:
        defaultMsg += ` Ada yang bisa kami bantu mengenai layanan internet Oxygen.id?`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`;
  };

  const openAddModal = () => {
    setFormNama('');
    setFormHP('');
    setFormTipe('-');
    setFormTanggal(todayStr);
    setFormWaktu('10:00');
    setFormCustomerType('Lead');
    setFormStatus('Thinking');
    setFormPackageId('pkg-50-a');
    setFormPeriode('Bulanan');
    setFormNomorInternet('');
    setFormCatatan('');
    setFormKeterangan('');
    setEditingSchedule(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (s: FollowUpSchedule) => {
    setEditingSchedule(s);
    setFormNama(s.namaCustomer || '');
    setFormHP(s.nomorHP || '');
    setFormTipe(s.tipeFollowUp || '-');
    setFormTanggal(s.tanggalFollowUp);
    setFormWaktu(s.waktuFollowUp);
    setFormCustomerType(s.customerType || 'Lead');
    setFormStatus(s.status || 'Thinking');
    setFormPackageId(s.packageId || 'pkg-50-a');
    setFormPeriode(s.periode || 'Bulanan');
    setFormNomorInternet(s.nomorInternet || '');
    setFormCatatan(s.catatanHasil || '');
    setFormKeterangan(s.keterangan || s.catatanHasil || '');
    setIsAddModalOpen(true);
  };

  const handleUpdateStatus = (s: FollowUpSchedule, newStatus: FollowUpStatus) => {
    onUpdateSchedule(s.id, { status: newStatus });
    if (newStatus === 'Closing' && onConvertToClosing) {
      onConvertToClosing({ ...s, status: 'Closing' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHP.trim()) {
      alert('No. HP / WhatsApp wajib diisi!');
      return;
    }

    const finalNama = formNama.trim() || 'Customer';
    const selectedPkg = MASTER_PACKAGES.find((p) => p.id === formPackageId) || MASTER_PACKAGES[0];

    const payloadData = {
      namaCustomer: finalNama,
      nomorHP: formHP.trim(),
      tipeFollowUp: formTipe,
      tanggalFollowUp: formTanggal,
      waktuFollowUp: formWaktu,
      status: formStatus,
      customerType: formCustomerType,
      catatanHasil: formCatatan || formKeterangan,
      keterangan: formKeterangan,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      packagePrice: selectedPkg.price,
      periode: formPeriode,
      nomorInternet: formNomorInternet.trim() || undefined,
    };

    if (editingSchedule) {
      onUpdateSchedule(editingSchedule.id, payloadData);
      if (formStatus === 'Closing' && onConvertToClosing) {
        onConvertToClosing({ ...editingSchedule, ...payloadData, id: editingSchedule.id, createdAt: editingSchedule.createdAt });
      }
    } else {
      const newSchedule = {
        ...payloadData,
        id: `fu-${Date.now().toString().slice(-5)}`,
        createdAt: new Date().toISOString(),
      };
      onAddSchedule(payloadData);
      if (formStatus === 'Closing' && onConvertToClosing) {
        onConvertToClosing(newSchedule as FollowUpSchedule);
      }
    }

    setIsAddModalOpen(false);
  };

  const handleMarkComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingSchedule) return;

    onUpdateSchedule(completingSchedule.id, {
      status: 'Selesai',
      catatanHasil: completeNotes ? `${completingSchedule.catatanHasil || ''} [Selesai: ${completeNotes}]`.trim() : completingSchedule.catatanHasil,
    });

    setCompletingSchedule(null);
    setCompleteNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0F172A] p-5 border-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Reminder Follow Up Customer
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            Agenda kontak harian CS untuk menghubungi prospek lead, penawaran, pengecekan H+3 pasang, dan penagihan dengan integrasi WhatsApp langsung.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Schedule Follow Up</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('today')}
          className={`p-4 text-left border-2 cursor-pointer transition-all ${
            activeTab === 'today'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-blue-400'
          }`}
        >
          <div className="text-[10px] font-black uppercase opacity-80">Jadwal Hari Ini</div>
          <div className="text-2xl font-black mt-1">{stats.todayCount}</div>
          <div className="text-[10px] opacity-80 font-bold mt-0.5">Perlu Dihubungi</div>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`p-4 text-left border-2 cursor-pointer transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-600 text-white border-rose-700 shadow-md'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:border-rose-400'
          }`}
        >
          <div className="text-[10px] font-black uppercase opacity-80">Terlewat (Overdue)</div>
          <div className="text-2xl font-black mt-1">{stats.overdueCount}</div>
          <div className="text-[10px] opacity-80 font-bold mt-0.5">Butuh Perhatian Segera</div>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`p-4 text-left border-2 cursor-pointer transition-all ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400'
          }`}
        >
          <div className="text-[10px] font-black uppercase opacity-80">Selesai Hari Ini</div>
          <div className="text-2xl font-black mt-1">{stats.completedTodayCount}</div>
          <div className="text-[10px] opacity-80 font-bold mt-0.5">Sudah Kontak</div>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 text-left border-2 cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white border-slate-950 dark:bg-slate-800 shadow-md'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-slate-400'
          }`}
        >
          <div className="text-[10px] font-black uppercase opacity-80">Total agenda</div>
          <div className="text-2xl font-black mt-1">{stats.total}</div>
          <div className="text-[10px] opacity-80 font-bold mt-0.5">Semua Record FU</div>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="p-4 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-black uppercase">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-2 cursor-pointer border ${
                activeTab === 'today'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Hari Ini ({schedules.filter(s => s.tanggalFollowUp === todayStr).length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-2 cursor-pointer border ${
                activeTab === 'overdue'
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Terlewat ({schedules.filter(s => s.tanggalFollowUp < todayStr && s.status === 'Menunggu').length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-2 cursor-pointer border ${
                activeTab === 'upcoming'
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Mendatang ({schedules.filter(s => s.tanggalFollowUp > todayStr && s.status === 'Menunggu').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-2 cursor-pointer border ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Selesai
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 cursor-pointer border ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white border-slate-950 dark:bg-slate-800'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari customer, HP, catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>
        </div>

        {/* Type Filter Dropdown */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
          <span className="text-slate-500 uppercase text-[10px]">Filter Respon FU:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs cursor-pointer font-bold"
          >
            <option value="ALL">Semua Respon FU</option>
            <option value="-">- (Default / Belum Ada)</option>
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
      </div>

      {/* Sticky Bulk Action Banner */}
      {selectedScheduleIds.length > 0 && (
        <div className="bg-blue-900 text-white p-3 border-2 border-blue-600 flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 font-extrabold text-xs">
            <span className="px-2.5 py-1 bg-blue-600 text-white font-black text-xs uppercase tracking-wide">
              {selectedScheduleIds.length} Agenda Terpilih
            </span>
            <span className="text-blue-200 hidden sm:inline">
              dari total {filteredSchedules.length} agenda
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tandai Selesai Massal */}
            <button
              onClick={() => setIsBulkCompleteModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tandai Selesai Massal</span>
            </button>

            {/* Hapus Massal */}
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedScheduleIds.length})</span>
            </button>

            {/* Batal Pilihan */}
            <button
              onClick={() => setSelectedScheduleIds([])}
              className="px-3 py-1.5 bg-blue-950 hover:bg-blue-800 text-blue-200 font-bold text-xs uppercase cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Follow Up Schedule Table */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 font-black uppercase text-[10px] border-b-2 border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-3 py-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 cursor-pointer accent-blue-600 rounded-none shrink-0"
                  title="Pilih Semua / Batal Pilih"
                />
              </th>
              <th className="px-4 py-3">Customer / Kontak</th>
              <th className="px-4 py-3">Respon FU &amp; Catatan</th>
              <th className="px-4 py-3">Paket &amp; Periode</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Jadwal (Tgl &amp; Waktu)</th>
              <th className="px-4 py-3">Keterangan</th>
              <th className="px-4 py-3 text-right">Integrasi WA &amp; Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="w-8 h-8 text-slate-400" />
                    <p className="font-bold text-sm">Tidak ada jadwal Follow Up pada kategori ini.</p>
                    <button
                      onClick={openAddModal}
                      className="px-3 py-1.5 bg-blue-600 text-white font-extrabold text-xs uppercase mt-2 cursor-pointer"
                    >
                      + Tambah Schedule Baru
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSchedules.map((s) => {
                const isOverdue = s.tanggalFollowUp < todayStr && s.status === 'Menunggu';
                const isToday = s.tanggalFollowUp === todayStr;
                const isSelected = selectedScheduleIds.includes(s.id);

                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40'
                        : isOverdue
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Checkbox Row */}
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectSchedule(s.id)}
                        className="w-4 h-4 cursor-pointer accent-blue-600 rounded-none shrink-0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-black text-slate-900 dark:text-white text-sm">
                        {s.namaCustomer || 'Customer'}
                      </div>
                      <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                        {s.nomorHP}
                      </div>
                      <span className="inline-block mt-1 px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold uppercase border border-slate-300 dark:border-slate-700">
                        {s.customerType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {s.tipeFollowUp}
                      </div>
                      {s.catatanHasil && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs line-clamp-2">
                          {s.catatanHasil}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {s.packageName ? (
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                            {s.packageName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold flex flex-wrap items-center gap-1 mt-0.5">
                            <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 uppercase font-black text-[9px]">
                              {s.periode || 'Bulanan'}
                            </span>
                            <span>Rp{(s.packagePrice || 0).toLocaleString('id-ID')}</span>
                          </div>
                          {s.nomorInternet && (
                            <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                              ID: {s.nomorInternet}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Stream 50 Mbps</span>
                          <div className="text-[10px] text-slate-400 font-semibold">Bulanan (Rp185.000)</div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <select
                        value={s.status}
                        onChange={(e) => handleUpdateStatus(s, e.target.value as FollowUpStatus)}
                        className={`px-2 py-1 text-[10px] font-black uppercase border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500 rounded-none text-center shadow-2xs transition-colors ${getStatusBadgeStyle(s.status)}`}
                      >
                        <option value="New Customer">New Customer</option>
                        <option value="NBP">NBP</option>
                        <option value="Interest">Interest</option>
                        <option value="Thinking">Thinking</option>
                        <option value="Uncover">Uncover</option>
                        <option value="Area Full">Area Full</option>
                        <option value="Pemasangan">Pemasangan</option>
                        <option value="Closing">Closing (Otomatis Ke Revenue)</option>
                        <option value="Ghosting">Ghosting (Customer Hilang)</option>
                        <option value="Batal">Batal</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Refund">Refund</option>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Reschedule">Reschedule</option>
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{s.tanggalFollowUp}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                        Pukul {s.waktuFollowUp} WIB
                      </div>
                      {isOverdue && (
                        <span className="text-[9px] font-black text-rose-600 uppercase flex items-center gap-0.5 mt-0.5">
                          <AlertCircle className="w-3 h-3" /> Terlewat
                        </span>
                      )}
                    </td>

                    {/* Keterangan (Editable) */}
                    <td className="px-4 py-3 text-[11px]">
                      <input
                        type="text"
                        defaultValue={s.keterangan ?? s.catatanHasil ?? ''}
                        key={`${s.id}-${s.keterangan || s.catatanHasil}`}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val !== (s.keterangan || s.catatanHasil || '')) {
                            onUpdateSchedule(s.id, { keterangan: val, catatanHasil: val });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        placeholder="Input keterangan..."
                        className="w-full min-w-[130px] px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
                        title="Klik untuk edit keterangan FU"
                      />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct WhatsApp button */}
                        <a
                          href={getWhatsAppLink(s)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white font-black text-[11px] uppercase flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          title="Kirim pesan WhatsApp otomatis sesuai template"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>

                        {/* Mark Selesai */}
                        {s.status !== 'Selesai' && (
                          <button
                            onClick={() => {
                              setCompletingSchedule(s);
                              setCompleteNotes('');
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Tandai Selesai"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                          title="Edit Jadwal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeletingSchedule(s)}
                          className="p-1.5 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-600 cursor-pointer"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>{editingSchedule ? 'Edit Schedule Follow Up' : 'Tambah Schedule Follow Up'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Nama Customer (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Budi Santoso (kosongkan jika belum ada nama)"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    No. HP / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={formHP}
                    onChange={(e) => setFormHP(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Tipe Customer
                  </label>
                  <select
                    value={formCustomerType}
                    onChange={(e) => setFormCustomerType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer font-bold"
                  >
                    <option value="Lead">Lead (Masih Baru)</option>
                    <option value="Prospek">Prospek (Siap Pasang)</option>
                    <option value="Pelanggan Aktif">Pelanggan Aktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Respon FU
                  </label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as FollowUpType)}
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
                    Status Lead / FU
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as FollowUpStatus)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer font-bold"
                  >
                    <option value="New Customer">New Customer</option>
                    <option value="NBP">NBP</option>
                    <option value="Interest">Interest</option>
                    <option value="Thinking">Thinking</option>
                    <option value="Uncover">Uncover</option>
                    <option value="Area Full">Area Full</option>
                    <option value="Pemasangan">Pemasangan</option>
                    <option value="Closing">Closing (Otomatis ke Revenue)</option>
                    <option value="Ghosting">Ghosting (Customer Hilang)</option>
                    <option value="Batal">Batal</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Refund">Refund</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Paket Internet
                  </label>
                  <select
                    value={formPackageId}
                    onChange={(e) => setFormPackageId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer font-bold"
                  >
                    {MASTER_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - Rp{pkg.price.toLocaleString('id-ID')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Periode Billing
                  </label>
                  <select
                    value={formPeriode}
                    onChange={(e) => setFormPeriode(e.target.value as BillingPeriod)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer font-bold"
                  >
                    <option value="Bulanan">Bulanan</option>
                    <option value="3 Bulan">3 Bulan</option>
                    <option value="6 Bulan">6 Bulan</option>
                    <option value="Tahunan">Tahunan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Tanggal Follow Up
                  </label>
                  <input
                    type="date"
                    required
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="time"
                    required
                    value={formWaktu}
                    onChange={(e) => setFormWaktu(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Catatan Agenda / Hasil
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail instruksi atau respon kontak..."
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tambahan..."
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Mark Complete */}
      {completingSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-emerald-500 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Konfirmasi Follow Up Selesai</span>
              </h3>
              <button
                onClick={() => setCompletingSchedule(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tandai agenda follow up untuk <span className="text-blue-600 font-extrabold">{completingSchedule.namaCustomer}</span> ({completingSchedule.tipeFollowUp}) sebagai <span className="text-emerald-600">Selesai</span>.
            </div>

            <form onSubmit={handleMarkComplete} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Catatan Hasil Kontak (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Pelanggan merespon positif, janji kirim bukti transfer jam 15..."
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCompletingSchedule(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase cursor-pointer"
                >
                  Tandai Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Agenda Follow Up */}
      {deletingSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-rose-500 max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
                  Konfirmasi Hapus Agenda
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Apakah Anda yakin ingin menghapus agenda follow up ini?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="font-extrabold text-slate-800 dark:text-slate-200">
                {deletingSchedule.namaCustomer || 'Customer'}
              </div>
              <div className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                No HP: {deletingSchedule.nomorHP}
              </div>
              <div className="text-[11px] text-slate-500">
                Tanggal: <span className="font-bold">{deletingSchedule.tanggalFollowUp}</span> ({deletingSchedule.tipeFollowUp})
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingSchedule(null)}
                className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteSchedule(deletingSchedule.id);
                  setDeletingSchedule(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold uppercase text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Agenda</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Massal Agenda Follow Up */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-rose-500 max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
                  Hapus {selectedScheduleIds.length} Agenda sekaligus?
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Tindakan ini akan menghapus seluruh agenda follow up yang dicentang secara permanen.
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-bold">
              Total {selectedScheduleIds.length} item agenda follow up terpilih akan dihapus.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold uppercase text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus {selectedScheduleIds.length} Agenda</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Tandai Selesai Massal */}
      {isBulkCompleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-emerald-500 max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
                  Tandai {selectedScheduleIds.length} Agenda Selesai?
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Semua agenda follow up terpilih akan diubah statusnya menjadi Selesai.
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              Total {selectedScheduleIds.length} agenda akan ditandai selesai sekaligus.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkCompleteModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkComplete}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tandai Selesai ({selectedScheduleIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
