import Link from "next/link";
import { getMeOrRedirect } from "@/lib/api/me";
import { getAgenda, getMeStats, getRecentDecks } from "@/lib/api/studyServer";
import { Avatar } from "@/components/ui/Avatar";
import { HomeStats } from "@/components/home/HomeStats";
import { RecentDecks } from "@/components/home/RecentDecks";
import { CreateDeckBanner } from "@/components/home/CreateDeckBanner";
import { AgendaCard } from "@/components/home/AgendaCard";
import { longDate } from "@/components/home/dates";
import { cardsLabel } from "@/components/study/format";
import { AGENDA_DAYS } from "@/lib/api/constants";

export const metadata = {
  title: "Início · Sinapse",
};

export default async function InicioPage() {
  const [me, stats, recent, agenda] = await Promise.all([
    getMeOrRedirect(),
    getMeStats(),
    getRecentDecks(4),
    getAgenda(AGENDA_DAYS),
  ]);
  // O primeiro dia da agenda é hoje, no fuso de quem estuda.
  const today = agenda.days[0]?.date ?? agenda.date;
  const dueToday = agenda.days[0]?.total ?? 0;
  const dueText = dueToday > 0 ? `${cardsLabel(dueToday)} para revisar hoje.` : "Nada para revisar hoje.";

  return (
    <div className="flex flex-col gap-7 md:gap-10">
      <header className="flex items-center gap-3">
        <div className="flex-1 min-w-0 grid gap-[2px] md:gap-1">
          <h1 className="m-0 font-display text-title-1 text-ink">Olá, {me.firstName}</h1>
          <p className="m-0 text-ink-muted">
            <span className="max-md:hidden">{longDate(today)} · </span>
            {dueText}
          </p>
        </div>
        <Link href="/perfil" aria-label="Perfil" className="md:hidden rounded-full no-underline">
          <Avatar name={`${me.firstName} ${me.lastName}`} src={me.avatarUrl ?? undefined} decorative />
        </Link>
      </header>

      <HomeStats stats={stats} today={today} />

      <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-7 md:gap-6">
        <div className="flex-[2_1_560px] min-w-0 flex flex-col gap-7 md:gap-8">
          <RecentDecks decks={recent} today={today} timeZone={me.timezone} />
          <CreateDeckBanner />
        </div>
        {/* No celular, a agenda vem logo depois dos números. */}
        <div className="max-md:order-first flex-[1_1_320px] min-w-0">
          <AgendaCard initial={agenda} />
        </div>
      </div>
    </div>
  );
}
