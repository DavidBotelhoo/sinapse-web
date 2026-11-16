import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata = {
  title: "Criar conta · Sinapse",
};

export default async function CriarContaPage() {
  const store = await cookies();
  if (store.has("sn_access")) redirect("/inicio");
  return <AuthPanel initialMode="signup" />;
}
