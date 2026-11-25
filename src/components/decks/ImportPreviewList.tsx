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
    <ol className={cn("flex flex-col gap-2 m-0 p-0 list-none", className)}>
      {shown.map((pair, i) => {
        const warn = !pair.answer;
        return (
          <li
            key={i}
            className={cn(
              "grid grid-cols-[28px_minmax(0,1fr)] gap-x-[10px] gap-y-1 px-[14px] py-3 rounded-md border",
              warn ? "border-warning bg-warning-soft" : "border-line bg-bg",
            )}
          >
            <span
              className="row-span-2 font-sans font-bold text-[12px] leading-5 tabular-nums text-ink-faint"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-sans font-semibold text-[14px] leading-5 text-ink">{pair.question}</span>
            {warn ? (
              <span className="font-sans font-semibold text-[14px] leading-5 text-warning">
                Sem resposta no arquivo
              </span>
            ) : (
              <span className="font-sans text-[14px] leading-5 text-ink-muted">{pair.answer}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
