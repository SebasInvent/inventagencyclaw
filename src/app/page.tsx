"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Globe,
  Server,
  Brain,
  Link2,
  Shield,
  BarChart3,
  ShoppingCart,
  Building2,
  Target,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const projectTypes = [
  { id: "mobile", icon: Smartphone, label: "App Móvil", desc: "iOS & Android" },
  { id: "web", icon: Globe, label: "App Web", desc: "SaaS & Plataformas" },
  { id: "api", icon: Server, label: "API / Backend", desc: "Microservicios" },
  { id: "ai", icon: Brain, label: "Inteligencia Artificial", desc: "ML & LLMs" },
  { id: "blockchain", icon: Link2, label: "Blockchain", desc: "Web3 & Smart Contracts" },
  { id: "biometrics", icon: Shield, label: "Biometría", desc: "Face ID & Verificación" },
  { id: "analytics", icon: BarChart3, label: "Dashboard", desc: "Analytics & BI" },
  { id: "ecommerce", icon: ShoppingCart, label: "E-commerce", desc: "Tiendas Online" },
  { id: "enterprise", icon: Building2, label: "Sistema Empresarial", desc: "ERP & CRM" },
  { id: "other", icon: Target, label: "Otro", desc: "Cuéntanos más" },
];

const complexityLevels = [
  {
    id: "basic",
    label: "Básico",
    features: "5-10 features",
    examples: "Login, CRUD, Dashboard básico",
    priceRange: "$5,000 - $10,000",
    weeks: "4-6 semanas",
  },
  {
    id: "intermediate",
    label: "Intermedio",
    features: "10-20 features",
    examples: "+ Pagos, Notificaciones, Reportes",
    priceRange: "$10,000 - $25,000",
    weeks: "6-10 semanas",
  },
  {
    id: "advanced",
    label: "Avanzado",
    features: "20+ features",
    examples: "+ IA, Integraciones múltiples, Real-time",
    priceRange: "$25,000 - $50,000+",
    weeks: "10-16 semanas",
  },
];

const timelineOptions = [
  { id: "express", label: "Express", weeks: "4 semanas", modifier: "+30%", icon: Zap },
  { id: "standard", label: "Estándar", weeks: "8 semanas", modifier: "Precio base", icon: CheckCircle2 },
  { id: "flexible", label: "Flexible", weeks: "12+ semanas", modifier: "-10%", icon: Clock },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);

  const getEstimate = () => {
    if (!selectedComplexity || !selectedTimeline) return null;
    const complexity = complexityLevels.find((c) => c.id === selectedComplexity);
    return complexity?.priceRange;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">invent</span>
              <span className="text-xs text-primary leading-none">agency</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Button size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Agendar Call
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6">
            Development on Demand
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transforma tu idea en{" "}
            <span className="gradient-text">realidad digital</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cotiza tu proyecto en minutos, visualiza prototipos con IA, y trabaja
            con un equipo de élite en desarrollo de software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" onClick={() => setStep(1)}>
              Cotizar Proyecto
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Ver Prototipo con IA
            </Button>
          </div>
        </div>
      </section>

      {/* Quoter Section */}
      <AnimatePresence mode="wait">
        {step > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-20 px-6"
          >
            <div className="max-w-5xl mx-auto">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-12">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-2 w-16 rounded-full transition-colors",
                      step >= s ? "bg-primary" : "bg-secondary"
                    )}
                  />
                ))}
              </div>

              {/* Step 1: Project Type */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold text-center mb-2">
                    ¿Qué tipo de solución necesitas?
                  </h2>
                  <p className="text-muted-foreground text-center mb-8">
                    Selecciona el tipo de proyecto que mejor describe tu idea
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {projectTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50",
                          selectedType === type.id && "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <type.icon
                            className={cn(
                              "h-8 w-8 mx-auto mb-2",
                              selectedType === type.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <p className="font-medium text-sm">{type.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {type.desc}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-center mt-8">
                    <Button
                      size="lg"
                      disabled={!selectedType}
                      onClick={() => setStep(2)}
                      className="gap-2"
                    >
                      Continuar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Complexity */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold text-center mb-2">
                    ¿Cuántas funcionalidades necesitas?
                  </h2>
                  <p className="text-muted-foreground text-center mb-8">
                    Esto nos ayuda a estimar el alcance del proyecto
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {complexityLevels.map((level) => (
                      <Card
                        key={level.id}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50",
                          selectedComplexity === level.id &&
                            "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedComplexity(level.id)}
                      >
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-1">{level.label}</h3>
                          <Badge variant="secondary" className="mb-4">
                            {level.features}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-4">
                            {level.examples}
                          </p>
                          <div className="pt-4 border-t border-border">
                            <p className="text-2xl font-bold text-primary">
                              {level.priceRange}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {level.weeks}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Atrás
                    </Button>
                    <Button
                      size="lg"
                      disabled={!selectedComplexity}
                      onClick={() => setStep(3)}
                      className="gap-2"
                    >
                      Continuar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Timeline */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold text-center mb-2">
                    ¿Cuál es tu timeline ideal?
                  </h2>
                  <p className="text-muted-foreground text-center mb-8">
                    El tiempo de entrega afecta el precio final
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {timelineOptions.map((option) => (
                      <Card
                        key={option.id}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50",
                          selectedTimeline === option.id &&
                            "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedTimeline(option.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <option.icon
                            className={cn(
                              "h-10 w-10 mx-auto mb-3",
                              selectedTimeline === option.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <h3 className="text-lg font-bold">{option.label}</h3>
                          <p className="text-2xl font-bold text-primary my-2">
                            {option.weeks}
                          </p>
                          <Badge
                            variant={
                              option.id === "express"
                                ? "destructive"
                                : option.id === "flexible"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {option.modifier}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Atrás
                    </Button>
                    <Button
                      size="lg"
                      disabled={!selectedTimeline}
                      onClick={() => setStep(4)}
                      className="gap-2"
                    >
                      Ver Estimación
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Result */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-2xl mx-auto"
                >
                  <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        Tu Estimación Preliminar
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Basado en tus selecciones, este es el rango estimado
                      </p>
                      <p className="text-5xl font-bold text-primary mb-2">
                        {getEstimate()}
                      </p>
                      <p className="text-muted-foreground mb-8">
                        *Precio final después de Discovery Call
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          Agendar Discovery Call
                        </Button>
                        <Button size="lg" variant="outline" className="gap-2">
                          <Sparkles className="h-4 w-4" />
                          Ver Prototipo con IA
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-6">
                        La Discovery Call de 60 min tiene un costo de $500 USD
                        <br />
                        (se descuenta si continúas con el proyecto)
                      </p>
                    </CardContent>
                  </Card>
                  <div className="flex justify-center mt-6">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      Empezar de nuevo
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      {step === 0 && (
        <section className="py-20 px-6 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué <span className="text-primary">Invent Agency</span>?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Prototipos con IA</h3>
                  <p className="text-muted-foreground">
                    Visualiza tu proyecto antes de desarrollarlo con nuestra
                    tecnología de generación de prototipos.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Equipo de Élite</h3>
                  <p className="text-muted-foreground">
                    Especialistas en Biometría, Blockchain, IA, FinTech y
                    HealthTech con proyectos en producción.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Entrega Garantizada</h3>
                  <p className="text-muted-foreground">
                    Metodología ágil con sprints semanales, demos constantes y
                    comunicación transparente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              © 2026 Invent Agency. Development on Demand.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Términos
            </Link>
            <Link href="https://inventagency.co" className="hover:text-primary">
              inventagency.co
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
