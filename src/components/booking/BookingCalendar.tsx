"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBooking } from "@/lib/hooks/useBooking";
import { Clock, CheckCircle2, Loader2 } from "lucide-react";

interface BookingCalendarProps {
  onSlotSelect: (date: Date) => void;
  selectedSlot: Date | null;
}

interface Slot {
  date: Date;
  time: string;
  available: boolean;
}

export function BookingCalendar({ onSlotSelect, selectedSlot }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { getAvailableSlots } = useBooking();

  // Fecha mínima: mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Fecha máxima: 30 días
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      getAvailableSlots(selectedDate).then((availableSlots) => {
        setSlots(availableSlots);
        setLoadingSlots(false);
      });
    }
  }, [selectedDate, getAvailableSlots]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSlots([]);
  };

  const handleSlotClick = (slot: Slot) => {
    if (slot.available) {
      onSlotSelect(slot.date);
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Selecciona una fecha
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < tomorrow || date > maxDate || isWeekend(date)}
            className="rounded-md border"
          />
          <p className="text-xs text-muted-foreground mt-3">
            Disponible de Lunes a Viernes, próximos 30 días
          </p>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Horarios disponibles
          </h3>

          <AnimatePresence mode="wait">
            {!selectedDate ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground"
              >
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Selecciona una fecha para ver horarios</p>
              </motion.div>
            ) : loadingSlots ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground mt-2">Cargando horarios...</p>
              </motion.div>
            ) : slots.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground"
              >
                <p>No hay horarios disponibles para esta fecha</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-2"
              >
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.getTime() === slot.date.getTime();
                  return (
                    <Button
                      key={slot.time}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "h-12 relative",
                        !slot.available && "opacity-50 cursor-not-allowed",
                        isSelected && "ring-2 ring-primary ring-offset-2"
                      )}
                      disabled={!slot.available}
                      onClick={() => handleSlotClick(slot)}
                    >
                      {formatTime(slot.time)}
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 absolute right-2" />
                      )}
                      {!slot.available && (
                        <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px]">
                          Ocupado
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {selectedDate && slots.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Zona horaria: América/Bogotá (UTC-5)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
