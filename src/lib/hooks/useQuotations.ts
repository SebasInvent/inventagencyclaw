"use client";

import { createClient } from "@/lib/supabase/client";
import { ProjectType, ComplexityLevel, TimelineType } from "@/lib/types/database";

interface QuotationInput {
  projectType: ProjectType;
  complexity: ComplexityLevel;
  timeline: TimelineType;
  estimatedMin: number;
  estimatedMax: number;
  email?: string;
}

export function useQuotations() {
  const supabase = createClient();

  const saveQuotation = async (input: QuotationInput) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("quotations")
      .insert({
        user_id: user?.id || null,
        email: input.email || null,
        project_type: input.projectType,
        complexity: input.complexity,
        timeline: input.timeline,
        estimated_min: input.estimatedMin,
        estimated_max: input.estimatedMax,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving quotation:", error);
      return null;
    }

    return data;
  };

  const convertToCall = async (quotationId: string) => {
    const { error } = await supabase
      .from("quotations")
      .update({ converted_to_call: true })
      .eq("id", quotationId);

    return !error;
  };

  const convertToProject = async (quotationId: string) => {
    const { error } = await supabase
      .from("quotations")
      .update({ converted_to_project: true })
      .eq("id", quotationId);

    return !error;
  };

  return {
    saveQuotation,
    convertToCall,
    convertToProject,
  };
}
