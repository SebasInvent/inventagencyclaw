"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, FileText, Clock } from "lucide-react";

const OBJETO_SOCIAL_TEMPLATES = [
  {
    label: "Tecnología y Software",
    value:
      "La sociedad desarrollará cualquier actividad legal en Colombia así como especialmente, actividades tecnológicas, consultoría, innovación digital, desarrollo de software, inversión y actividades relacionadas.",
  },
  {
    label: "Consultoría General",
    value:
      "La sociedad tendrá como objeto social la prestación de servicios de consultoría empresarial, asesoría técnica, administrativa, financiera y de gestión organizacional.",
  },
  {
    label: "Comercio y Servicios",
    value:
      "La sociedad tendrá como objeto social la compraventa, importación, exportación, distribución y comercialización de toda clase de bienes y la prestación de servicios relacionados.",
  },
  {
    label: "Construcción e Inmobiliario",
    value:
      "La sociedad tendrá como objeto social actividades de construcción, promoción inmobiliaria, compraventa de bienes inmuebles, administración de propiedades y proyectos de ingeniería civil.",
  },
  {
    label: "Personalizado",
    value: "",
  },
];

export function StepDatosSociedad() {
  const { company_name, object_description, duration, updateField } =
    useWizardStore();

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Datos de la Sociedad</h2>
        <p className="text-muted-foreground mt-2">
          Define el nombre, objeto social y duración
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Nombre de la sociedad
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="company"
              placeholder="Ej: ELSONAR"
              value={company_name.replace(/ S\.A\.S\.?$/i, "")}
              onChange={(e) => {
                const name = e.target.value.toUpperCase().trim();
                updateField("company_name", name ? `${name} S.A.S.` : "");
              }}
            />
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
              S.A.S.
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            El sufijo S.A.S. se agrega automáticamente
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Objeto social
          </Label>
          <div className="grid grid-cols-1 gap-2 mb-3">
            {OBJETO_SOCIAL_TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => updateField("object_description", t.value)}
                className={`text-left text-xs px-3 py-2 rounded-md border transition-colors ${
                  object_description === t.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Describe las actividades principales de la sociedad..."
            value={object_description}
            onChange={(e) => updateField("object_description", e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Siempre se incluirá: &quot;La sociedad puede realizar, en Colombia y en
            el exterior cualquier actividad lícita, comercial o civil.&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duración
          </Label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => updateField("duration", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="indefinida">Indefinida (recomendado)</option>
            <option value="10 años">10 años</option>
            <option value="20 años">20 años</option>
            <option value="30 años">30 años</option>
            <option value="50 años">50 años</option>
          </select>
        </div>
      </div>
    </div>
  );
}
