"use client";

import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar variant="client" />
      {/* On mobile: full width with top padding for the burger button.
          On md+: 280px left padding for the persistent sidebar. */}
      <main className="pl-0 pt-16 md:pt-0 md:pl-[280px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
