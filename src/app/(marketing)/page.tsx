import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-content px-4 py-16">
      <h1 className="font-display text-title-1">Sinapse</h1>
      <p className="mt-2 text-body text-ink-muted">
        Projeto em construção. A landing entra na próxima etapa.
      </p>
      {process.env.NODE_ENV !== "production" ? (
        <p className="mt-6 text-body">
          <Link href="/dev/componentes" className="text-primary underline underline-offset-4">
            Ver /dev/componentes
          </Link>
        </p>
      ) : null}
    </main>
  );
}
