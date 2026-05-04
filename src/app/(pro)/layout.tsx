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
        {/* Mobile: full width + top padding for burger; Desktop: 280px left padding */}
        <main className="pl-0 pt-16 md:pt-0 md:pl-[280px] min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
