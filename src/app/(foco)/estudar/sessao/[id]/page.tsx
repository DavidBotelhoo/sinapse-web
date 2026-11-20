import { getStudySession } from "@/lib/api/studyServer";
import { StudySession } from "@/components/study/StudySession";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Sessão de estudo · Sinapse",
};

export default async function SessaoPage({ params }: Props) {
  const { id } = await params;
  const session = await getStudySession(id);
  // A chave zera o estado ao trocar de sessão ("Estudar novamente").
  return <StudySession key={session.sessionId} session={session} />;
}
