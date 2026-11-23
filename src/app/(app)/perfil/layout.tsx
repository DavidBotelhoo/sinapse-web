import type { ReactNode } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

/** Perfil: cabeçalho e as abas Conta e Assinatura, na largura das telas 24 a 28 (880px). */
export default function PerfilLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[880px] mx-auto flex flex-col gap-7 md:gap-8">
      <ProfileHeader />
      <ProfileTabs />
      {children}
    </div>
  );
}
