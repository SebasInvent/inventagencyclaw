"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Invoice } from "@/lib/types/database";
import { useAuth } from "@/lib/auth/AuthProvider";

interface InvoiceWithProject extends Invoice {
  project?: {
    id: string;
    name: string;
  };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const supabase = createClient();

  const fetchInvoices = async () => {
    if (!user) return;

    let query = supabase
      .from("invoices")
      .select(`
        *,
        project:projects(id, name)
      `)
      .order("created_at", { ascending: false });

    // Clients only see their invoices
    if (profile?.role === "client") {
      query = query.eq("client_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const totalPending = invoices
    .filter((i) => i.status === "sent" || i.status === "draft")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const totalOverdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  return {
    invoices,
    loading,
    error,
    totalPaid,
    totalPending,
    totalOverdue,
    fetchInvoices,
  };
}
