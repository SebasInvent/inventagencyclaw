"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCalls } from "@/lib/hooks/useCalls";
import { useProjects } from "@/lib/hooks/useProjects";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  FolderKanban,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Video,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "text-gray-500" },
  quoted: { label: "Cotizado", color: "text-blue-500" },
  in_progress: { label: "En progreso", color: "text-green-500" },
  review: { label: "En revisión", color: "text-yellow-500" },
  completed: { label: "Completado", color: "text-green-600" },
  cancelled: { label: "Cancelado", color: "text-red-500" },
  on_track: { label: "En tiempo", color: "text-green-500" },
  at_risk: { label: "En riesgo", color: "text-yellow-500" },
  delayed: { label: "Retrasado", color: "text-red-500" },
};

export default function ProDashboardPage() {
  const { upcomingCalls, calls, loading: callsLoading } = useCalls();
  const { projects, loading: projectsLoading } = useProjects();

  const today = new Date().toDateString();
  const todayCalls = upcomingCalls.filter(
    (call) => new Date(call.scheduled_at).toDateString() === today
  );

  const totalCalls = calls.length;
  const activeProjects = projects.filter((p) =>
    ["draft", "quoted", "in_progress", "review"].includes(p.status)
  ).length;

  if (callsLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Panel Profesional"
        subtitle="Bienvenido, Tech Lead"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{
            title: "Proyectos Activos",
            value: activeProjects.toString(),
            change: `${projects.length} total`,
            trend: "up",
            icon: FolderKanban,
          },
          {
            title: "Discovery Calls",
            value: totalCalls.toString(),
            change: `${todayCalls.length} hoy`,
            trend: "up",
            icon: Users,
          },
          {
            title: "Calls Pendientes",
            value: upcomingCalls.length.toString(),
            change: "Próximas",
            trend: "neutral",
            icon: Calendar,
          },
          {
            title: "Revenue Estimado",
            value: "$45,000",
            change: "Mensual",
            trend: "up",
            icon: DollarSign,
          },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={cn(
                      "text-xs mt-1 flex items-center gap-1",
                      stat.trend === "up" ? "text-green-500" : "text-muted-foreground"
                    )}>
                      {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Proyectos Activos</CardTitle>
                  <CardDescription>Estado de todos los proyectos</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {project.client?.company || project.client?.full_name || "Sin cliente"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "text-xs flex items-center gap-1",
                              statusConfig[project.status]?.color || "text-gray-500"
                            )}>
                              {project.status === "in_progress" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {statusConfig[project.status]?.label || project.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              • Inicio: {project.start_date ? format(new Date(project.start_date), "dd MMM", { locale: es }) : "Sin fecha"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-12 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Today's Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Calls de Hoy ({todayCalls.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayCalls.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay calls programadas para hoy
                  </p>
                ) : (
                  todayCalls.map((call) => (
                    <div
                      key={call.id}
                      className="p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Discovery Call</p>
                          <p className="text-xs text-muted-foreground">
                            {call.client?.full_name || call.client?.email || "Cliente"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">
                            {format(new Date(call.scheduled_at), "HH:mm", { locale: es })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {call.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" asChild>
                  <a href="/pro/calls">Ver calendario</a>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Próximas Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingCalls.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay calls próximas
                  </p>
                ) : (
                  upcomingCalls.slice(0, 5).map((call) => (
                    <div
                      key={call.id}
                      className="flex items-start gap-3 p-2"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm font-medium">
                          {call.client?.full_name || call.client?.email || "Cliente"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(call.scheduled_at), "dd MMM 'a las' HH:mm", { locale: es })}
                        </p>
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
