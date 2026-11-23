const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 2990 → "R$ 29,90". Os preços vêm sempre da API (/billing/plans, /billing/invoices). */
export function formatBRL(cents: number) {
  return brl.format(cents / 100);
}

function parts(iso: string, timeZone: string) {
  const d = new Date(iso);
  const get = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", { ...opts, timeZone }).format(d);
  return {
    day: get({ day: "numeric" }),
    month: get({ month: "short" }).replace(".", ""),
    year: get({ year: "numeric" }),
  };
}

/** "15 dez 2026" */
export function longDate(iso: string, timeZone: string) {
  const p = parts(iso, timeZone);
  return `${p.day} ${p.month} ${p.year}`;
}

/** "20 nov" */
export function shortDate(iso: string, timeZone: string) {
  const p = parts(iso, timeZone);
  return `${p.day} ${p.month}`;
}

/** "Visa final 4417" → "cartão final 4417", como nas telas. */
export function cardLabel(label: string | null) {
  if (!label) return null;
  const last4 = label.match(/(\d{4})\s*$/)?.[1];
  return last4 ? `cartão final ${last4}` : label;
}
