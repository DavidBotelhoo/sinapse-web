/** "980", "1,1 mil", "3 mil" */
export function formatSaves(n: number) {
  if (n < 1000) return n.toLocaleString("pt-BR");
  const mil = Math.round(n / 100) / 10;
  return `${mil.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
}

/** "3,4 mil salvaram", "1 salvou" */
export function savesLabel(n: number) {
  return `${formatSaves(n)} ${n === 1 ? "salvou" : "salvaram"}`;
}

/** "há 5 dias", "há 2 horas": quando o conteúdo do deck mudou. */
export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "há algum tempo";
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}
