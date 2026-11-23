import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PaymentNoticeProps = {
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
  /** "warning" (pf-warn, telas 27 e 28) ou "info" para o que não é problema (teste grátis). */
  tone?: "warning" | "info";
  action?: ReactNode;
  role?: "alert" | "status";
  className?: string;
};

/** Aviso de pagamento e de assinatura (pf-warn). */
export function PaymentNotice({
  icon,
  title,
  children,
  tone = "warning",
  action,
  role = "status",
  className,
}: PaymentNoticeProps) {
  return (
    <div
      role={role}
      className={cn(
        "flex flex-wrap items-start gap-3 px-4 py-[14px] rounded-md text-ink",
        tone === "warning" ? "bg-warning-soft" : "bg-primary-soft",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "shrink-0 [&_svg]:size-5",
          tone === "warning" ? "text-warning" : "text-on-primary-soft",
        )}
      >
        {icon}
      </span>
      <p className="m-0 flex-[1_1_240px]">
        <b className="block font-semibold">{title}</b>
        {children}
      </p>
      {action ? <div className="shrink-0 self-center max-sm:w-full">{action}</div> : null}
    </div>
  );
}
