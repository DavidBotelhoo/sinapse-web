import { getStudyOverview } from "@/lib/api/studyServer";
import { StudyPicker } from "@/components/study/StudyPicker";
import { StudyEmpty } from "@/components/study/StudyEmpty";

export const metadata = {
  title: "Estudar · Sinapse",
};

export default async function EstudarPage() {
  const overview = await getStudyOverview();
  if (overview.decks.length === 0) return <StudyEmpty />;
  return <StudyPicker overview={overview} />;
}
