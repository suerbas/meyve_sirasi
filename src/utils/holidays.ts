import { Holiday } from '../types'

// Türkiye MEB ve Resmi Tatiller (2026 - 2027 Eğitim Öğretim Yılı)
export const DEFAULT_HOLIDAYS: Holiday[] = [
  // 2026 Güz Dönemi
  {
    date: '2026-10-28',
    name: '29 Ekim Arifesi (Yarım Gün Tatil)',
    type: 'national',
    isSchoolClosed: true
  },
  {
    date: '2026-10-29',
    name: '29 Ekim Cumhuriyet Bayramı',
    type: 'national',
    isSchoolClosed: true
  },
  // 1. Dönem Ara Tatili (Kasım)
  { date: '2026-11-09', name: '1. Dönem Ara Tatili (Pazartesi)', type: 'break', isSchoolClosed: true },
  { date: '2026-11-10', name: '1. Dönem Ara Tatili & 10 Kasım Atatürk\'ü Anma', type: 'break', isSchoolClosed: true },
  { date: '2026-11-11', name: '1. Dönem Ara Tatili (Çarşamba)', type: 'break', isSchoolClosed: true },
  { date: '2026-11-12', name: '1. Dönem Ara Tatili (Perşembe)', type: 'break', isSchoolClosed: true },
  { date: '2026-11-13', name: '1. Dönem Ara Tatili (Cuma)', type: 'break', isSchoolClosed: true },

  // 2027 Yılbaşı
  {
    date: '2027-01-01',
    name: 'Yılbaşı Tatili',
    type: 'national',
    isSchoolClosed: true
  },

  // Yarıyıl (Sömestr) Tatili (Ocak sonu - Şubat başı)
  { date: '2027-01-18', name: 'Yarıyıl Tatili (1. Hafta Pazartesi)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-19', name: 'Yarıyıl Tatili (1. Hafta Salı)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-20', name: 'Yarıyıl Tatili (1. Hafta Çarşamba)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-21', name: 'Yarıyıl Tatili (1. Hafta Perşembe)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-22', name: 'Yarıyıl Tatili (1. Hafta Cuma)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-25', name: 'Yarıyıl Tatili (2. Hafta Pazartesi)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-26', name: 'Yarıyıl Tatili (2. Hafta Salı)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-27', name: 'Yarıyıl Tatili (2. Hafta Çarşamba)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-28', name: 'Yarıyıl Tatili (2. Hafta Perşembe)', type: 'semester', isSchoolClosed: true },
  { date: '2027-01-29', name: 'Yarıyıl Tatili (2. Hafta Cuma)', type: 'semester', isSchoolClosed: true },

  // 2027 Ramazan Bayramı
  { date: '2027-03-09', name: 'Ramazan Bayramı Arifesi', type: 'religious', isSchoolClosed: true },
  { date: '2027-03-10', name: 'Ramazan Bayramı 1. Gün', type: 'religious', isSchoolClosed: true },
  { date: '2027-03-11', name: 'Ramazan Bayramı 2. Gün', type: 'religious', isSchoolClosed: true },
  { date: '2027-03-12', name: 'Ramazan Bayramı 3. Gün', type: 'religious', isSchoolClosed: true },

  // 2. Dönem Ara Tatili (Nisan)
  { date: '2027-04-12', name: '2. Dönem Ara Tatili (Pazartesi)', type: 'break', isSchoolClosed: true },
  { date: '2027-04-13', name: '2. Dönem Ara Tatili (Salı)', type: 'break', isSchoolClosed: true },
  { date: '2027-04-14', name: '2. Dönem Ara Tatili (Çarşamba)', type: 'break', isSchoolClosed: true },
  { date: '2027-04-15', name: '2. Dönem Ara Tatili (Perşembe)', type: 'break', isSchoolClosed: true },
  { date: '2027-04-16', name: '2. Dönem Ara Tatili (Cuma)', type: 'break', isSchoolClosed: true },

  // 23 Nisan
  {
    date: '2027-04-23',
    name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
    type: 'national',
    isSchoolClosed: true
  },

  // 1 Mayıs
  {
    date: '2027-05-01',
    name: '1 Mayıs Emek ve Dayanışma Günü',
    type: 'national',
    isSchoolClosed: true
  },

  // 2027 Kurban Bayramı
  { date: '2027-05-17', name: 'Kurban Bayramı Arifesi', type: 'religious', isSchoolClosed: true },
  { date: '2027-05-18', name: 'Kurban Bayramı 1. Gün', type: 'religious', isSchoolClosed: true },
  { date: '2027-05-19', name: 'Kurban Bayramı 2. Gün & 19 Mayıs Atatürk\'ü Anma Bayramı', type: 'national', isSchoolClosed: true },
  { date: '2027-05-20', name: 'Kurban Bayramı 3. Gün', type: 'religious', isSchoolClosed: true },
  { date: '2027-05-21', name: 'Kurban Bayramı 4. Gün', type: 'religious', isSchoolClosed: true },

  // 15 Temmuz
  {
    date: '2027-07-15',
    name: '15 Temmuz Demokrasi ve Milli Birlik Günü',
    type: 'national',
    isSchoolClosed: true
  }
]

export function isDateHoliday(dateStr: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find(h => h.date === dateStr && h.isSchoolClosed)
}
