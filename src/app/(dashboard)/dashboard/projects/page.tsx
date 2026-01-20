"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: "1",
    name: "App de Telemedicina",
    type: "HealthTech",
    description: "Plataforma de consultas médicas virtuales con videollamadas y gestión de citas",
    status: "in_progress",
    progress: 65,
    startDate: "2026-01-05",
    estimatedEnd: "2026-02-28",
    team: ["Ana M.", "Carlos R."],
    unreadMessages: 3,
    nextDeliverable: "Dashboard de pacientes",
    deliverables: [
      { name: "Diseño UI/UX", completed: true },
      { name: "Autenticación", completed: true },
      { name: "Perfil de paciente", completed: true },
      { name: "Dashboard de pacientes", completed: false },
      { name: "Sistema de citas", completed: false },
      { name: "Videollamadas", completed: false },
    ],
  },
  {
    id: "2",
    name: "Sistema de Pagos",
    type: "FinTech",
    description: "Pasarela de pagos con wallet digital y sistema de transferencias",
    status: "in_progress",
    progress: 30,
    startDate: "2026-01-15",
    estimatedEnd: "2026-03-15",
    team: ["Luis G."],
    unreadMessages: 0,
    nextDeliverable: "Wireframes de checkout",
    deliverables: [
      { name: "Análisis de requerimientos", completed: true },
      { name: "Wireframes de checkout", completed: false },
      { name: "Integración Stripe", completed: false },
      { name: "Wallet digital", completed: false },
    ],
  },
  {
    id: "3",
    name: "Dashboard Analytics",
    type: "Analytics",
    description: "Panel de control con métricas en tiempo real y reportes automatizados",
    status: "completed",
    progress: 100,
    startDate: "2025-11-01",
    estimatedEnd: "2025-12-20",
    team: ["Ana M."],
    unreadMessages: 0,
    nextDeliverable: null,
    deliverables: [
      { name: "Diseño", completed: true },
      { name: "Desarrollo frontend", completed: true },
      { name: "Integración APIs", completed: true },
      { name: "Deploy", completed: true },
    ],
  },
];

const statusConfig = {
  draft: { label: "Borrador", color: "bg-gray-500/20 text-gray-400" },
  quoted: { label: "Cotizado", color: "bg-yellow-500/20 text-yellow-500" },
  in_progress: { label: "En desarrollo", color: "bg-primary/20 text-primary" },
  review: { label: "En revisión", color: "bg-purple-500/20 text-purple-400" },
  completed: { label: "Completado", color: "bg-green-500/20 text-green-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500/20 text-red-400" },
};

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const activeProjects = projects.filter((p) => p.status === "in_progress");
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="min-h-screen">
      <Header
        title="Mis Proyectos"
        subtitle={`${activeProjects.length} proyectos activos`}
        action={{
          label: "Nuevo Proyecto",
          onClick: () => console.log("Nuevo proyecto"),
        }}
      />

      <div className="p-6">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Clock className="h-4 w-4" />
              Activos ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completados ({completedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Project List */}
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <Card
                    key={project.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedProject.id === project.id && "border-primary"
                    )}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {project.type}
                          </Badge>
                        </div>
                        {project.unreadMessages > 0 && (
                          <Badge className="bg-primary">{project.unreadMessages}</Badge>
                        )}
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Project Detail */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                          <Badge className={statusConfig[selectedProject.status as keyof typeof statusConfig].color}>
                            {statusConfig[selectedProject.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {selectedProject.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        Ver detalles <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Entrega estimada</span>
                        </div>
                        <p className="font-medium">
                          {new Date(selectedProject.estimatedEnd).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Equipo</span>
                        </div>
                        <p className="font-medium">{selectedProject.team.join(", ")}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">Mensajes</span>
                        </div>
                        <p className="font-medium">
                          {selectedProject.unreadMessages > 0
                            ? `${selectedProject.unreadMessages} sin leer`
                            : "Al día"}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Progreso general</span>
                        <span className="text-primary font-bold">{selectedProject.progress}%</span>
                      </div>
                      <Progress value={selectedProject.progress} className="h-3" />
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h3 className="font-medium mb-4">Entregables</h3>
                      <div className="space-y-3">
                        {selectedProject.deliverables.map((deliverable, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg",
                              deliverable.completed
                                ? "bg-green-500/10"
                                : "bg-secondary/30"
                            )}
                          >
                            {deliverable.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                            )}
                            <span
                              className={cn(
                                deliverable.completed && "text-muted-foreground line-through"
                              )}
                            >
                              {deliverable.name}
                            </span>
                            {selectedProject.nextDeliverable === deliverable.name && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                En progreso
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                      <Button className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Enviar mensaje
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Agendar call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completado el{" "}
                          {new Date(project.estimatedEnd).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{project.type}</Badge>
                      <Button variant="ghost" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
