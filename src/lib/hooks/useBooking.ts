"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface BookingSlot {
  date: Date;
  time: string;
  available: boolean;
}

interface BookingData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectDescription: string;
  scheduledAt: Date;
}

// Horarios disponibles (9 AM - 5 PM, slots de 1 hora)
const AVAILABLE_HOURS = [
  "09:00", "10:00", "11:00", "12:00", 
  "14:00", "15:00", "16:00", "17:00"
];

// Días de la semana disponibles (Lunes a Viernes)
const AVAILABLE_DAYS = [1, 2, 3, 4, 5]; // 0 = Domingo, 6 = Sábado

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const getAvailableSlots = async (date: Date): Promise<BookingSlot[]> => {
    const dayOfWeek = date.getDay();
    
    // Si no es día laboral, retornar vacío
    if (!AVAILABLE_DAYS.includes(dayOfWeek)) {
      return [];
    }

    // Obtener calls ya agendadas para ese día
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: existingCalls } = await supabase
      .from("discovery_calls")
      .select("scheduled_at")
      .gte("scheduled_at", startOfDay.toISOString())
      .lte("scheduled_at", endOfDay.toISOString())
      .in("status", ["scheduled", "rescheduled"]);

    const bookedTimes = (existingCalls || []).map((call) => {
      const callDate = new Date(call.scheduled_at);
      return `${callDate.getHours().toString().padStart(2, "0")}:00`;
    });

    // Generar slots disponibles
    const slots: BookingSlot[] = AVAILABLE_HOURS.map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(hours, minutes, 0, 0);

      // No mostrar slots en el pasado
      const now = new Date();
      const isPast = slotDate <= now;

      return {
        date: slotDate,
        time,
        available: !bookedTimes.includes(time) && !isPast,
      };
    });

    return slots;
  };

  const getAvailableDates = (startDate: Date, days: number = 30): Date[] => {
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < days; i++) {
      if (AVAILABLE_DAYS.includes(current.getDay())) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const createBooking = async (data: BookingData): Promise<{ success: boolean; callId?: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Primero verificar si el usuario ya existe o crear uno temporal
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", data.email)
        .single();

      const clientId = existingProfile?.id;

      // Si no existe, crear la call sin client_id (para prospectos)
      // El profesional asignará el cliente después

      const { data: call, error: callError } = await supabase
        .from("discovery_calls")
        .insert({
          client_id: clientId || null,
          scheduled_at: data.scheduledAt.toISOString(),
          duration_minutes: 60,
          status: "scheduled",
          notes: JSON.stringify({
            prospectName: data.name,
            prospectEmail: data.email,
            prospectCompany: data.company,
            prospectPhone: data.phone,
            projectDescription: data.projectDescription,
          }),
        })
        .select()
        .single();

      if (callError) throw callError;

      // También guardar como quotation para tracking
      await supabase.from("quotations").insert({
        email: data.email,
        project_type: "other",
        complexity: "intermediate",
        timeline: "standard",
        estimated_min: 10000,
        estimated_max: 25000,
        converted_to_call: true,
      });

      setLoading(false);
      return { success: true, callId: call.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear la reserva";
      setError(message);
      setLoading(false);
      return { success: false };
    }
  };

  return {
    getAvailableSlots,
    getAvailableDates,
    createBooking,
    loading,
    error,
  };
}
