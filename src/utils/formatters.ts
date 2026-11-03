export function initials(name: string): string {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Calcul dynamique des jours d'une semaine selon un décalage (offset en semaines)
// Semaine de référence (offset 0) : Lundi 12 au Dimanche 18 octobre 2026
export const BASE_MONDAY = new Date(2026, 9, 12, 0, 0, 0, 0); // Mois 9 = octobre 2026

export const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const MONTH_NAMES = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

export function formatDateIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateIso(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function getWeekOffsetForDate(dateStr: string): number {
  const target = parseDateIso(dateStr);
  const diffTime = target.getTime() - BASE_MONDAY.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export function getDayIndexForDate(dateStr: string): number {
  const target = parseDateIso(dateStr);
  // Sunday is 0 in JS Date, but our week starts Monday (0) to Sunday (6)
  const day = target.getDay();
  return day === 0 ? 6 : day - 1;
}

export function getWeekDays(weekOffset: number = 0) {
  const monday = new Date(BASE_MONDAY);
  monday.setDate(BASE_MONDAY.getDate() + weekOffset * 7);

  return DAY_NAMES.map((name, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    return {
      dayIndex: index,
      name,
      date: d.getDate().toString(),
      month: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      dateStr: formatDateIso(d),
      fullDateString: `${name} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
    };
  });
}

export function getWeekLabel(weekOffset: number = 0): string {
  const days = getWeekDays(weekOffset);
  const start = days[0];
  const end = days[6];

  if (start.month === end.month) {
    return `Semaine du ${start.date} au ${end.date} ${start.month}`;
  }
  return `Semaine du ${start.date} ${start.month} au ${end.date} ${end.month}`;
}

export const hours = [
  "10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00",
  "17h00", "18h00", "19h00", "20h00", "21h00", "22h00", "23h00",
  "00h00", "01h00", "02h00",
];
