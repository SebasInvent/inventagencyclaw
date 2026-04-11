"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectWithRelations } from "@/lib/types/database";
import { useAuth } from "@/lib/auth/AuthProvider";

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const supabase = createClient();

  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from("projects")
        .select(`
          *,
          client:profiles!projects_client_id_fkey(*),
          assigned_professional:profiles!projects_assigned_to_fkey(*)
        `)
        .order("created_at", { ascending: false });

      // If client, only show their projects
      if (profile?.role === "client") {
        query = query.eq("client_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Partial<Project>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...project,
        client_id: user.id,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    await fetchProjects();
    return data;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchProjects();
    return true;
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
  };
}

export function useProject(id: string) {
  const [project, setProject] = useState<ProjectWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:profiles!projects_client_id_fkey(*),
          assigned_professional:profiles!projects_assigned_to_fkey(*),
          deliverables(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProject(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  return { project, loading, error };
}
