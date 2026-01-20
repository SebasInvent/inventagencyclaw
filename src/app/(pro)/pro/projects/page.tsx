"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  MessageSquare,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: "1",
    name: "App de Telemedicina",
    client: { name: "MedCorp", email: "contact@medcorp.com" },
    type: "HealthTech",
    status: "in_progress",
    progress: 65,
    startDate: "2026-01-05",
    dueDate: "2026-02-28",
    budget: 15000,
    team: ["Ana M."],
    unreadMessages: 3,
    priority: "high",
  },
  {
    id: "2",
    name: "Sistema de Pagos",
    client: { name: "PayFast", email: "dev@payfast.io" },
    type: "FinTech",
    status: "in_progress",
    progress: 30,
    startDate: "2026-01-15",
    dueDate: "2026-03-15",
    budget: 25000,
    team: ["Luis G."],
    unreadMessages: 0,
    priority: "medium",
  },
  {
    id: "3",
    name: "E-commerce Platform",
    client: { name: "ShopNow", email: "tech@shopnow.com" },
    type: "E-commerce",
    status: "review",
    progress: 85,
    startDate: "2025-11-01",
    dueDate: "2026-01-25",
    budget: 18000,
    team: ["Carlos R."],
    unreadMessages: 1,
    priority: "high",
  },
  {
    id: "4",
    name: "CRM Enterprise",
    client: { name: "BigCorp", email: "it@bigcorp.com" },
    type: "Enterprise",
    status: "in_progress",
    progress: 45,
    startDate: "2026-01-10",
    dueDate: "2026-04-10",
    budget: 50000,
    team: ["Ana M.", "Luis G."],
    unreadMessages: 0,
    priority: "medium",
  },
  {
    id: "5",
    name: "Dashboard Analytics",
    client: { name: "DataViz", email: "hello@dataviz.co" },
    type: "Analytics",
    status: "completed",
    progress: 100,
    startDate: "2025-10-01",
    dueDate: "2025-12-20",
    budget: 12000,
    team: ["Ana M."],
    unreadMessages: 0,
    priority: "low",
  },
];

const statusConfig = {
  draft: { label: "Borrador", color: "bg-gray-500/20 text-gray-400", icon: Clock },
  quoted: { label: "Cotizado", color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
  in_progress: { label: "En desarrollo", color: "bg-primary/20 text-primary", icon: Clock },
  review: { label: "En revisión", color: "bg-purple-500/20 text-purple-400", icon: AlertCircle },
  completed: { label: "Completado", color: "bg-green-500/20 text-green-500", icon: CheckCircle2 },
};

const priorityConfig = {
  high: { label: "Alta", color: "bg-red-500/20 text-red-400" },
  medium: { label: "Media", color: "bg-yellow-500/20 text-yellow-500" },
  low: { label: "Baja", color: "bg-green-500/20 text-green-500" },
};

export default function ProProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("list");

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="min-h-screen">
      <Header
        title="Gestión de Proyectos"
        subtitle={`${activeProjects.length} proyectos activos`}
        action={{
          label: "Nuevo Proyecto",
          onClick: () => console.log("Nuevo proyecto"),
        }}
      />

      <div className="p-6">
        {/* Filters & View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Activos ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completados ({completedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className={cn(
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                : "space-y-3"
            )}>
              {activeProjects.map((project) => {
                const status = statusConfig[project.status as keyof typeof statusConfig];
                const priority = priorityConfig[project.priority as keyof typeof priorityConfig];

                return (
                  <Card key={project.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className={cn("p-4", view === "list" && "flex items-center gap-6")}>
                      {/* Project Info */}
                      <div className={cn("flex-1", view === "grid" && "mb-4")}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{project.name}</h3>
                              {project.unreadMessages > 0 && (
                                <Badge className="bg-primary h-5 px-1.5">
                                  {project.unreadMessages}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {project.client.name}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Enviar mensaje</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                          <Badge className={cn("text-xs", status.color)}>
                            {status.label}
                          </Badge>
                          <Badge className={cn("text-xs", priority.color)}>
                            {priority.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className={cn(
                        view === "list" ? "w-48" : "mb-4"
                      )}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      {/* Meta */}
                      <div className={cn(
                        "flex items-center gap-4",
                        view === "list" ? "w-64" : "justify-between"
                      )}>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Entrega</p>
                          <p className="font-medium">
                            {new Date(project.dueDate).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-medium">${project.budget.toLocaleString()}</p>
                        </div>
                        <div className="flex -space-x-2">
                          {project.team.map((member, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-background">
                              <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                                {member.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>

                      {/* Actions (list view) */}
                      {view === "list" && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-3">
              {completedProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4 flex items-center gap-6">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.client.name} • Completado el{" "}
                        {new Date(project.dueDate).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${project.budget.toLocaleString()}</p>
                      <Badge variant="outline" className="text-xs">{project.type}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">Ver detalles</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
