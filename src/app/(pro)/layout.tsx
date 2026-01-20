import { Sidebar } from "@/components/layout/Sidebar";

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar variant="pro" />
      <main className="pl-[280px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
