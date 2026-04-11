"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BookingSuccessProps {
  selectedSlot: Date;
  email: string;
}

export function BookingSuccess({ selectedSlot, email }: BookingSuccessProps) {
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">¡Call Agendada!</h2>
          <p className="text-muted-foreground mb-6">
            Tu Discovery Call ha sido confirmada
          </p>

          <div className="bg-background/50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3 text-left">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha y hora</p>
                <p className="font-medium capitalize">{formatDateTime(selectedSlot)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Confirmación enviada a</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Recibirás un email con el link de la videollamada y los detalles de la reunión.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  Crear cuenta
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto gap-2">
                  Volver al inicio
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center mt-6">
        ¿Necesitas cambiar la fecha? Contáctanos en{" "}
        <a href="mailto:hello@inventagency.co" className="text-primary hover:underline">
          hello@inventagency.co
        </a>
      </p>
    </motion.div>
  );
}
