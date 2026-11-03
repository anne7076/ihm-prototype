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

export const days = [
  { name: "Lundi", date: "12" },
  { name: "Mardi", date: "13" },
  { name: "Mercredi", date: "14" },
  { name: "Jeudi", date: "15" },
  { name: "Vendredi", date: "16" },
  { name: "Samedi", date: "17" },
  { name: "Dimanche", date: "18" },
];

export const hours = [
  "10h00", "11h00", "12h00", "13h00", "14h00", "15h00", "16h00",
  "17h00", "18h00", "19h00", "20h00", "21h00", "22h00", "23h00",
  "00h00", "01h00", "02h00",
];
