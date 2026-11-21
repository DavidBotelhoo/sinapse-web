import { redirect } from "next/navigation";
import { getCommunityDeck } from "@/lib/api/communityServer";
import { CommunityDeckPreview } from "@/components/community/CommunityDeckPreview";

type Props = {
  params: Promise<{ deckId: string }>;
};

export default async function ComunidadeDeckPage({ params }: Props) {
  const { deckId } = await params;
  const deck = await getCommunityDeck(deckId);
  // Já salvo (ou da própria pessoa): a versão de Flashcards, com o progresso e "Estudar".
  if (deck.isSaved || deck.isMine) redirect(`/flashcards/${deck.id}`);
  return <CommunityDeckPreview deck={deck} />;
}

export async function generateMetadata({ params }: Props) {
  const { deckId } = await params;
  try {
    const deck = await getCommunityDeck(deckId);
    return { title: `${deck.name} · Comunidade · Sinapse` };
  } catch {
    return { title: "Comunidade · Sinapse" };
  }
}
