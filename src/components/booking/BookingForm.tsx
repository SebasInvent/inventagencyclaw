"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBooking } from "@/lib/hooks/useBooking";
import { User, Mail, Building2, Phone, FileText, Loader2 } from "lucide-react";

interface BookingFormProps {
  selectedSlot: Date;
  onSuccess: (callId: string) => void;
  onBack: () => void;
}

export function BookingForm({ selectedSlot, onSuccess, onBack }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createBooking, loading, error } = useBooking();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Describe brevemente tu proyecto";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await createBooking({
      ...formData,
      scheduledAt: selectedSlot,
    });

    if (result.success && result.callId) {
      onSuccess(result.callId);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">Fecha seleccionada:</p>
            <p className="font-semibold text-primary capitalize">
              {formatDateTime(selectedSlot)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa (opcional)
                </Label>
                <Input
                  id="company"
                  placeholder="Nombre de tu empresa"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono (opcional)
                </Label>
                <Input
                  id="phone"
                  placeholder="+57 300 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Cuéntanos sobre tu proyecto *
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="Describe brevemente qué tipo de solución necesitas, tu industria, y cualquier detalle relevante..."
                rows={4}
                value={formData.projectDescription}
                onChange={(e) => handleChange("projectDescription", e.target.value)}
                className={errors.projectDescription ? "border-red-500" : ""}
              />
              {errors.projectDescription && (
                <p className="text-xs text-red-500">{errors.projectDescription}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                Cambiar horario
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  "Confirmar Discovery Call"
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              La Discovery Call tiene un costo de $500 USD que se descuenta si continúas con el proyecto.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
