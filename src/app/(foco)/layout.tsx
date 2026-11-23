import type { ReactNode } from "react";
import { getMeOrRedirect } from "@/lib/api/me";
import { MeProvider } from "@/components/app/MeProvider";

/** Tela de foco: sem sidebar nem barra inferior, protegida como o (app). */
export default async function FocoLayout({ children }: { children: ReactNode }) {
  const me = await getMeOrRedirect();
  return (
    <MeProvider initial={me}>
      <div className="min-h-dvh flex flex-col bg-bg text-ink">{children}</div>
    </MeProvider>
  );
}
