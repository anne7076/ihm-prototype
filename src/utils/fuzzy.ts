/**
 * Normalise une chaîne : minuscules, suppression des accents et caractères diacritiques.
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Calcule un score de correspondance floue (fuzzy match) entre un terme de recherche
 * et un texte cible.
 * Retourne un nombre positif si correspondance (plus grand = plus pertinent), ou null si aucune correspondance.
 */
export function fuzzyScore(query: string, target: string): number | null {
  const q = normalizeText(query);
  const t = normalizeText(target);

  if (!q) return 100;
  if (!t) return null;

  // 1. Correspondance exacte
  if (t === q) return 1000;

  // 2. Préfixe direct
  if (t.startsWith(q)) return 800 + (100 / (t.length - q.length + 1));

  // 3. Contient la sous-chaîne exacte
  const substrIdx = t.indexOf(q);
  if (substrIdx !== -1) {
    // Bonus si au début d'un mot
    const isWordStart = substrIdx === 0 || /\s|[^\p{L}\p{N}]/u.test(t[substrIdx - 1]);
    return (isWordStart ? 600 : 400) - substrIdx * 2;
  }

  // 4. Sous-séquence floue (caractères dans l'ordre, avec tolérance aux sauts)
  let qIdx = 0;
  let score = 100;
  let consecutiveMatches = 0;
  let prevMatchIdx = -2;

  for (let tIdx = 0; tIdx < t.length && qIdx < q.length; tIdx++) {
    if (t[tIdx] === q[qIdx]) {
      // Bonus pour les caractères consécutifs trouvés
      if (tIdx === prevMatchIdx + 1) {
        consecutiveMatches++;
        score += 25 * consecutiveMatches;
      } else {
        consecutiveMatches = 0;
        // Pénalité pour la distance entre caractères
        if (prevMatchIdx >= 0) {
          score -= Math.min(15, (tIdx - prevMatchIdx));
        }
      }

      // Bonus si le caractère est au début d'un mot
      if (tIdx === 0 || /\s|[^\p{L}\p{N}]/u.test(t[tIdx - 1])) {
        score += 30;
      }

      prevMatchIdx = tIdx;
      qIdx++;
    }
  }

  if (qIdx === q.length) {
    return Math.max(10, score);
  }

  // 5. Tolérance de frappe (Levenshtein simple pour mots de 4+ lettres)
  if (q.length >= 4 && t.length >= 3) {
    // Tester si un mot individuel dans la cible est très proche
    const words = t.split(/\s+/);
    for (const w of words) {
      if (Math.abs(w.length - q.length) <= 1) {
        const dist = levenshteinDistance(q, w.slice(0, q.length + 1));
        if (dist <= 1) {
          return 150 - dist * 40;
        }
      }
    }
  }

  return null;
}

/**
 * Distance de Levenshtein simple et rapide pour corriger les fautes de frappe d'un caractère.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Vérifie si une chaîne de requête correspond (en fuzzy) à une ou plusieurs cibles.
 */
export function matchesFuzzy(query: string, ...targets: (string | undefined | null)[]): boolean {
  const q = normalizeText(query);
  if (!q) return true;

  // Découper la recherche en mots clés (ex: "rock ubu" -> correspond si "rock" et "ubu" correspondent)
  const tokens = q.split(/\s+/).filter(Boolean);

  const combinedTarget = targets
    .filter(Boolean)
    .map((t) => normalizeText(t as string))
    .join(" ");

  return tokens.every((token) => fuzzyScore(token, combinedTarget) !== null);
}

/**
 * Filtre et ordonne une liste d'éléments selon leur score fuzzy.
 */
export function filterAndRankFuzzy<T>(
  items: T[],
  query: string,
  getText: (item: T) => string
): T[] {
  const q = normalizeText(query);
  if (!q) return items;

  const scored: { item: T; score: number }[] = [];

  for (const item of items) {
    const text = getText(item);
    const score = fuzzyScore(q, text);
    if (score !== null) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}
