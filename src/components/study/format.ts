const listFmt = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

export function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

/** 1.284 */
export function num(n: number) {
  return n.toLocaleString("pt-BR");
}

/** "84 cards", "1 card" */
export function cardsLabel(n: number) {
  return `${num(n)} ${plural(n, "card", "cards")}`;
}

/** [2] → "2º ano"; [1, 2] → "1º e 2º ano" */
export function yearsLabel(years: ReadonlyArray<number>) {
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  return `${listFmt.format(sorted.map((y) => `${y}º`))} ano`;
}

/** ["Farmacologia", "Fisiologia"] → "Farmacologia e Fisiologia" */
export function joinList(items: ReadonlyArray<string>) {
  return listFmt.format(items);
}

/** Tempo de estudo para "Sua sessão": "~13 min". */
export function approxMinutes(cards: number, secondsPerCard: number) {
  if (cards <= 0) return "–";
  return `~${Math.max(1, Math.round((cards * secondsPerCard) / 60))} min`;
}

/** 840000 → "14 min"; 42000 → "42 s"; 4000000 → "1 h 07 min" */
export function durationLabel(ms: number) {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  if (totalSec < 60) return `${totalSec} s`;
  const totalMin = Math.round(totalSec / 60);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")} min`;
}

/** Relógio da sessão: "08:24", "1:02:05". */
export function clockLabel(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
