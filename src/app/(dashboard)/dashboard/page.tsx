"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Proyectos Activos",
    value: "2",
    icon: FolderKanban,
    change: "+1 este mes",
  },
  {
    title: "Horas Invertidas",
    value: "124",
    icon: Clock,
    change: "Este sprint",
  },
  {
    title: "Entregables Listos",
    value: "8",
    icon: CheckCircle2,
    change: "De 12 totales",
  },
  {
    title: "Mensajes",
    value: "5",
    icon: MessageSquare,
    change: "Sin leer",
  },
];

const activeProjects = [
  {
    id: 1,
    name: "App de Telemedicina",
    type: "HealthTech",
    progress: 65,
    status: "En desarrollo",
    nextDeliverable: "Dashboard de pacientes",
    dueDate: "Feb 15, 2026",
  },
  {
    id: 2,
    name: "Sistema de Pagos",
    type: "FinTech",
    progress: 30,
    status: "En diseño",
    nextDeliverable: "Wireframes de checkout",
    dueDate: "Feb 28, 2026",
  },
];

const upcomingCalls = [
  {
    id: 1,
    title: "Sprint Review",
    project: "App de Telemedicina",
    date: "Mañana",
    time: "10:00 AM",
  },
  {
    id: 2,
    title: "Discovery Call",
    project: "Nuevo proyecto",
    date: "Viernes",
    time: "3:00 PM",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Bienvenido de vuelta"
        action={{
          label: "Nuevo Proyecto",
          onClick: () => console.log("Nuevo proyecto"),
        }}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Proyectos Activos</CardTitle>
                  <CardDescription>Tus proyectos en desarrollo</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Próximo: {project.nextDeliverable}
                        </p>
                      </div>
                      <Badge
                        className={
                          project.status === "En desarrollo"
                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                            : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Entrega estimada: {project.dueDate}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Calls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Próximas Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{call.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {call.project}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">
                          {call.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {call.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  Agendar nueva call
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">IA Studio</h3>
                    <p className="text-xs text-muted-foreground">
                      Genera prototipos con IA
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualiza tu próximo proyecto antes de desarrollarlo
                </p>
                <Button className="w-full">Crear Prototipo</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
