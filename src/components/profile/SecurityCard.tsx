"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/components/app/MeProvider";
import { formatRelative } from "@/components/decks/format";
import { ProfileCard, ProfileStatus } from "./ProfileCard";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

/** Segurança: a linha da senha (pf-line) e o modal de trocar. */
export function SecurityCard() {
  const me = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [changed, setChanged] = useState(false);

  return (
    <ProfileCard titleId="pf-seguranca" title="Segurança">
      <div className="flex items-center gap-[14px] py-1">
        <span aria-hidden className="grid place-items-center size-10 shrink-0 rounded-md bg-surface-2 text-ink-muted [&_svg]:size-5">
          <KeyRound strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0 flex flex-col">
          <b className="font-sans font-semibold text-[15px] leading-5 text-ink">Senha</b>
          <span className="font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
            {me.passwordChangedAt ? `Alterada ${formatRelative(me.passwordChangedAt)}` : "Desde o cadastro"}
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="shrink-0">
          Trocar senha
        </Button>
      </div>
      {changed ? <ProfileStatus>Senha trocada. As outras sessões foram encerradas.</ProfileStatus> : null}
      <ChangePasswordDialog open={open} onClose={() => setOpen(false)} onChanged={() => setChanged(true)} />
    </ProfileCard>
  );
}
