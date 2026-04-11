"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Smartphone, Globe, Code, Brain, Link as LinkIcon, Shield, 
  BarChart3, ShoppingCart, Building2, Sparkles, ArrowRight, 
  ArrowLeft, Check, Zap, Calendar, TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type ProjectType = "mobile" | "web" | "api" | "ai" | "blockchain" | "biometrics" | "analytics" | "ecommerce" | "enterprise" | "other";
type Complexity = "basic" | "intermediate" | "advanced";
type Timeline = "express" | "standard" | "flexible";

interface QuoteData {
  projectType: ProjectType | null;
  complexity: Complexity | null;
  timeline: Timeline | null;
  email?: string;
}

const projectTypes = [
  { value: "mobile" as ProjectType, label: "Aplicación Móvil", icon: Smartphone, description: "iOS, Android o Cross-platform" },
  { value: "web" as ProjectType, label: "Aplicación Web", icon: Globe, description: "Web apps, SaaS, Portales" },
  { value: "api" as ProjectType, label: "API / Backend", icon: Code, description: "REST, GraphQL, Microservicios" },
  { value: "ai" as ProjectType, label: "Inteligencia Artificial", icon: Brain, description: "ML, NLP, Computer Vision" },
  { value: "blockchain" as ProjectType, label: "Blockchain / Web3", icon: LinkIcon, description: "Smart Contracts, DApps" },
  { value: "biometrics" as ProjectType, label: "Biometría / Seguridad", icon: Shield, description: "Facial, Fingerprint, KYC" },
  { value: "analytics" as ProjectType, label: "Dashboard / Analytics", icon: BarChart3, description: "BI, Reportes, Métricas" },
  { value: "ecommerce" as ProjectType, label: "E-commerce", icon: ShoppingCart, description: "Tiendas online, Marketplaces" },
  { value: "enterprise" as ProjectType, label: "Sistema Empresarial", icon: Building2, description: "ERP, CRM, Gestión" },
];

const complexityLevels = [
  { 
    value: "basic" as Complexity, 
    label: "Básico", 
    features: "5-10 features",
    description: "Login, CRUD, Dashboard básico",
    multiplier: 1
  },
  { 
    value: "intermediate" as Complexity, 
    label: "Intermedio", 
    features: "10-20 features",
    description: "+ Pagos, Notificaciones, Reportes",
    multiplier: 1.8
  },
  { 
    value: "advanced" as Complexity, 
    label: "Avanzado", 
    features: "20+ features",
    description: "+ IA, Integraciones múltiples, Real-time",
    multiplier: 2.5
  },
];

const timelines = [
  { 
    value: "express" as Timeline, 
    label: "Express", 
    duration: "4 semanas",
    icon: Zap,
    priceAdjustment: 1.3,
    description: "Entrega rápida"
  },
  { 
    value: "standard" as Timeline, 
    label: "Estándar", 
    duration: "8 semanas",
    icon: Calendar,
    priceAdjustment: 1,
    description: "Tiempo óptimo"
  },
  { 
    value: "flexible" as Timeline, 
    label: "Flexible", 
    duration: "12+ semanas",
    icon: TrendingDown,
    priceAdjustment: 0.9,
    description: "Ahorra 10%"
  },
];

// Precios base por tipo de proyecto
const basePrices: Record<ProjectType, number> = {
  mobile: 10000,
  web: 8000,
  api: 6000,
  ai: 15000,
  blockchain: 20000,
  biometrics: 18000,
  analytics: 7000,
  ecommerce: 12000,
  enterprise: 25000,
  other: 8000,
};

