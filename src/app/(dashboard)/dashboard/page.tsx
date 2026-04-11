"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-background">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">No has iniciado sesión</p>
        <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido, {profile?.full_name || user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Proyectos Activos</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">En Progreso</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Completados</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Próximas Calls</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Funcionando</h2>
          <p className="text-muted-foreground mb-4">
            Has iniciado sesión correctamente. El dashboard está listo.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/dashboard/crear-empresa" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              🏢 Crear Empresa S.A.S.
            </Link>
            <Link href="/quote" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
              Cotizar Proyecto
            </Link>
            <Link href="/book" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
              Agendar Call
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
