import React, { useState, useEffect } from 'react';
import { X, User, Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  user: any;
  onSuccess: (updatedUser?: any, newName?: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentName,
  user,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setFullName(currentName);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [currentName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setErrorMsg('Nama pengguna tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        // Update user metadata in Supabase Auth
        const { data, error } = await supabase.auth.updateUser({
          data: {
            full_name: trimmedName,
          },
        });

        if (error) {
          throw error;
        }

        // Optional update in profiles table if created
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: trimmedName,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Ignore if profiles table does not exist
        }

        setSuccessMsg('Nama berhasil diperbarui di akun Cloud!');
        setTimeout(() => {
          onSuccess(data.user, trimmedName);
          onClose();
        }, 800);
      } else {
        // Guest mode: Save locally
        localStorage.setItem('isp_crm_guest_name', trimmedName);
        setSuccessMsg('Nama pengguna tamu berhasil disimpan!');
        setTimeout(() => {
          onSuccess(null, trimmedName);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('Error updating name:', err);
      setErrorMsg(err.message || 'Gagal memperbarui nama pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-none bg-blue-600 text-white border border-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] uppercase tracking-wide">
                Edit Nama Pengguna
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {user ? `Akun Terhubung: ${user.email}` : 'Ubah nama tampilan mode tamu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[12px]">
          {errorMsg && (
            <div className="p-3 rounded-none bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-none bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Nama Lengkap / Tampilan
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Masukkan nama pengguna..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-none text-slate-900 dark:text-slate-100 font-bold focus:outline-hidden focus:border-blue-600"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Nama ini akan ditampilkan di navbar navigasi atas di samping tombol logout.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-extrabold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-none border-2 border-slate-300 dark:border-slate-700 uppercase cursor-pointer text-[11px]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-none border-2 border-blue-700 transition-all flex items-center gap-2 uppercase cursor-pointer text-[11px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
