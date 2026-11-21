import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/api/serverClient";
import { isApiError } from "@/lib/api/base";
import { DeckPage } from "./DeckPage";
import type { DeckDetail } from "@/lib/api/decks";

type Props = {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ salvo?: string }>;
};

async function fetchDeck(deckId: string): Promise<DeckDetail> {
  const client = await createServerClient();
  try {
    const { data } = await client.GET("/v1/decks/{id}", { params: { path: { id: deckId } } });
    if (!data) throw new Error("vazio");
    return data;
  } catch (err) {
    if (isApiError(err)) {
      if (err.status === 401) redirect("/entrar");
      if (err.status === 404) notFound();
    }
    throw err;
  }
}

export default async function DeckDetailPage({ params, searchParams }: Props) {
  const [{ deckId }, { salvo }] = await Promise.all([params, searchParams]);
  const deck = await fetchDeck(deckId);

  if (!deck.isMine && !deck.isSaved) {
    redirect(`/comunidade/${deck.id}`);
  }

  // ?salvo=1: acabou de salvar pela Comunidade; o botão principal vira "Estudar agora".
  return <DeckPage initialDeck={deck} justSaved={salvo === "1" && !deck.isMine} />;
}

export async function generateMetadata({ params }: Props) {
  const { deckId } = await params;
  try {
    const deck = await fetchDeck(deckId);
    return { title: `${deck.name} · Sinapse` };
  } catch {
    return { title: "Deck · Sinapse" };
  }
}
