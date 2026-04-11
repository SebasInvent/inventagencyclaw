/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/lib/types/database";
import { useAuth } from "@/lib/auth/AuthProvider";

interface MessageWithSender extends Message {
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useMessages(projectId: string) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchMessages = async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const sendMessage = async (content: string, messageType: "text" | "file" = "text") => {
    if (!user || !projectId) return null;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        project_id: projectId,
        sender_id: user.id,
        content,
        message_type: messageType,
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    setMessages((prev) => [...prev, data]);
    return data;
  };

  const markAsRead = async (messageIds: string[]) => {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .in("id", messageIds);
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    fetchMessages,
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      const { data: projects } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          messages(
            id,
            content,
            created_at,
            is_read,
            sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
          )
        `)
        .or(`client_id.eq.${user.id},assigned_to.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (projects) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const convs = projects.map((project: any) => {
          const messages = project.messages || [];
          const lastMessage = messages[messages.length - 1];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unreadCount = messages.filter(
            (m: any) => !m.is_read && m.sender?.id !== user.id
          ).length;

          return {
            projectId: project.id,
            projectName: project.name,
            lastMessage: lastMessage?.content || "Sin mensajes",
            lastMessageTime: lastMessage?.created_at,
            unreadCount,
            participant: lastMessage?.sender,
          };
        });

        setConversations(convs.filter((c) => c.lastMessageTime));
      }

      setLoading(false);
    };

    fetchConversations();
  }, [user]);

  return { conversations, loading };
}
