"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Proyectos Activos",
    value: "8",
    change: "+2 este mes",
    trend: "up",
    icon: FolderKanban,
  },
  {
    title: "Clientes",
    value: "12",
    change: "+3 este mes",
    trend: "up",
    icon: Users,
  },
  {
    title: "Calls esta semana",
    value: "6",
    change: "2 hoy",
    trend: "neutral",
    icon: Calendar,
  },
  {
    title: "Revenue mensual",
    value: "$45,000",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
  },
];

const activeProjects = [
  {
    id: "1",
    name: "App de Telemedicina",
    client: "MedCorp",
    progress: 65,
    status: "on_track",
    dueDate: "Feb 28",
    team: ["Ana M."],
  },
  {
    id: "2",
    name: "Sistema de Pagos",
    client: "PayFast",
    progress: 30,
    status: "on_track",
    dueDate: "Mar 15",
    team: ["Luis G."],
  },
  {
    id: "3",
    name: "E-commerce Platform",
    client: "ShopNow",
    progress: 85,
    status: "at_risk",
    dueDate: "Jan 25",
    team: ["Carlos R."],
  },
  {
    id: "4",
    name: "CRM Enterprise",
    client: "BigCorp",
    progress: 45,
    status: "on_track",
    dueDate: "Apr 10",
    team: ["Ana M.", "Luis G."],
  },
];

const todayCalls = [
  {
    id: "1",
    title: "Sprint Review",
    client: "MedCorp",
    time: "10:00 AM",
    duration: 60,
  },
  {
    id: "2",
    title: "Discovery Call",
    client: "Nuevo Lead",
    time: "2:00 PM",
    duration: 60,
  },
];

const recentActivity = [
  {
    id: "1",
    type: "message",
    content: "Nuevo mensaje de MedCorp en App de Telemedicina",
    time: "Hace 5 min",
  },
  {
    id: "2",
    type: "payment",
    content: "Pago recibido de PayFast - $5,000",
    time: "Hace 1 hora",
  },
  {
    id: "3",
    type: "project",
    content: "E-commerce Platform alcanzó 85% de progreso",
    time: "Hace 2 horas",
  },
];

const statusConfig = {
  on_track: { label: "En tiempo", color: "text-green-500" },
  at_risk: { label: "En riesgo", color: "text-yellow-500" },
  delayed: { label: "Retrasado", color: "text-red-500" },
};

export default function ProDashboardPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Panel Profesional"
        subtitle="Bienvenido, Tech Lead"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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
                  {activeProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {project.client}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "text-xs flex items-center gap-1",
                              statusConfig[project.status as keyof typeof statusConfig].color
                            )}>
                              {project.status === "on_track" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {statusConfig[project.status as keyof typeof statusConfig].label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              • Entrega: {project.dueDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.team.map((member, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-background -ml-2 first:ml-0">
                              <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                                {member.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
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
                  Calls de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{call.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {call.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">
                          {call.time}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {call.duration} min
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Ver calendario
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm">{activity.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
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
