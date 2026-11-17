export type MissingStep =
  | "import"
  | "import-reading"
  | "name"
  | "year"
  | "subjects";

export function describeMissing(step: MissingStep): string {
  switch (step) {
    case "import":
      return "Importe um arquivo para começar.";
    case "import-reading":
      return "Esperando a leitura do arquivo…";
    case "name":
      return "Dê um nome ao deck.";
    case "year":
      return "Escolha o ano do curso.";
    case "subjects":
      return "Escolha pelo menos uma matéria.";
  }
}

export function MissingLine({ step }: { step: MissingStep | null }) {
  if (!step) return null;
  return (
    <p className="m-0 text-center font-sans font-medium text-[13px] leading-[18px] text-ink-muted">
      {describeMissing(step)}
    </p>
  );
}
