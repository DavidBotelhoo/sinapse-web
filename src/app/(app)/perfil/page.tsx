import { AccountForm } from "@/components/profile/AccountForm";
import { SecurityCard } from "@/components/profile/SecurityCard";
import { AppearanceCard, SignOutCard } from "@/components/profile/AppearanceAndSignOut";

export const metadata = {
  title: "Perfil · Sinapse",
};

/** Aba Conta (telas 24 e 25). */
export default function PerfilPage() {
  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <AccountForm />
      <AppearanceCard />
      <SecurityCard />
      <SignOutCard />
    </div>
  );
}
