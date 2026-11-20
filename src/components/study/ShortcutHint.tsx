import { Kbd } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** "Espaço vira o card · 1 2 3 avaliam e passam para o próximo" (ss-keys). Some no toque e no celular. */
export function ShortcutHint({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "m-0 text-center font-sans font-medium text-[13px] leading-[18px] text-ink-muted",
        "max-md:hidden [@media(hover:none)]:hidden [&_span_span]:mx-[2px]",
        className,
      )}
    >
      <span className="sr-only">Atalhos: Espaço vira o card; 1, 2 e 3 avaliam e passam para o próximo.</span>
      <span aria-hidden>
        <Kbd>Espaço</Kbd> vira o card · <Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd> avaliam e passam para o próximo
      </span>
    </p>
  );
}
