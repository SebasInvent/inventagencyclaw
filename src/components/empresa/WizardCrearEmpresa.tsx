"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { StepCiudadFecha } from "./StepCiudadFecha";
import { StepConstituyentes } from "./StepConstituyentes";
import { StepDatosSociedad } from "./StepDatosSociedad";
import { StepCapitalAcciones } from "./StepCapitalAcciones";
import { StepAdministracion } from "./StepAdministracion";
import { StepArbitraje } from "./StepArbitraje";
import { DocumentPreview } from "./DocumentPreview";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Users,
  Building2,
  DollarSign,
  UserCog,
  Scale,
  FileText,
  Check,
} from "lucide-react";

const STEPS = [
  { label: "Ciudad y Fecha", icon: MapPin },
  { label: "Constituyentes", icon: Users },
  { label: "Datos Sociedad", icon: Building2 },
  { label: "Capital", icon: DollarSign },
  { label: "Administración", icon: UserCog },
  { label: "Arbitraje", icon: Scale },
];

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        const isPreview = currentStep === 6;

        return (
          <button
            key={step.label}
            onClick={() => onStepClick(idx)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              isActive
                ? "bg-primary text-primary-foreground"
                : isCompleted || isPreview
                ? "bg-primary/20 text-primary cursor-pointer"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isCompleted || isPreview ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Icon className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
      {currentStep === 6 && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground">
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </div>
      )}
    </div>
  );
}

function validateStep(step: number, state: ReturnType<typeof useWizardStore.getState>): boolean {
  switch (step) {
    case 0:
      return state.city.trim() !== "" && state.constitution_date !== "";
    case 1:
      return (
        state.founders.length > 0 &&
        state.founders.every((f) => f.full_name.trim() !== "" && f.id_number.trim() !== "") &&
        Math.abs(state.founders.reduce((sum, f) => sum + (f.share_percentage || 0), 0) - 100) < 0.01
      );
    case 2:
      return state.company_name.trim() !== "";
    case 3:
      return state.authorized_capital > 0 && state.share_nominal_value > 0;
    case 4:
      return state.rep_legal_principal_id !== "";
    case 5:
      return true;
    default:
      return true;
  }
}

export function WizardCrearEmpresa() {
  const state = useWizardStore();
  const { currentStep, setStep, nextStep, prevStep } = state;

  const canProceed = validateStep(currentStep, state);
  const isPreview = currentStep === 6;

  const handleNext = () => {
    if (currentStep === 5) {
      setStep(6);
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Crea tu Empresa S.A.S.
          </h1>
          <p className="text-muted-foreground mt-2">
            Genera los estatutos listos para Cámara de Comercio de Colombia
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} onStepClick={setStep} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && <StepCiudadFecha />}
            {currentStep === 1 && <StepConstituyentes />}
            {currentStep === 2 && <StepDatosSociedad />}
            {currentStep === 3 && <StepCapitalAcciones />}
            {currentStep === 4 && <StepAdministracion />}
            {currentStep === 5 && <StepArbitraje />}
            {currentStep === 6 && <DocumentPreview />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (isPreview) setStep(5);
              else prevStep();
            }}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <span className="text-sm text-muted-foreground">
            {isPreview
              ? "Vista previa"
              : `Paso ${currentStep + 1} de ${STEPS.length}`}
          </span>

          {!isPreview && (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2"
            >
              {currentStep === 5 ? "Ver Documento" : "Siguiente"}
              {currentStep === 5 ? (
                <FileText className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          )}

          {isPreview && <div />}
        </div>
      </div>
    </div>
  );
}
