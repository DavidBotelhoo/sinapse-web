"use client";

import { EditableAvatar } from "@/components/ui/Avatar";
import { useCurrentUser } from "@/components/app/MeProvider";
import { ProfileStatus } from "./ProfileCard";
import { useAvatarActions } from "./useAvatarActions";

/** Desktop: "Perfil" e o subtítulo. Celular: foto (com a câmera), nome e email centralizados. */
export function ProfileHeader() {
  const me = useCurrentUser();
  const avatar = useAvatarActions();
  const fullName = `${me.firstName} ${me.lastName}`;

  return (
    <>
      <header className="max-md:hidden flex flex-col gap-1">
        <h1 className="m-0 font-display text-title-1 text-ink">Perfil</h1>
        <p className="m-0 text-ink-muted">Seus dados, sua senha e sua assinatura.</p>
      </header>

      <header className="md:hidden flex flex-col items-center gap-[10px] text-center">
        <EditableAvatar
          name={fullName}
          src={me.avatarUrl}
          size="lg"
          onPick={avatar.pick}
          onRemove={avatar.removePhoto}
        />
        <div className="min-w-0">
          <h1 className="m-0 font-display font-bold text-[24px] leading-[30px] text-ink">{fullName}</h1>
          <p className="m-0 text-ink-muted break-all">{me.email}</p>
        </div>
        {avatar.uploading || avatar.removing ? (
          <ProfileStatus>{avatar.uploading ? "Enviando a foto…" : "Removendo a foto…"}</ProfileStatus>
        ) : avatar.error ? (
          <ProfileStatus tone="danger">{avatar.error}</ProfileStatus>
        ) : null}
      </header>
    </>
  );
}
