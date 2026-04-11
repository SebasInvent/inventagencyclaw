"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Trash2, Users } from "lucide-react";
import { IdType } from "@/lib/types/database";

const ID_TYPES: { value: IdType; label: string }[] = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "Pasaporte", label: "Pasaporte" },
];

export function StepConstituyentes() {
  const { founders, addFounder, removeFounder, updateFounder } = useWizardStore();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Constituyentes / Socios</h2>
        <p className="text-muted-foreground mt-2">
          Agrega las personas que constituirán la sociedad
        </p>
      </div>

      <div className="space-y-4">
        {founders.map((founder, index) => (
          <Card key={founder.id} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">
                    Socio {index + 1}
                  </span>
                </div>
                {founders.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFounder(founder.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Nombre completo</Label>
                  <Input
                    placeholder="Ej: Juan Sebastián Garzón Martínez"
                    value={founder.full_name}
                    onChange={(e) =>
                      updateFounder(founder.id, "full_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de identificación</Label>
                  <select
                    value={founder.id_type}
                    onChange={(e) =>
                      updateFounder(founder.id, "id_type", e.target.value as IdType)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {ID_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Número de identificación</Label>
                  <Input
                    placeholder="Ej: 1.022.397.078"
                    value={founder.id_number}
                    onChange={(e) =>
                      updateFounder(founder.id, "id_number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lugar de expedición</Label>
                  <Input
                    placeholder="Ej: Bogotá D.C."
                    value={founder.id_expedition_place}
                    onChange={(e) =>
                      updateFounder(
                        founder.id,
                        "id_expedition_place",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Domicilio</Label>
                  <Input
                    placeholder="Ej: Bogotá D.C."
                    value={founder.domicile}
                    onChange={(e) =>
                      updateFounder(founder.id, "domicile", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Porcentaje de acciones (%)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Ej: 40"
                    value={founder.share_percentage || ""}
                    onChange={(e) =>
                      updateFounder(
                        founder.id,
                        "share_percentage",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" onClick={addFounder} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Agregar socio
        </Button>

        {(() => {
          const total = founders.reduce(
            (sum, f) => sum + (f.share_percentage || 0),
            0
          );
          const isValid = Math.abs(total - 100) < 0.01;
          return (
            <p
              className={`text-sm font-medium ${
                isValid ? "text-green-500" : "text-yellow-500"
              }`}
            >
              Total de acciones: {total.toFixed(1)}%{" "}
              {isValid ? "✓" : "(debe sumar 100%)"}
            </p>
          );
        })()}
      </div>
    </div>
  );
}
