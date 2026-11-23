"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableAvatar } from "@/components/ui/Avatar";
import { TextField } from "@/components/ui/TextField";
import { useCurrentUser } from "@/components/app/MeProvider";
import { isApiError } from "@/lib/api/base";
import { useUpdateMe } from "@/lib/api/useMe";
import { ProfileCard, ProfileStatus } from "./ProfileCard";
import { useAvatarActions } from "./useAvatarActions";

const schema = z.object({
  firstName: z.string().trim().min(1, "Digite seu nome.").max(80, "Use no máximo 80 caracteres."),
  lastName: z.string().trim().min(1, "Digite seu sobrenome.").max(120, "Use no máximo 120 caracteres."),
});

type Values = z.infer<typeof schema>;

/** "Foto e nome" (desktop) / "Seus dados" (celular): foto, nome, sobrenome e email só leitura. */
export function AccountForm() {
  const me = useCurrentUser();
  const update = useUpdateMe();
  const avatar = useAvatarActions();
  const [saved, setSaved] = useState(false);
  const fullName = `${me.firstName} ${me.lastName}`;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: me.firstName, lastName: me.lastName },
  });

  const submit = handleSubmit((values) => {
    // Sem mudança, nada a enviar (o botão fica ativo, como na tela 24).
    if (!isDirty) return;
    setSaved(false);
    update.mutate(values, {
      onSuccess: (next) => {
        reset({ firstName: next.firstName, lastName: next.lastName });
        setSaved(true);
      },
      onError: (err) => {
        if (isApiError(err) && err.fields.firstName) setError("firstName", { message: "Confira o nome." });
        else if (isApiError(err) && err.fields.lastName) setError("lastName", { message: "Confira o sobrenome." });
        else setError("root", { message: "Não foi possível salvar. Tente de novo." });
      },
    });
  });

  return (
    <ProfileCard
      titleId="pf-dados"
      title={
        <>
          <span className="max-md:hidden">Foto e nome</span>
          <span className="md:hidden">Seus dados</span>
        </>
      }
      subtitle={<span className="max-md:hidden">Na Comunidade, só seu primeiro nome e a foto aparecem.</span>}
    >
      {/* No celular, a foto fica no cabeçalho da página. */}
      <div className="max-md:hidden flex flex-wrap items-center gap-4">
        <EditableAvatar name={fullName} src={me.avatarUrl} size="xl" onPick={avatar.pick} />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <label
              className="inline-flex items-center gap-2 h-control-sm px-4 rounded-sm border border-line-strong bg-surface font-sans font-semibold text-[14px] leading-none text-ink cursor-pointer hover:bg-surface-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus [&_svg]:size-[18px]"
            >
              <Camera aria-hidden strokeWidth={1.75} />
              {avatar.uploading ? "Enviando…" : "Trocar foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) avatar.pick(file);
                  e.target.value = "";
                }}
              />
            </label>
            {me.avatarUrl ? (
              <Button variant="ghost" size="sm" onClick={avatar.removePhoto} loading={avatar.removing} loadingText="Removendo">
                <span className="text-ink-muted">Remover</span>
              </Button>
            ) : null}
          </div>
          <p className="m-0 font-sans font-medium text-[12px] leading-4 text-ink-muted">
            JPG, PNG ou WebP, até 5 MB. Recortamos em quadrado.
          </p>
          {avatar.error ? <ProfileStatus tone="danger">{avatar.error}</ProfileStatus> : null}
        </div>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-3">
          <TextField
            label="Nome"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextField
            label="Sobrenome"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <TextField
          label="Email"
          type="email"
          value={me.email}
          readOnly
          leftIcon={<Mail strokeWidth={1.75} />}
          rightIcon={<Lock strokeWidth={1.75} />}
          hint="O email não pode ser alterado por aqui."
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          {saved && !isDirty ? <ProfileStatus>Dados salvos.</ProfileStatus> : null}
          {errors.root ? <ProfileStatus tone="danger">{errors.root.message}</ProfileStatus> : null}
          <Button
            type="submit"
            variant="primary"
            loading={update.isPending}
            loadingText="Salvando"
            className="max-md:w-full"
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </ProfileCard>
  );
}
