import type { ReactNode } from "react";
import { getMeOrRedirect } from "@/lib/api/me";

/** Tela de foco: sem sidebar nem barra inferior, protegida como o (app). */
export default async function FocoLayout({ children }: { children: ReactNode }) {
  await getMeOrRedirect();
  return <div className="min-h-dvh flex flex-col bg-bg text-ink">{children}</div>;
}
