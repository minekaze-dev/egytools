import { BillingPeriod } from './customer';

export type LeadSurveyStatus = 
  | 'New Customer'
  | 'NBP'
  | 'Interest'
  | 'Thinking'
  | 'Uncover'
  | 'Already Active'
  | 'Area Full'
  | 'Pemasangan'
  | 'Refund'
  | 'Aktif'
  | 'Prospek Baru' 
  | 'Kendala Cover' 
  | 'Batal' 
  | 'Closing'
  | 'Ghosting';

export type LeadSource = 
  | 'MGM'
  | 'Qiscus FB'
  | 'Qiscus Live Chat'
  | 'Qiscus Website'
  | 'Ads Personal'
  | 'Webcover'
  | 'Tiktok'
  | 'Whatsapp'
  | 'Sosmed' 
  | 'Brosur' 
  | 'Walk-in' 
  | 'Referensi' 
  | 'Website' 
  | 'Canvassing' 
  | 'Lainnya';

export interface Lead {
  id: string;
  namaCalonPelanggan: string;
  nomorHP: string;
  alamat: string;
  area: string;
  paketDiminati: string;
  statusSurvei: LeadSurveyStatus;
  assignedSales: string;
  assignedCS: string;
  sumberLead: LeadSource;
  tanggalKontak: string; // YYYY-MM-DD
  catatan?: string;
  keterangan?: string;
  createdAt: string;
  convertedCustomerId?: string;
}

export type FollowUpType = 
  | '-'
  | 'Mikir-mikir' 
  | 'Diskusi' 
  | 'Tidak mau bayar diawal' 
  | 'Cari yang murah' 
  | 'Cari speed kecil' 
  | 'Tidak jadi pasang'
  | 'Tidak merespon'
  | 'Awal Bulan'
  | 'Akhir Bulan'
  | 'Tunggu wifi lama putus'
  | 'Menunggu form registrasi';

export type FollowUpStatus = 'Menunggu' | 'Selesai' | 'Reschedule' | 'Batal' | LeadSurveyStatus;

export interface FollowUpSchedule {
  id: string;
  namaCustomer: string;
  nomorHP: string;
  tipeFollowUp: FollowUpType;
  tanggalFollowUp: string; // YYYY-MM-DD
  waktuFollowUp: string; // HH:mm
  status: FollowUpStatus;
  assignedCS?: string;
  catatanHasil?: string;
  keterangan?: string;
  customerType: 'Lead' | 'Prospek' | 'Pelanggan Aktif';
  referenceId?: string;
  createdAt: string;
  packageId?: string;
  packageName?: string;
  packagePrice?: number;
  periode?: BillingPeriod;
  nomorInternet?: string;
}
