"use client";

import { create } from "zustand";
import { IdType, ArbitrationType, FounderRole } from "@/lib/types/database";

export interface WizardFounder {
  id: string;
  full_name: string;
  id_type: IdType;
  id_number: string;
  id_expedition_place: string;
  domicile: string;
  share_percentage: number;
  roles: FounderRole[];
}

export interface WizardState {
  currentStep: number;
  // Step 1: City & Date
  city: string;
  constitution_date: string;
  // Step 2: Founders
  founders: WizardFounder[];
  // Step 3: Company Info
  company_name: string;
  object_description: string;
  duration: string;
  // Step 4: Capital
  authorized_capital: number;
  share_nominal_value: number;
  // Step 5: Administration
  rep_legal_principal_id: string;
  rep_legal_suplente_id: string;
  has_junta: boolean;
  junta_presidente_id: string;
  junta_vice_id: string;
  junta_miembro_ids: string[];
  // Step 6: Arbitration
  arbitration_count: 1 | 3;
  arbitration_type: ArbitrationType;
}

export interface WizardActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: <K extends keyof WizardState>(field: K, value: WizardState[K]) => void;
  addFounder: () => void;
  removeFounder: (id: string) => void;
  updateFounder: (id: string, field: keyof WizardFounder, value: string | number | IdType | FounderRole[]) => void;
  resetWizard: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const defaultFounder = (): WizardFounder => ({
  id: generateId(),
  full_name: "",
  id_type: "CC",
  id_number: "",
  id_expedition_place: "Bogotá D.C.",
  domicile: "Bogotá D.C.",
  share_percentage: 0,
  roles: ["socio"],
});

const today = new Date().toISOString().split("T")[0];

const initialState: WizardState = {
  currentStep: 0,
  city: "Bogotá D.C.",
  constitution_date: today,
  founders: [defaultFounder()],
  company_name: "",
  object_description: "",
  duration: "indefinida",
  authorized_capital: 1000000,
  share_nominal_value: 1000,
  rep_legal_principal_id: "",
  rep_legal_suplente_id: "",
  has_junta: false,
  junta_presidente_id: "",
  junta_vice_id: "",
  junta_miembro_ids: [],
  arbitration_count: 1,
  arbitration_type: "derecho",
};

export const useWizardStore = create<WizardState & WizardActions>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  updateField: (field, value) => set({ [field]: value }),

  addFounder: () =>
    set((s) => ({ founders: [...s.founders, defaultFounder()] })),

  removeFounder: (id) =>
    set((s) => ({
      founders: s.founders.filter((f) => f.id !== id),
    })),

  updateFounder: (id, field, value) =>
    set((s) => ({
      founders: s.founders.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    })),

  resetWizard: () => set({ ...initialState, founders: [defaultFounder()] }),
}));
