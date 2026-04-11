"use client";

import { useMemo } from "react";
import { useWizardStore } from "@/lib/hooks/useCompanyRegistration";
import { generateEstatutosSAS } from "@/lib/templates/estatutos-sas";
import { CompanyRegistrationWithFounders, FounderRole } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentPreview() {
  const state = useWizardStore();

  const document = useMemo(() => {
    const totalShares =
      Math.floor(state.authorized_capital / state.share_nominal_value) || 0;

    const founders = state.founders.map((f, idx) => {
      const roles: FounderRole[] = ["socio"];
      if (f.id === state.rep_legal_principal_id) roles.push("rep_legal_principal");
      if (f.id === state.rep_legal_suplente_id) roles.push("rep_legal_suplente");
      if (state.has_junta) {
        if (f.id === state.junta_presidente_id) roles.push("junta_presidente");
        if (f.id === state.junta_vice_id) roles.push("junta_vicepresidente");
        if (state.junta_miembro_ids.includes(f.id)) roles.push("junta_miembro");
      }

      const shareCount = Math.floor(totalShares * ((f.share_percentage || 0) / 100));

      return {
        id: f.id,
        registration_id: "",
        full_name: f.full_name || "[NOMBRE PENDIENTE]",
        id_type: f.id_type,
        id_number: f.id_number || "[NÚMERO PENDIENTE]",
        id_expedition_place: f.id_expedition_place,
        domicile: f.domicile,
        share_percentage: f.share_percentage,
        share_count: shareCount,
        share_value: shareCount * state.share_nominal_value,
        roles,
        display_order: idx,
        created_at: new Date().toISOString(),
      };
    });

    const reg: CompanyRegistrationWithFounders = {
      id: "",
      user_id: "",
      plan: "free",
      payment_status: "free",
      payment_reference: null,
      payment_amount: null,
      company_name: state.company_name || "[NOMBRE DE LA SOCIEDAD S.A.S.]",
      city: state.city,
      constitution_date: state.constitution_date,
      object_description: state.object_description || null,
      duration: state.duration,
      authorized_capital: state.authorized_capital,
      subscribed_capital: state.authorized_capital,
      paid_capital: state.authorized_capital,
      share_nominal_value: state.share_nominal_value,
      total_shares: totalShares,
      arbitration_count: state.arbitration_count,
      arbitration_type: state.arbitration_type,
      status: "preview",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      founders,
    };

    return generateEstatutosSAS(reg);
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Vista Previa del Documento</h2>
        <p className="text-muted-foreground mt-2">
          Revisa tus estatutos antes de descargar
        </p>
      </div>

      {/* Document Preview */}
      <Card className="border-border max-w-3xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              Estatutos {state.company_name || "S.A.S."}
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground/90">
            {document}
          </pre>
        </CardContent>
      </Card>

      {/* Download CTA */}
      <Card className="border-primary/30 bg-primary/5 max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-lg">¿Listo para descargar?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Descarga tus estatutos en PDF profesional listo para firmar y
                llevar a Cámara de Comercio.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="lg" className="gap-2" disabled>
                <Download className="w-4 h-4" />
                Descargar PDF — $200.000 COP
              </Button>
              <p className="text-xs text-center text-muted-foreground flex items-center gap-1 justify-center">
                <Lock className="w-3 h-3" />
                Pago seguro con MercadoPago
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-primary/20">
            <h4 className="text-sm font-semibold mb-3">
              Planes disponibles:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-primary bg-primary/10">
                <p className="font-bold text-sm">Starter</p>
                <p className="text-lg font-bold">$200.000</p>
                <p className="text-xs text-muted-foreground">
                  Estatutos PDF/DOCX
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="font-bold text-sm">Business</p>
                <p className="text-lg font-bold">$450.000</p>
                <p className="text-xs text-muted-foreground">
                  + Identidad corporativa + Funnels + Marketing básico
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="font-bold text-sm">Premium</p>
                <p className="text-lg font-bold">Personalizado</p>
                <p className="text-xs text-muted-foreground">
                  Todo + Asesoría personalizada
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
