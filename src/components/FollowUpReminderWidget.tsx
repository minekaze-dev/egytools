import React from 'react';
import { FollowUpSchedule, Lead } from '../types/crm';
import { Clock, MessageSquare, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Users } from 'lucide-react';

interface FollowUpReminderWidgetProps {
  schedules: FollowUpSchedule[];
  leads: Lead[];
  onNavigateTab: (tab: 'follow_up' | 'leads') => void;
  onUpdateScheduleStatus: (id: string, status: 'Selesai') => void;
}

export const FollowUpReminderWidget: React.FC<FollowUpReminderWidgetProps> = ({
  schedules,
  leads,
  onNavigateTab,
  onUpdateScheduleStatus,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Schedules created from leads or general pending FU
  const leadSchedules = schedules.filter(
    s => s.customerType === 'Lead' || s.customerType === 'Prospek' || Boolean(s.referenceId) || !s.customerType
  );

  // Today's pending schedules
  const todayPending = leadSchedules.filter(s => s.tanggalFollowUp === todayStr && s.status === 'Menunggu');
  
  // Overdue schedules
  const overduePending = leadSchedules.filter(s => s.tanggalFollowUp < todayStr && s.status === 'Menunggu');

  // Leads ready for closing (status Pemasangan / Closing)
  const readyForClosingLeads = leads.filter(l => l.statusSurvei === 'Pemasangan');

  const getWhatsAppLink = (s: FollowUpSchedule) => {
    let cleanPhone = s.nomorHP.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Halo Kak ${s.namaCustomer || 'Customer'}, dari Oxygen.id Internet. Mengenai ${s.tipeFollowUp}, apakah ada yang bisa kami bantu?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Widget 1: Reminder Follow Up CS Harian (2 cols) */}
      <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600 text-white font-black text-xs uppercase flex items-center gap-1">
              <Clock className="w-4 h-4" /> Reminder CS
            </span>
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
              Agenda Follow Up Hari Ini ({todayPending.length})
            </h3>
            {overduePending.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold text-[10px] border border-rose-300 dark:border-rose-800 uppercase flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-600" /> {overduePending.length} Terlewat
              </span>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('follow_up')}
            className="text-xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 uppercase flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Modul Follow Up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of today & overdue items */}
        {todayPending.length === 0 && overduePending.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-500 mb-1" />
            <p className="font-bold">Tidak ada tunggakan agenda follow up untuk hari ini.</p>
            <p className="text-[10px] text-slate-400">Semua kontak pelanggan telah dihubungi!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {/* Overdue items first */}
            {overduePending.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white truncate">
                      {item.namaCustomer}
                    </span>
                    <span className="px-1.5 py-0.2 bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-black text-[9px] uppercase">
                      TERLEWAT ({item.tanggalFollowUp})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.tipeFollowUp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={getWhatsAppLink(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white font-extrabold text-[10px] uppercase flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WA</span>
                  </a>
                  <button
                    onClick={() => onUpdateScheduleStatus(item.id, 'Selesai')}
                    className="p-1 bg-emerald-600 text-white font-extrabold text-[10px] uppercase cursor-pointer"
                    title="Tandai Selesai"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Today items */}
            {todayPending.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white truncate">
                      {item.namaCustomer}
                    </span>
                    <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[9px] uppercase">
                      Pukul {item.waktuFollowUp} WIB
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.tipeFollowUp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={getWhatsAppLink(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white font-extrabold text-[10px] uppercase flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WA</span>
                  </a>
                  <button
                    onClick={() => onUpdateScheduleStatus(item.id, 'Selesai')}
                    className="p-1 bg-emerald-600 text-white font-extrabold text-[10px] uppercase cursor-pointer"
                    title="Tandai Selesai"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Widget 2: Quick Leads Alert (1 col) */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-600 text-white font-black text-xs uppercase flex items-center gap-1">
              <Users className="w-4 h-4" /> Leads OK
            </span>
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
              Siap Closing ({readyForClosingLeads.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('leads')}
            className="text-xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 uppercase flex items-center gap-1 cursor-pointer"
          >
            <span>Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {readyForClosingLeads.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            <Users className="w-7 h-7 mx-auto text-slate-400 mb-1" />
            <p className="font-bold">Belum ada Lead berstatus Pemasangan.</p>
            <p className="text-[10px] text-slate-400">Ubah status lead di menu Leads untuk siap closing.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {readyForClosingLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-slate-900 dark:text-white text-xs truncate">
                    {lead.namaCalonPelanggan}
                  </span>
                  <span className={`px-1.5 py-0.5 font-black text-[9px] uppercase border ${
                    lead.statusSurvei === 'Pemasangan'
                      ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800'
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    {lead.statusSurvei}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                  {lead.area} &bull; Paket: {lead.paketDiminati}
                </div>
                <button
                  onClick={() => onNavigateTab('leads')}
                  className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Proses Closing di Menu Leads</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
