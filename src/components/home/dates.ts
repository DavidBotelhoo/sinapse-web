// Datas da API vêm como "AAAA-MM-DD" já no fuso de quem estuda. Trabalhar só com elas evita
// depender do fuso do servidor ou do navegador.

const DAY_MS = 86_400_000;

function at(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!, 12));
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", { ...opts, timeZone: "UTC" });

/** "Seg", "Sáb" */
export function weekdayShort(day: string) {
  return cap(fmt({ weekday: "short" }).format(at(day)).replace(".", ""));
}

/** "Segunda", "Domingo" */
export function weekdayLong(day: string) {
  return cap(fmt({ weekday: "long" }).format(at(day)).replace("-feira", ""));
}

/** "15" */
export function dayOfMonth(day: string) {
  return String(Number(day.slice(8, 10)));
}

/** "Domingo, 15 de novembro" */
export function longDate(day: string) {
  return `${weekdayLong(day)}, ${dayOfMonth(day)} de ${fmt({ month: "long" }).format(at(day))}`;
}

export function daysBetween(from: string, to: string) {
  return Math.round((at(to).getTime() - at(from).getTime()) / DAY_MS);
}

/** Dia de calendário de um instante no fuso dado: "2026-11-20". */
export function dayIn(instant: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    instant,
  );
}

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

/** "há 2 horas", "ontem", "há 4 dias", comparando com o dia de hoje do usuário. */
export function relativeStudied(iso: string, today: string, timeZone: string, now = Date.now()) {
  const when = new Date(iso);
  const days = daysBetween(dayIn(when, timeZone), today);
  if (days >= 1) return rtf.format(-days, "day");
  const minutes = Math.floor((now - when.getTime()) / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return rtf.format(-minutes, "minute");
  return rtf.format(-Math.floor(minutes / 60), "hour");
}

/** "ontem", "12 de novembro": desde quando um deck está atrasado. */
export function sinceLabel(day: string, today: string) {
  if (daysBetween(day, today) === 1) return "ontem";
  return `${dayOfMonth(day)} de ${fmt({ month: "long" }).format(at(day))}`;
}
