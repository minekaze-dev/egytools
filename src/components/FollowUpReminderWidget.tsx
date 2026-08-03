import React from 'react';
import { FollowUpSchedule, Lead } from '../types/crm';
import { Clock, MessageSquare, AlertCircle, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';

interface FollowUpReminderWidgetProps {
  schedules: FollowUpSchedule[];
  leads: Lead[];
  onNavigateTab: (tab: 'follow_up' | 'leads') => void;
  onUpdateScheduleStatus: (id: string, status: 'Selesai') => void;
}

export const FollowUpReminderWidget: React.FC<FollowUpReminderWidgetProps> = ({
  schedules,
  onNavigateTab,
  onUpdateScheduleStatus,
}) => {
  const getLocalDateStr = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const normalizeDateStr = (rawStr: string) => {
    if (!rawStr) return '';
    if (rawStr.includes('T')) return rawStr.split('T')[0];
    const parts = rawStr.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const m = String(parts[1]).padStart(2, '0');
      const d = String(parts[2]).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return rawStr;
  };

  const todayStr = getLocalDateStr();

  // All active/pending FU schedules (status is not Selesai, Closing, or Batal)
  const pendingSchedules = schedules.filter(
    s => s.status !== 'Selesai' && s.status !== 'Closing' && s.status !== 'Batal'
  );

  // Today's pending schedules
  const todayPending = pendingSchedules.filter(s => normalizeDateStr(s.tanggalFollowUp) === todayStr);

  // Overdue schedules (before today)
  const overduePending = pendingSchedules.filter(s => normalizeDateStr(s.tanggalFollowUp) < todayStr);

  // Upcoming schedules (after today)
  const upcomingPending = pendingSchedules
    .filter(s => normalizeDateStr(s.tanggalFollowUp) > todayStr)
    .sort((a, b) => normalizeDateStr(a.tanggalFollowUp).localeCompare(normalizeDateStr(b.tanggalFollowUp)));

  const getWhatsAppLink = (s: FollowUpSchedule) => {
    let cleanPhone = (s.nomorHP || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Widget 1: Agenda Follow Up Hari Ini & Terlewat */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 p-4 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 bg-blue-600 text-white font-black text-xs uppercase flex items-center gap-1">
                <Clock className="w-4 h-4" /> Reminder CS
              </span>
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
                Agenda Hari Ini ({todayPending.length})
              </h3>
              {overduePending.length > 0 && (
                <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold text-[10px] border border-rose-300 dark:border-rose-800 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-600" /> {overduePending.length} Terlewat
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigateTab('follow_up')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 uppercase flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Buka Modul FU</span>
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
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                      title="Tandai Selesai Follow Up"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done FU</span>
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
                        Pukul {item.waktuFollowUp || '09:00'} WIB
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
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                      title="Tandai Selesai Follow Up"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done FU</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Widget 2: Agenda Follow Up Mendatang */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 p-4 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 bg-indigo-600 text-white font-black text-xs uppercase flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Agenda CS
              </span>
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
                Agenda Mendatang ({upcomingPending.length})
              </h3>
            </div>

            <button
              onClick={() => onNavigateTab('follow_up')}
              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 uppercase flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Buka Modul FU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingPending.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              <Calendar className="w-7 h-7 mx-auto text-indigo-400 mb-1" />
              <p className="font-bold">Tidak ada agenda follow up mendatang.</p>
              <p className="text-[10px] text-slate-400">Jadwalkan follow up baru melalui menu Follow Up atau Leads.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {upcomingPending.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 dark:text-white truncate">
                        {item.namaCustomer}
                      </span>
                      <span className="px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-[9px] uppercase border border-indigo-300 dark:border-indigo-800">
                        {item.tanggalFollowUp} &bull; {item.waktuFollowUp || '09:00'} WIB
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
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                      title="Tandai Selesai Follow Up"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done FU</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

