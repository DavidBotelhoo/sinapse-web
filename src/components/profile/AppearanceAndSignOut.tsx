"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePersistTheme } from "@/components/app/MeProvider";
import { useLogout } from "@/lib/api/useMe";
import { ProfileCard } from "./ProfileCard";

/** Aparência: só no celular (no desktop o tema fica na sidebar). */
export function AppearanceCard() {
  const persistTheme = usePersistTheme();
  return (
    <ProfileCard
      titleId="pf-aparencia"
      title="Aparência"
      subtitle="Escuro é bom para estudar à noite."
      className="md:hidden"
    >
      <ThemeToggle onChange={persistTheme} />
    </ProfileCard>
  );
}

function useSignOut() {
  const router = useRouter();
  const logout = useLogout();
  return {
    pending: logout.isPending,
    signOut: () => logout.mutate(undefined, { onSettled: () => router.replace("/entrar") }),
  };
}

/** Sair da conta: card no desktop, link centralizado no celular. */
export function SignOutCard() {
  const { signOut, pending } = useSignOut();
  const button = (
    <Button
      variant="danger"
      onClick={signOut}
      loading={pending}
      loadingText="Saindo"
      iconLeft={<LogOut aria-hidden strokeWidth={1.75} className="size-5" />}
    >
      Sair da conta
    </Button>
  );
  return (
    <>
      <section
        aria-labelledby="pf-sair"
        className="max-md:hidden flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl border border-line bg-surface"
      >
        <div>
          <h2 id="pf-sair" className="m-0 font-display font-semibold text-[20px] leading-[26px] text-ink">
            Sair da conta
          </h2>
          <p className="m-0 mt-[2px] font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
            Seus decks e seu progresso ficam salvos.
          </p>
        </div>
        {button}
      </section>
      <div className="md:hidden flex justify-center">{button}</div>
    </>
  );
}
