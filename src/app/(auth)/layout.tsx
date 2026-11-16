import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[960px]">{children}</div>
    </div>
  );
}
