import { getMeOrRedirect } from "@/lib/api/me";

export const metadata = {
  title: "Início · Sinapse",
};

export default async function InicioPage() {
  const me = await getMeOrRedirect();
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <h1 className="m-0 font-display font-bold text-title-1 text-ink">
          Olá, {me.firstName}
        </h1>
        <p className="m-0 font-sans text-body text-ink-muted first-letter:capitalize">{today}</p>
      </div>
      <p className="m-0 font-sans text-body-lg text-ink-muted">
        Sua primeira sessão de estudo entra na próxima etapa.
      </p>
    </div>
  );
}
