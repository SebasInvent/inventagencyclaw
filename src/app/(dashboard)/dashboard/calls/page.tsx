"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Video,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  ExternalLink,
  Play,
} from "lucide-react";

const upcomingCalls = [
  {
    id: "1",
    title: "Sprint Review",
    project: "App de Telemedicina",
    date: "2026-01-21",
    time: "10:00 AM",
    duration: 60,
    professional: "Ana M.",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Discovery Call",
    project: "Nuevo proyecto",
    date: "2026-01-24",
    time: "3:00 PM",
    duration: 60,
    professional: "Carlos R.",
    meetingUrl: "https://meet.google.com/xyz-uvwx-yz",
    status: "scheduled",
  },
];

const pastCalls = [
  {
    id: "3",
    title: "Kickoff Meeting",
    project: "App de Telemedicina",
    date: "2026-01-05",
    time: "11:00 AM",
    duration: 90,
    professional: "Ana M.",
    status: "completed",
    recordingUrl: "https://example.com/recording/1",
    notes: "Se definieron los requerimientos principales y el timeline del proyecto.",
  },
  {
    id: "4",
    title: "Discovery Call",
    project: "Sistema de Pagos",
    date: "2026-01-10",
    time: "2:00 PM",
    duration: 60,
    professional: "Luis G.",
    status: "completed",
    recordingUrl: "https://example.com/recording/2",
    notes: "Se revisaron las integraciones necesarias con Stripe.",
  },
];


export default function CallsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen">
      <Header
        title="Calls"
        subtitle="Gestiona tus reuniones con el equipo"
        action={{
          label: "Agendar Call",
          onClick: () => console.log("Agendar call"),
        }}
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Calendario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Upcoming Calls */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Calls</CardTitle>
                <CardDescription>
                  Tus reuniones programadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingCalls.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tienes calls programadas
                  </div>
                ) : (
                  upcomingCalls.map((call) => (
                    <div
                      key={call.id}
                      className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Video className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{call.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {call.project}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {new Date(call.date).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {call.time} ({call.duration} min)
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Con {call.professional}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reagendar
                          </Button>
                          <Button size="sm" className="gap-1" asChild>
                            <a href={call.meetingUrl} target="_blank" rel="noopener noreferrer">
                              Unirse <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Past Calls */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Calls</CardTitle>
                <CardDescription>
                  Calls anteriores con grabaciones y notas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-4 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{call.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {call.project}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>
                              {new Date(call.date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span>{call.time}</span>
                            <span>Con {call.professional}</span>
                          </div>
                          {call.notes && (
                            <p className="text-sm text-muted-foreground mt-2 p-2 bg-background/50 rounded">
                              {call.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {call.recordingUrl && (
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Play className="h-4 w-4" />
                          Ver grabación
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
