import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** A caixinha de seleção dos tiles e das linhas (sn-check). Decorativa: o estado está no botão. */
export function SelectCheck({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid place-items-center size-[18px] shrink-0 rounded-[5px] border-[1.5px]",
        "transition-[background-color,border-color] duration-(--dur-fast)",
        checked
          ? "bg-primary border-primary text-on-primary"
          : "border-line-strong text-transparent",
        className,
      )}
    >
      <Check strokeWidth={3} className="size-3" />
    </span>
  );
}
