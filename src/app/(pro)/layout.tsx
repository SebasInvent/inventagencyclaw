"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="professional">
      <div className="min-h-screen">
        <Sidebar variant="pro" />
        <main className="pl-[280px] min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
