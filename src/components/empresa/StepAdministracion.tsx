"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserCog, Users, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepAdministracion() {
  const {
    founders,
    rep_legal_principal_id,
    rep_legal_suplente_id,
    has_junta,
    junta_presidente_id,
    junta_vice_id,
    junta_miembro_ids,
    updateField,
  } = useWizardStore();

  const namedFounders = founders.filter((f) => f.full_name.trim() !== "");

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Administración</h2>
        <p className="text-muted-foreground mt-2">
          Designa el representante legal y opcionalmente una junta directiva
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Rep Legal Principal */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <Label className="flex items-center gap-2 font-semibold">
              <UserCog className="w-4 h-4 text-primary" />
              Representante Legal Principal
            </Label>
            <p className="text-xs text-muted-foreground">
              Persona autorizada para actuar en nombre de la sociedad
            </p>
            <select
              value={rep_legal_principal_id}
              onChange={(e) =>
                updateField("rep_legal_principal_id", e.target.value)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Seleccionar socio...</option>
              {namedFounders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.full_name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Rep Legal Suplente */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <Label className="flex items-center gap-2 font-semibold">
              <UserCog className="w-4 h-4" />
              Representante Legal Suplente
            </Label>
            <p className="text-xs text-muted-foreground">
              Reemplaza al principal en caso de ausencia (opcional pero
              recomendado)
            </p>
            <select
              value={rep_legal_suplente_id}
              onChange={(e) =>
                updateField("rep_legal_suplente_id", e.target.value)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Seleccionar socio (opcional)...</option>
              {namedFounders
                .filter((f) => f.id !== rep_legal_principal_id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.full_name}
                  </option>
                ))}
            </select>
          </CardContent>
        </Card>

        {/* Junta Directiva Toggle */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-sm">Junta Directiva</span>
          </div>
          <Button
            variant={has_junta ? "default" : "outline"}
            size="sm"
            onClick={() => updateField("has_junta", !has_junta)}
            className="gap-2"
          >
            <ToggleLeft className="w-4 h-4" />
            {has_junta ? "Activada" : "Desactivada"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground px-1 -mt-4">
          Opcional. Útil si quieres definir roles de gobierno entre los socios.
        </p>

        {has_junta && (
          <Card className="border-primary/20">
            <CardContent className="pt-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label>Presidente</Label>
                <select
                  value={junta_presidente_id}
                  onChange={(e) =>
                    updateField("junta_presidente_id", e.target.value)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Seleccionar...</option>
                  {namedFounders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Vicepresidente</Label>
                <select
                  value={junta_vice_id}
                  onChange={(e) =>
                    updateField("junta_vice_id", e.target.value)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Seleccionar...</option>
                  {namedFounders
                    .filter((f) => f.id !== junta_presidente_id)
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.full_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Miembros adicionales</Label>
                <div className="space-y-1">
                  {namedFounders
                    .filter(
                      (f) =>
                        f.id !== junta_presidente_id &&
                        f.id !== junta_vice_id
                    )
                    .map((f) => (
                      <label
                        key={f.id}
                        className="flex items-center gap-2 text-sm cursor-pointer py-1"
                      >
                        <input
                          type="checkbox"
                          checked={junta_miembro_ids.includes(f.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField("junta_miembro_ids", [
                                ...junta_miembro_ids,
                                f.id,
                              ]);
                            } else {
                              updateField(
                                "junta_miembro_ids",
                                junta_miembro_ids.filter(
                                  (id) => id !== f.id
                                )
                              );
                            }
                          }}
                          className="rounded border-input"
                        />
                        {f.full_name}
                      </label>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
