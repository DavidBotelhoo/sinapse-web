import type { ReactNode } from "react";
import { HideBottomNav } from "@/components/app/HideBottomNav";

export default function CriarDeckLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HideBottomNav />
      <div className="pb-6 md:pb-0">{children}</div>
    </>
  );
}
