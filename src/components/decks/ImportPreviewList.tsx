import type { ImportPair } from "@/lib/api/imports";
import { cn } from "@/lib/cn";

export type ImportPreviewListProps = {
  pairs: ReadonlyArray<ImportPair>;
  limit?: number;
  className?: string;
};

export function ImportPreviewList({ pairs, limit = 20, className }: ImportPreviewListProps) {
  const shown = pairs.slice(0, limit);
  return (
    <ol className={cn("grid gap-3 m-0 p-0 list-none", className)}>
      {shown.map((pair, i) => {
        const warn = !pair.answer;
        return (
          <li
            key={i}
            className={cn(
              "grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 gap-y-1 p-3 rounded-md border",
              warn ? "border-warning bg-warning-soft" : "border-line bg-surface",
            )}
          >
            <span
              className={cn(
                "font-display font-bold text-[14px] leading-6 tabular-nums",
                warn ? "text-warning" : "text-ink-muted",
              )}
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-sans font-semibold text-[14px] leading-5 text-ink">
              {pair.question}
            </span>
            <span />
            {warn ? (
              <span className="font-sans font-medium text-[13px] leading-[18px] text-warning italic">
                Sem resposta — adicione depois na edição do deck.
              </span>
            ) : (
              <span className="font-sans text-[14px] leading-5 text-ink-muted">
                {pair.answer}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
