import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Target, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Cloud, 
  Database,
  Info,
  ShieldCheck,
  Palette,
  Square,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsViewProps {
  user: any;
  currentName: string;
  monthlyTargetSa: number;
  uiStyle?: 'klasik' | 'modern';
  onSaveSettings: (newName: string, newTargetSa: number, newUiStyle?: 'klasik' | 'modern') => Promise<void>;
  onOpenSqlModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  currentName,
  monthlyTargetSa,
  uiStyle = 'klasik',
  onSaveSettings,
  onOpenSqlModal,
}) => {
  const [fullName, setFullName] = useState(currentName);
  const [targetSa, setTargetSa] = useState<number>(monthlyTargetSa);
  const [styleMode, setStyleMode] = useState<'klasik' | 'modern'>(uiStyle);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setFullName(currentName);
  }, [currentName]);

  useEffect(() => {
    setTargetSa(monthlyTargetSa);
  }, [monthlyTargetSa]);

  useEffect(() => {
    setStyleMode(uiStyle);
  }, [uiStyle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setErrorMsg('Nama pengguna tidak boleh kosong.');
      return;
    }

    if (targetSa < 1) {
      setErrorMsg('Target SA bulanan minimal 1.');
      return;
    }

    setIsLoading(true);
    try {
      await onSaveSettings(trimmedName, targetSa, styleMode);
      setSuccessMsg('Pengaturan berhasil disimpan!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2 sm:p-4 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-none border-2 border-blue-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
              Pengaturan Sistem & Profil
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Atur profil pengguna dan target bulanan Sales Active (SA) untuk dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 uppercase">
              <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              Cloud Synchronized
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-extrabold text-xs flex items-center gap-1.5 uppercase">
              <Cloud className="w-3.5 h-3.5 text-amber-500" />
              Mode Tamu (Local)
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Messages */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 font-bold text-xs uppercase animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3 font-bold text-xs uppercase animate-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION 1: PROFIL PENGGUNA */}
        <div className="p-5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
              Profil Pengguna
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Nama Lengkap / Tampilan
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama pengguna..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Nama ini muncul di bilah navigasi utama sebelah tombol logout.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Status Akun & Email
              </label>
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                {user ? user.email : 'Tamu (Offline / Local Storage)'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {user ? 'Akun Anda terhubung dengan Supabase Cloud Storage.' : 'Data tersimpan lokal di browser ini.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: MODE TAMPILAN (STYLE UI) */}
        <div className="p-5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <Palette className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Gaya Tampilan (UI Style Mode)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Pilih gaya tampilan bentuk sudut antarmuka aplikasi sesuai selera Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Klasik */}
            <button
              type="button"
              onClick={() => setStyleMode('klasik')}
              className={`p-4 border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                styleMode === 'klasik'
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 border-2 ${styleMode === 'klasik' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Square className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
                  Mode Klasik (Flat & Boxy)
                  {styleMode === 'klasik' && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold uppercase">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                  Tampilan kaku & tegas dengan sudut tajam (0px border-radius) khas sistem enterprise/dashboard.
                </p>
              </div>
            </button>

            {/* Option 2: Modern */}
            <button
              type="button"
              onClick={() => setStyleMode('modern')}
              className={`p-4 border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                styleMode === 'modern'
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 border-2 ${styleMode === 'modern' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
                  Mode Modern (Fresh Rounded)
                  {styleMode === 'modern' && (
                    <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold uppercase">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                  Tampilan modern & fresh dengan sudut membulat halus (rounded-xl) dan bayangan lembut.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 3: TARGET SA BULANAN */}
        <div className="p-5 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Target Sales Active (SA) Per Bulan
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Independen dari tier komisi. Ditampilkan khusus pada card target bulanan di Dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Jumlah Target SA Bulanan
              </label>
              <div className="flex items-center gap-3">
                <div className="relative max-w-xs w-full">
                  <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={targetSa}
                    onChange={(e) => setTargetSa(parseInt(e.target.value, 10) || 0)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono font-black text-sm focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                  SA / Bulan
                </span>
              </div>
            </div>

            {/* Explanatory Box */}
            <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-900 flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
                <strong>Catatan Penting:</strong> Target SA bulanan ini digunakan untuk mengukur progres pencapaian target kerja pribadi Anda setiap bulan. Perhitungan tier komisi (Tier 1-4) tetap mengacu pada aturan resmi skema penutupan SA dan revenue bersih.
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black text-xs uppercase border-2 border-blue-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
