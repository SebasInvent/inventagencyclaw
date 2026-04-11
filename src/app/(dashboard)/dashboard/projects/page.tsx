"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  MessageSquare,
  Loader2,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectWithRelations } from "@/lib/types/database";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Borrador", color: "bg-gray-500/20 text-gray-400" },
  quoted: { label: "Cotizado", color: "bg-yellow-500/20 text-yellow-500" },
  in_progress: { label: "En desarrollo", color: "bg-primary/20 text-primary" },
  review: { label: "En revisión", color: "bg-purple-500/20 text-purple-400" },
  completed: { label: "Completado", color: "bg-green-500/20 text-green-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500/20 text-red-400" },
};

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null);

  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "review" || p.status === "quoted"
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  useEffect(() => {
    if (activeProjects.length > 0 && !selectedProject) {
      setSelectedProject(activeProjects[0]);
    }
  }, [activeProjects, selectedProject]);

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
        title="Mis Proyectos"
        subtitle={`${activeProjects.length} proyectos activos`}
      />

      <div className="p-6">
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No tienes proyectos aún</h2>
            <p className="text-muted-foreground mb-6">
              Agenda una Discovery Call para comenzar tu primer proyecto
            </p>
            <Link href="/book">
              <Button>Agendar Discovery Call</Button>
            </Link>
          </Card>
        ) : (
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
              {activeProjects.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No tienes proyectos activos</p>
                </Card>
              ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Project List */}
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <Card
                        key={project.id}
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50",
                          selectedProject?.id === project.id && "border-primary"
                        )}
                        onClick={() => setSelectedProject(project)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <Badge variant="outline" className="text-xs mt-1">
                                {project.project_type}
                              </Badge>
                            </div>
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
                  {selectedProject && (
                    <div className="lg:col-span-2">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                                <Badge className={statusConfig[selectedProject.status]?.color || ""}>
                                  {statusConfig[selectedProject.status]?.label || selectedProject.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mt-1">
                                {selectedProject.description || "Sin descripción"}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-lg bg-secondary/30">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">Entrega estimada</span>
                              </div>
                              <p className="font-medium">
                                {selectedProject.estimated_end_date
                                  ? new Date(selectedProject.estimated_end_date).toLocaleDateString("es-ES", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Por definir"}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/30">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Users className="h-4 w-4" />
                                <span className="text-sm">Profesional</span>
                              </div>
                              <p className="font-medium">
                                {selectedProject.assigned_professional?.full_name || "Por asignar"}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/30">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-sm">Presupuesto</span>
                              </div>
                              <p className="font-medium">
                                ${selectedProject.final_price?.toLocaleString() || selectedProject.estimated_price_max?.toLocaleString() || "Por definir"}
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
                          {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                            <div>
                              <h3 className="font-medium mb-4">Entregables</h3>
                              <div className="space-y-3">
                                {selectedProject.deliverables.map((deliverable) => (
                                  <div
                                    key={deliverable.id}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-lg",
                                      deliverable.is_completed
                                        ? "bg-green-500/10"
                                        : "bg-secondary/30"
                                    )}
                                  >
                                    {deliverable.is_completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                                    )}
                                    <span
                                      className={cn(
                                        deliverable.is_completed && "text-muted-foreground line-through"
                                      )}
                                    >
                                      {deliverable.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                            <Link href="/dashboard/messages">
                              <Button className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Enviar mensaje
                              </Button>
                            </Link>
                            <Link href="/book">
                              <Button variant="outline" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                Agendar call
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedProjects.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No tienes proyectos completados</p>
                </Card>
              ) : (
                completedProjects.map((project) => (
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
                              {project.updated_at
                                ? `Completado el ${new Date(project.updated_at).toLocaleDateString("es-ES")}`
                                : "Completado"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{project.project_type}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
