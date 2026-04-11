"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar } from "lucide-react";

const CITIES = [
  "Bogotá D.C.",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Cúcuta",
  "Santa Marta",
  "Ibagué",
  "Villavicencio",
  "Pasto",
  "Neiva",
  "Armenia",
];

export function StepCiudadFecha() {
  const { city, constitution_date, updateField } = useWizardStore();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Ciudad y Fecha de Constitución</h2>
        <p className="text-muted-foreground mt-2">
          Indica dónde y cuándo se constituirá la sociedad
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ciudad de constitución
          </Label>
          <select
            id="city"
            value={city}
            onChange={(e) => updateField("city", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Si tu ciudad no aparece, escríbela manualmente abajo
          </p>
          <Input
            placeholder="Otra ciudad..."
            value={!CITIES.includes(city) ? city : ""}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha de constitución
          </Label>
          <Input
            id="date"
            type="date"
            value={constitution_date}
            onChange={(e) => updateField("constitution_date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
