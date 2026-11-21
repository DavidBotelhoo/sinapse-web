import { CircleCheck } from "lucide-react";

/** Confirmação depois de denunciar um deck. */
export function ReportedNotice() {
  return (
    <p
      role="status"
      className="m-0 flex items-center gap-2 px-3 py-2 rounded-md bg-success-soft text-success font-sans font-medium text-[13px] leading-[18px] [&_svg]:size-4 [&_svg]:shrink-0"
    >
      <CircleCheck aria-hidden strokeWidth={1.75} />
      Denúncia enviada. Obrigado por ajudar a moderar a Comunidade.
    </p>
  );
}
