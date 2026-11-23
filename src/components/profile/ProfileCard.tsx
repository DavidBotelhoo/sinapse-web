import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Seção em card do Perfil (pf-card, pf-h2, pf-sub). */
export function ProfileCard({
  title,
  subtitle,
  titleId,
  children,
  className,
  headerClassName,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  titleId: string;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-4 md:gap-5 p-5 md:p-6 rounded-xl border border-line bg-surface",
        className,
      )}
    >
      <div className={headerClassName}>
        <h2 id={titleId} className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="m-0 mt-[2px] font-sans font-medium text-[13px] leading-[18px] text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Mensagem curta depois de uma ação ("Dados salvos."). */
export function ProfileStatus({ tone = "success", children }: { tone?: "success" | "danger"; children: ReactNode }) {
  return (
    <p
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "m-0 font-sans font-medium text-[13px] leading-[18px]",
        tone === "danger" ? "text-danger" : "text-success",
      )}
    >
      {children}
    </p>
  );
}
