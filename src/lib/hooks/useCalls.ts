"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DiscoveryCall, DiscoveryCallWithRelations } from "@/lib/types/database";
import { useAuth } from "@/lib/auth/AuthProvider";

export function useCalls() {
  const [calls, setCalls] = useState<DiscoveryCallWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const supabase = createClient();

  const fetchCalls = async () => {
    if (!user) return;

    let query = supabase
      .from("discovery_calls")
      .select(`
        *,
        client:profiles!discovery_calls_client_id_fkey(*),
        professional:profiles!discovery_calls_professional_id_fkey(*),
        project:projects(*)
      `)
      .order("scheduled_at", { ascending: true });

    // Filter based on role
    if (profile?.role === "client") {
      query = query.eq("client_id", user.id);
    } else if (profile?.role === "professional") {
      query = query.eq("professional_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setCalls(data || []);
    }
    setLoading(false);
  };

  const createCall = async (call: Partial<DiscoveryCall>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("discovery_calls")
      .insert({
        ...call,
        client_id: user.id,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    await fetchCalls();
    return data;
  };

  const updateCall = async (id: string, updates: Partial<DiscoveryCall>) => {
    const { error } = await supabase
      .from("discovery_calls")
      .update(updates)
      .eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchCalls();
    return true;
  };

  useEffect(() => {
    if (user) {
      fetchCalls();
    }
  }, [user]);

  const upcomingCalls = calls.filter(
    (c) => c.status === "scheduled" && new Date(c.scheduled_at) > new Date()
  );

  const pastCalls = calls.filter(
    (c) => c.status === "completed" || new Date(c.scheduled_at) < new Date()
  );

  return {
    calls,
    upcomingCalls,
    pastCalls,
    loading,
    error,
    fetchCalls,
    createCall,
    updateCall,
  };
}
