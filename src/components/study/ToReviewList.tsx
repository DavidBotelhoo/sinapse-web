import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { plural } from "./format";

export type ToReviewItem = {
  id: string;
  question: string;
  meta: string;
  due: string;
};

/** "voltam em 10 min": quando o primeiro card errado volta. */
export function returnsLabel(dues: ReadonlyArray<string>, now = Date.now()) {
  const first = Math.min(...dues.map((d) => new Date(d).getTime()));
  const verb = plural(dues.length, "volta", "voltam");
  const min = Math.max(1, Math.round((first - now) / 60_000));
  if (min < 60) return `${verb} em ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${verb} em ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? `${verb} amanhã` : `${verb} em ${days} dias`;
}

/** "Para rever": os cards com Errei, no resumo da sessão (ss-card + ss-list). */
export function ToReviewList({ items, className }: { items: ReadonlyArray<ToReviewItem>; className?: string }) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="ss-errou"
      className={cn("flex flex-col gap-4 p-5 md:p-6 rounded-xl border border-line bg-surface", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="ss-errou" className="m-0 font-display font-semibold text-[18px] leading-6 text-ink">
          Para rever
        </h3>
        <Tag tone="accent">{returnsLabel(items.map((i) => i.due))}</Tag>
      </div>
      <ul className="flex flex-col m-0 p-0 list-none">
        {items.map((it, i) => (
          <li key={it.id} className={cn("flex gap-3 py-3", i === 0 ? "pt-0" : "border-t border-line")}>
            <span aria-hidden className="mt-[7px] size-[10px] shrink-0 rounded-[3px] bg-again" />
            <p className="m-0 text-ink">
              {it.question}
              <small className="block font-sans font-medium text-[12px] leading-4 text-ink-muted">{it.meta}</small>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
