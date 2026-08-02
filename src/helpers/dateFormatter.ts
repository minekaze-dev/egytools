export function formatDateIndo(dateStr?: string | null): string {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agt',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function formatDateIndoFull(dateStr?: string | null): string {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function parseTanggalPasang(tanggalPasang?: string | null): { year: number; monthIndex: number; day: number } | null {
  if (!tanggalPasang || tanggalPasang === '-') return null;
  const matchIso = tanggalPasang.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (matchIso) {
    return {
      year: parseInt(matchIso[1], 10),
      monthIndex: parseInt(matchIso[2], 10) - 1,
      day: parseInt(matchIso[3], 10),
    };
  }
  const matchLocal = tanggalPasang.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (matchLocal) {
    return {
      day: parseInt(matchLocal[1], 10),
      monthIndex: parseInt(matchLocal[2], 10) - 1,
      year: parseInt(matchLocal[3], 10),
    };
  }
  const d = new Date(tanggalPasang);
  if (!isNaN(d.getTime())) {
    return {
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      day: d.getDate(),
    };
  }
  return null;
}

export function formatTodayYMD(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function addDaysYMD(startDateStr: string, days: number): string {
  try {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return startDateStr;
  }
}