export default function QuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    projectType: null,
    complexity: null,
    timeline: null,
  });
  const [loading, setLoading] = useState(false);

  const calculatePrice = () => {
    if (!quoteData.projectType || !quoteData.complexity || !quoteData.timeline) {
      return { min: 0, max: 0 };
    }

    const basePrice = basePrices[quoteData.projectType];
    const complexityMultiplier = complexityLevels.find(c => c.value === quoteData.complexity)?.multiplier || 1;
    const timelineMultiplier = timelines.find(t => t.value === quoteData.timeline)?.priceAdjustment || 1;

    const estimatedPrice = basePrice * complexityMultiplier * timelineMultiplier;
    const min = Math.round(estimatedPrice * 0.85);
    const max = Math.round(estimatedPrice * 1.15);

    return { min, max };
  };

  const handleSaveQuote = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { min, max } = calculatePrice();

      await supabase.from("quotations").insert({
        project_type: quoteData.projectType,
        complexity: quoteData.complexity,
        timeline: quoteData.timeline,
        estimated_min: min,
        estimated_max: max,
        email: quoteData.email,
      });

      router.push("/book");
    } catch (error) {
      console.error("Error saving quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return quoteData.projectType !== null;
      case 2:
        return quoteData.complexity !== null;
      case 3:
        return quoteData.timeline !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">invent</span>
              <span className="text-xs text-primary leading-none">agency</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    s < step
                      ? "bg-primary text-primary-foreground"
                      : s === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tipo</span>
            <span>Complejidad</span>
            <span>Timeline</span>
            <span>Resumen</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">¿Qué tipo de solución necesitas?</h1>
                <p className="text-muted-foreground">Selecciona la opción que mejor describa tu proyecto</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      quoteData.projectType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border/50"
                    }`}
                    onClick={() => setQuoteData({ ...quoteData, projectType: type.value })}
                  >
                    <CardContent className="p-6">
                      <type.icon className="w-8 h-8 mb-3 text-primary" />
                      <h3 className="font-bold mb-1">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Complexity */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">¿Cuántas funcionalidades necesitas?</h1>
                <p className="text-muted-foreground">Define la complejidad de tu proyecto</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {complexityLevels.map((level) => (
                  <Card
                    key={level.value}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      quoteData.complexity === level.value
                        ? "border-primary bg-primary/5"
                        : "border-border/50"
                    }`}
                    onClick={() => setQuoteData({ ...quoteData, complexity: level.value })}
                  >
                    <CardContent className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2">{level.label}</h3>
                      <p className="text-primary font-semibold mb-3">{level.features}</p>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Timeline */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">¿Cuál es tu timeline ideal?</h1>
                <p className="text-muted-foreground">Selecciona el tiempo de entrega</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {timelines.map((timeline) => (
                  <Card
                    key={timeline.value}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      quoteData.timeline === timeline.value
                        ? "border-primary bg-primary/5"
                        : "border-border/50"
                    }`}
                    onClick={() => setQuoteData({ ...quoteData, timeline: timeline.value })}
                  >
                    <CardContent className="p-6 text-center">
                      <timeline.icon className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h3 className="text-2xl font-bold mb-1">{timeline.label}</h3>
                      <p className="text-primary font-semibold mb-2">{timeline.duration}</p>
                      <p className="text-sm text-muted-foreground">{timeline.description}</p>
                      {timeline.priceAdjustment !== 1 && (
                        <p className="text-xs text-primary mt-2">
                          {timeline.priceAdjustment > 1 ? `+${((timeline.priceAdjustment - 1) * 100).toFixed(0)}%` : `-${((1 - timeline.priceAdjustment) * 100).toFixed(0)}%`}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Estimación de tu proyecto</h1>
                <p className="text-muted-foreground">Basado en tus selecciones</p>
              </div>

              <Card className="border-primary/50">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <p className="text-sm text-muted-foreground mb-2">Rango estimado</p>
                    <p className="text-5xl font-bold text-primary mb-2">
                      ${calculatePrice().min.toLocaleString()} - ${calculatePrice().max.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">USD</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Tipo de proyecto</span>
                      <span className="text-sm">
                        {projectTypes.find(t => t.value === quoteData.projectType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Complejidad</span>
                      <span className="text-sm">
                        {complexityLevels.find(c => c.value === quoteData.complexity)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Timeline</span>
                      <span className="text-sm">
                        {timelines.find(t => t.value === quoteData.timeline)?.label} ({timelines.find(t => t.value === quoteData.timeline)?.duration})
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                    <h3 className="font-bold mb-2">Próximo paso: Discovery Call</h3>
                    <p className="text-sm text-muted-foreground">
                      Agenda una llamada de 60 minutos con nuestro equipo para refinar los detalles y crear un roadmap personalizado.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSaveQuote} 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Agendar Discovery Call"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          {step < 4 && (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="gap-2"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
