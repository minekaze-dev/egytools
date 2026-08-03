import React, { useState } from 'react';
import { Database, Copy, Check, X, Code, ShieldCheck, Terminal } from 'lucide-react';

interface SupabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SUPABASE_SQL_SCRIPT = `-- ========================================================
-- OXYTOOL CRM: SUPABASE DATABASE SETUP SCRIPT
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xlaanrhjojnijmqfjsir/sql
-- ========================================================

-- 1. Create the customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "namaPelanggan" TEXT NOT NULL,
  "nomorInternet" TEXT,
  "nomorHP" TEXT,
  area TEXT DEFAULT '-',
  sales TEXT,
  "packageId" TEXT,
  "packageName" TEXT,
  "packagePrice" NUMERIC DEFAULT 0,
  periode TEXT,
  "tanggalPasang" TEXT,
  status TEXT DEFAULT 'Aktif',
  catatan TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the leads table (Connected to customers - Area Kota/Daerah & Status Not Interest)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "namaCalonPelanggan" TEXT,
  "namaLead" TEXT,
  "nomorHP" TEXT,
  alamat TEXT,
  "alamatAlur" TEXT,
  area TEXT DEFAULT '-',
  "paketDiminati" TEXT,
  "sumberLead" TEXT,
  "statusSurvei" TEXT DEFAULT 'New Customer',
  "assignedSales" TEXT,
  "assignedCS" TEXT,
  "tanggalKontak" TEXT,
  "convertedCustomerId" TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
  catatan TEXT,
  keterangan TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- MIGRATION SCRIPT TO ENSURE EXISTING LEADS TABLES HAVE ALL COLUMNS:
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "namaCalonPelanggan" TEXT;
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "alamat" TEXT;
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "paketDiminati" TEXT;
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "assignedSales" TEXT;
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "tanggalKontak" TEXT;
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS keterangan TEXT;

-- 3. Create the follow_up_schedules table (Connected to leads & customers)
CREATE TABLE IF NOT EXISTS public.follow_up_schedules (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "namaCustomer" TEXT NOT NULL,
  "nomorHP" TEXT,
  area TEXT DEFAULT '-',
  "tipeFollowUp" TEXT DEFAULT '-',
  "tanggalFollowUp" TEXT,
  "waktuFollowUp" TEXT,
  status TEXT DEFAULT 'Thinking',
  "customerType" TEXT DEFAULT 'Lead',
  "referenceId" TEXT,
  "assignedCS" TEXT,
  "catatanHasil" TEXT,
  keterangan TEXT,
  "packageId" TEXT,
  "packageName" TEXT,
  "packagePrice" NUMERIC DEFAULT 0,
  periode TEXT,
  "nomorInternet" TEXT,
  jumlah_follow_up INT DEFAULT 1,
  "jumlahFollowUp" INT DEFAULT 1,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- MIGRATION SCRIPT TO ADD JUMLAH FOLLOW UP TO EXISTING FOLLOW_UP_SCHEDULES TABLE:
-- ALTER TABLE public.follow_up_schedules ADD COLUMN IF NOT EXISTS jumlah_follow_up INT DEFAULT 1;
-- ALTER TABLE public.follow_up_schedules ADD COLUMN IF NOT EXISTS "jumlahFollowUp" INT DEFAULT 1;

-- DEDICATED UPDATE SCRIPT FOR EXISTING LEADS & FOLLOW_UP TABLES:
-- (Jalankan skrip di bawah ini jika Anda ingin memperbarui tabel Supabase yang sudah ada untuk menambahkan status 'Not Interest')
-- 
-- ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "statusSurvei" TEXT DEFAULT 'New Customer';
-- ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_statusSurvei_check;
-- ALTER TABLE public.leads ADD CONSTRAINT leads_statusSurvei_check CHECK (
--   "statusSurvei" IN ('New Customer', 'NBP', 'Interest', 'Not Interest', 'Thinking', 'Uncover', 'Already Active', 'Area Full', 'Pemasangan', 'Refund', 'Aktif', 'Closing', 'Ghosting')
-- );

-- 4. Create the profiles table for user settings & target SA
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  monthly_target_sa INTEGER DEFAULT 15,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if any
DROP POLICY IF EXISTS "Users manage their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users manage their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users manage their own follow_up_schedules" ON public.follow_up_schedules;
DROP POLICY IF EXISTS "Users manage their own profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public access customers" ON public.customers;
DROP POLICY IF EXISTS "Public access leads" ON public.leads;
DROP POLICY IF EXISTS "Public access follow_up_schedules" ON public.follow_up_schedules;
DROP POLICY IF EXISTS "Public access profiles" ON public.profiles;

-- 7. Create RLS Policies for authenticated users
CREATE POLICY "Users manage their own customers" ON public.customers
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users manage their own leads" ON public.leads
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users manage their own follow_up_schedules" ON public.follow_up_schedules
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL) WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users manage their own profiles" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 8. Indexes for maximum query performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_converted_customer ON public.leads("convertedCustomerId");
CREATE INDEX IF NOT EXISTS idx_followups_user_id ON public.follow_up_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_followups_reference_id ON public.follow_up_schedules("referenceId");

-- ========================================================
-- Done! Database schema is ready for Leads, Follow Up & Revenue.
-- ========================================================`;

export const SupabaseSqlModal: React.FC<SupabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-none max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] flex items-center gap-2 uppercase tracking-wide">
                Skrip SQL Supabase
                <span className="text-[10px] px-2 py-0.5 rounded-none bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-300 dark:border-emerald-800">
                  Ready to Run
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Salin skrip di bawah dan jalankan di Dashboard Supabase SQL Editor Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-[12px]">
          <div className="p-3.5 rounded-none bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-900 dark:text-blue-200 leading-relaxed text-[11px]">
              Skrip ini akan membuat tabel <strong>customers</strong> beserta <strong>Row Level Security (RLS)</strong> agar data setiap pengguna yang login tersimpan aman secara terisolasi.
            </p>
          </div>

          <div className="relative rounded-none border-2 border-slate-800 bg-[#020617] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b-2 border-slate-800 bg-slate-900/80 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 font-bold uppercase">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                schema_supabase.sql
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-extrabold transition-all border uppercase cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Skrip SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[320px]">
              <code>{SUPABASE_SQL_SCRIPT}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[12px] font-extrabold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-none border-2 border-slate-300 dark:border-slate-700 transition-colors uppercase cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
