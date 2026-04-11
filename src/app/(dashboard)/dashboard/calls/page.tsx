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
  Loader2,
} from "lucide-react";
import { useCalls } from "@/lib/hooks/useCalls";
import Link from "next/link";

export default function CallsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { upcomingCalls, pastCalls, loading } = useCalls();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Calls"
        subtitle="Gestiona tus reuniones con el equipo"
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
              <Link href="/book" className="block mt-4">
                <Button className="w-full">Agendar Nueva Call</Button>
              </Link>
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
                    <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No tienes calls programadas</p>
                    <Link href="/book">
                      <Button variant="outline" className="mt-4">
                        Agendar Discovery Call
                      </Button>
                    </Link>
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
                              <h3 className="font-medium">
                                {call.project?.name || "Discovery Call"}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {call.duration_minutes} min
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {new Date(call.scheduled_at).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(call.scheduled_at).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {call.professional && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Con {call.professional.full_name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {call.meeting_url && (
                            <Button size="sm" className="gap-1" asChild>
                              <a href={call.meeting_url} target="_blank" rel="noopener noreferrer">
                                Unirse <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
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
                {pastCalls.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tienes calls anteriores</p>
                  </div>
                ) : (
                  pastCalls.map((call) => (
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
                              <h3 className="font-medium">
                                {call.project?.name || "Discovery Call"}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {call.status === "completed" ? "Completada" : "Cancelada"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>
                                {new Date(call.scheduled_at).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              {call.professional && (
                                <span>Con {call.professional.full_name}</span>
                              )}
                            </div>
                            {call.notes && (
                              <p className="text-sm text-muted-foreground mt-2 p-2 bg-background/50 rounded">
                                {call.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        {call.recording_url && (
                          <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <a href={call.recording_url} target="_blank" rel="noopener noreferrer">
                              <Play className="h-4 w-4" />
                              Ver grabación
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
