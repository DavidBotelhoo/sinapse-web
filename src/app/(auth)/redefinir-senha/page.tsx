import { Wordmark } from "@/components/app/Wordmark";
import { ForgotForm } from "@/components/auth/ForgotForm";
import { ResetForm } from "@/components/auth/ResetForm";

export const metadata = {
  title: "Redefinir senha · Sinapse",
};

type Props = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function RedefinirSenhaPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawToken = params.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  return (
    <div className="mx-auto w-full max-w-[460px] grid gap-6 p-8 rounded-xl bg-surface shadow-lg">
      <div className="flex justify-center md:hidden">
        <Wordmark size="md" />
      </div>
      {token ? (
        <>
          <Header title="Nova senha" subtitle="Escolha uma senha que você vá lembrar." />
          <ResetForm token={token} />
        </>
      ) : (
        <>
          <Header
            title="Esqueci minha senha"
            subtitle="Digite seu email e vamos mandar um link para você redefinir a senha."
          />
          <ForgotForm />
        </>
      )}
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="grid gap-2 text-center">
      <h1 className="m-0 font-display font-bold text-title-1 text-ink">{title}</h1>
      <p className="m-0 font-sans text-ink-muted">{subtitle}</p>
    </div>
  );
}
