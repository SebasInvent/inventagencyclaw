import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar variant="client" />
      <main className="pl-[280px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
