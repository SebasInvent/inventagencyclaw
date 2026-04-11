"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSuccess } from "@/components/booking/BookingSuccess";

type BookingStep = "calendar" | "form" | "success";

export default function BookPage() {
  const [step, setStep] = useState<BookingStep>("calendar");
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [bookedEmail] = useState("");

  const handleSlotSelect = (date: Date) => {
    setSelectedSlot(date);
  };

  const handleContinue = () => {
    if (selectedSlot) {
      setStep("form");
    }
  };

  const handleSuccess = () => {
    setStep("success");
  };

  const handleBack = () => {
    setStep("calendar");
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
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4">
              Discovery Call
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Agenda tu <span className="text-primary">Discovery Call</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              60 minutos para entender tu proyecto, definir alcance y darte una cotización precisa.
            </p>
          </div>

          {/* What's included */}
          {step === "calendar" && (
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Videollamada</p>
                  <p className="text-xs text-muted-foreground">Google Meet o Zoom</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">60 minutos</p>
                  <p className="text-xs text-muted-foreground">Sesión completa</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">$500 USD</p>
                  <p className="text-xs text-muted-foreground">Descontable del proyecto</p>
                </div>
              </div>
            </div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BookingCalendar
                  onSlotSelect={handleSlotSelect}
                  selectedSlot={selectedSlot}
                />

                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mt-8"
                  >
                    <Button size="lg" onClick={handleContinue} className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Continuar con{" "}
                      {selectedSlot.toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      a las{" "}
                      {selectedSlot.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === "form" && selectedSlot && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BookingForm
                  selectedSlot={selectedSlot}
                  onSuccess={(callId) => {
                    console.log("Call created:", callId);
                    handleSuccess();
                  }}
                  onBack={handleBack}
                />
              </motion.div>
            )}

            {step === "success" && selectedSlot && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BookingSuccess
                  selectedSlot={selectedSlot}
                  email={bookedEmail || "tu email"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            ¿Preguntas? Escríbenos a{" "}
            <a href="mailto:hello@inventagency.co" className="text-primary hover:underline">
              hello@inventagency.co
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
