"use client";

import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCurrency,
  formatNumber,
  SUGGESTED_CAPITALS,
} from "@/lib/utils/capital-calculator";
import { DollarSign, Lightbulb, PieChart } from "lucide-react";

export function StepCapitalAcciones() {
  const {
    authorized_capital,
    share_nominal_value,
    founders,
    updateField,
  } = useWizardStore();

  const totalShares = Math.floor(authorized_capital / share_nominal_value) || 0;

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Capital y Acciones</h2>
        <p className="text-muted-foreground mt-2">
          Define el capital de la sociedad y el valor de las acciones
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Tip */}
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Consejo para ahorrar</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Un capital más bajo reduce los costos de registro en Cámara de
                  Comercio. Con $1.000.000 el registro cuesta aproximadamente
                  $87.000 COP.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capital presets */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Capital autorizado
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_CAPITALS.map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  if (s.value > 0) {
                    updateField("authorized_capital", s.value);
                    updateField("share_nominal_value", s.shareValue);
                  }
                }}
                className={`text-left text-xs px-3 py-2 rounded-md border transition-colors ${
                  authorized_capital === s.value && s.value > 0
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium">{s.label}</span>
                <br />
                <span className="text-muted-foreground">{s.tip}</span>
              </button>
            ))}
          </div>

          <Input
            type="number"
            min={1000}
            step={1000}
            value={authorized_capital}
            onChange={(e) =>
              updateField("authorized_capital", parseInt(e.target.value) || 0)
            }
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground">
            Capital: {formatCurrency(authorized_capital)}
          </p>
        </div>

        {/* Share nominal value */}
        <div className="space-y-2">
          <Label>Valor nominal por acción</Label>
          <select
            value={share_nominal_value}
            onChange={(e) =>
              updateField("share_nominal_value", parseInt(e.target.value))
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={100}>$100 por acción</option>
            <option value={1000}>$1.000 por acción (recomendado)</option>
            <option value={5000}>$5.000 por acción</option>
            <option value={10000}>$10.000 por acción</option>
          </select>
        </div>

        {/* Summary */}
        <Card className="border-primary/30">
          <CardContent className="pt-4 pb-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Resumen de Capital
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Total acciones:</span>
              <span className="font-mono">{formatNumber(totalShares)}</span>
              <span className="text-muted-foreground">Capital autorizado:</span>
              <span className="font-mono">
                {formatCurrency(authorized_capital)}
              </span>
              <span className="text-muted-foreground">Capital suscrito:</span>
              <span className="font-mono">
                {formatCurrency(authorized_capital)}
              </span>
              <span className="text-muted-foreground">Capital pagado:</span>
              <span className="font-mono">
                {formatCurrency(authorized_capital)}
              </span>
            </div>

            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium mb-2">
                Distribución por socio:
              </h4>
              {founders.map((f) => {
                const shares = Math.floor(
                  totalShares * ((f.share_percentage || 0) / 100)
                );
                const value = shares * share_nominal_value;
                return (
                  <div
                    key={f.id}
                    className="flex justify-between text-xs py-1"
                  >
                    <span className="text-muted-foreground truncate mr-2">
                      {f.full_name || "Sin nombre"}
                    </span>
                    <span className="font-mono whitespace-nowrap">
                      {f.share_percentage}% · {formatNumber(shares)} acc ·{" "}
                      {formatCurrency(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
