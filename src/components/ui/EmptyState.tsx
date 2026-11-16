import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  title: ReactNode;
  body?: ReactNode;
  icon?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  body,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid justify-items-center gap-3 max-w-[440px] mx-auto px-6 py-12 text-center",
        className,
      )}
    >
      <EmptyArt icon={icon} />

      <h2 className="m-0 font-display font-semibold text-[22px] leading-7 text-ink text-balance">
        {title}
      </h2>
      {body ? (
        <p className="m-0 mb-3 font-sans text-[15px] leading-[22px] text-ink-muted text-pretty">
          {body}
        </p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="flex flex-wrap justify-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

function EmptyArt({ icon }: { icon?: ReactNode }) {
  return (
    <div className="relative w-[132px] h-[104px] mb-3">
      <span
        className={cn(
          "absolute inset-y-[10px] inset-x-[26px] grid place-items-center rounded-[14px]",
          "border-[1.5px] border-line-strong bg-surface-2",
          "-translate-x-[18px] -rotate-12",
        )}
      />
      <span
        className={cn(
          "absolute inset-y-[10px] inset-x-[26px] grid place-items-center rounded-[14px]",
          "border-[1.5px] border-line-strong bg-surface",
          "translate-x-4 rotate-[8deg]",
        )}
      />
      <span
        className={cn(
          "absolute inset-y-[10px] inset-x-[26px] grid place-items-center rounded-[14px]",
          "border-[1.5px] border-primary bg-primary-soft text-on-primary-soft",
          "[&_svg]:size-7",
        )}
      >
        {icon ?? <Plus strokeWidth={1.75} />}
      </span>
    </div>
  );
}
