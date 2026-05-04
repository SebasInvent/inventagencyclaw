"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Info } from "lucide-react";
import { ArbitrationType } from "@/lib/types/database";

export function StepArbitraje() {
  const { arbitration_count, arbitration_type, updateField } =
    useWizardStore();

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Resolución de Conflictos</h2>
        <p className="text-muted-foreground mt-2">
          Define cómo se resolverán las diferencias entre socios
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                El arbitraje es obligatorio en los estatutos SAS. Se tramita
                ante el Centro de Arbitraje y Conciliación de la Cámara de
                Comercio de Bogotá.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Cantidad de árbitros
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => updateField("arbitration_count", 1)}
              className={`p-4 rounded-lg border text-center transition-colors ${
                arbitration_count === 1
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-2xl font-bold">1</span>
              <p className="text-xs mt-1">Un árbitro</p>
              <p className="text-xs text-muted-foreground">(Recomendado)</p>
            </button>
            <button
              onClick={() => updateField("arbitration_count", 3)}
              className={`p-4 rounded-lg border text-center transition-colors ${
                arbitration_count === 3
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-2xl font-bold">3</span>
              <p className="text-xs mt-1">Tres árbitros</p>
              <p className="text-xs text-muted-foreground">(Más costoso)</p>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Tipo de arbitraje</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                {
                  value: "derecho" as ArbitrationType,
                  label: "En Derecho",
                  desc: "Decisión basada en la ley (Recomendado)",
                },
                {
                  value: "equidad" as ArbitrationType,
                  label: "En Equidad",
                  desc: "Decisión basada en criterio del árbitro",
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateField("arbitration_type", opt.value)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  arbitration_type === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
