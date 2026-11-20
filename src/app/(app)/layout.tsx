import type { ReactNode } from "react";
import { getMeOrRedirect } from "@/lib/api/me";
import { getTodayCount } from "@/lib/api/studyServer";
import { Sidebar } from "@/components/app/Sidebar";
import { BottomNav } from "@/components/app/BottomNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const [me, todayCount] = await Promise.all([getMeOrRedirect(), getTodayCount()]);
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[var(--spacing-sidebar)_minmax(0,1fr)]">
      <Sidebar
        user={{
          firstName: me.firstName,
          lastName: me.lastName,
          avatarUrl: me.avatarUrl,
        }}
        initialTodayCount={todayCount}
      />
      <main className="min-w-0 w-full max-w-content mx-auto px-4 pt-6 pb-[calc(var(--spacing-bottom-nav)+2rem)] md:px-8 md:py-8 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
