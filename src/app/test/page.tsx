"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function TestPage() {
  const { user, profile, loading } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog("TestPage mounted");
    addLog(`Auth loading: ${loading}`);
    addLog(`User: ${user ? user.id : 'null'}`);
    addLog(`Profile: ${profile ? profile.email : 'null'}`);

    const supabase = createClient();
    addLog(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    addLog(`Supabase Key exists: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);

    const testConnection = async () => {
      try {
        addLog("Testing Supabase connection...");
        const { data, error } = await supabase.from("profiles").select("count");
        if (error) {
          addLog(`Supabase error: ${error.message}`);
        } else {
          addLog(`Supabase connected! Count: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        addLog(`Exception: ${err}`);
      }
    };

    if (!loading) {
      testConnection();
    }
  }, [user, profile, loading]);

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico de Dashboard</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg border">
          <h2 className="font-semibold mb-2">Estado de Autenticación</h2>
          <p>Loading: {loading ? "Sí" : "No"}</p>
          <p>User ID: {user?.id || "No autenticado"}</p>
          <p>Email: {user?.email || "N/A"}</p>
          <p>Profile: {profile?.email || "No cargado"}</p>
          <p>Role: {profile?.role || "N/A"}</p>
        </div>

        <div className="p-4 bg-card rounded-lg border">
          <h2 className="font-semibold mb-2">Variables de Entorno</h2>
          <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "NO DEFINIDA"}</p>
          <p>SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "DEFINIDA" : "NO DEFINIDA"}</p>
        </div>

        <div className="p-4 bg-card rounded-lg border">
          <h2 className="font-semibold mb-2">Logs de Diagnóstico</h2>
          <div className="space-y-1 text-sm font-mono max-h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-xs">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
