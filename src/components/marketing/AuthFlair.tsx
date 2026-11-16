import { cn } from "@/lib/cn";

export function AuthFlair({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none",
          "[background-image:radial-gradient(circle_at_2px_2px,var(--color-primary-hover)_2px,transparent_0)]",
          "[background-size:24px_24px]",
          className,
        )}
      />
      <span
        aria-hidden
        className="absolute -top-[60px] -right-[60px] size-[220px] rounded-full bg-primary-hover pointer-events-none"
      />
      <span
        aria-hidden
        className="absolute top-[120px] right-[132px] size-[72px] rounded-full bg-accent pointer-events-none"
      />
      <span
        aria-hidden
        className="absolute top-[216px] right-[96px] size-6 rounded-full bg-on-primary pointer-events-none"
      />
    </>
  );
}
