"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">invent</span>
            <span className="text-sm text-primary leading-none">agency</span>
          </div>
        </Link>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verifica tu email</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace de verificación
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Revisa tu bandeja de entrada y haz clic en el enlace para activar
              tu cuenta. Si no lo encuentras, revisa la carpeta de spam.
            </p>

            <Link href="/login">
              <Button className="gap-2">
                Ir a Iniciar Sesión
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground">
              ¿No recibiste el email?{" "}
              <button className="text-primary hover:underline">
                Reenviar
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
