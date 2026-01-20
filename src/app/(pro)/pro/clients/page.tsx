"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Search,
  Mail,
  Phone,
  Building2,
  FolderKanban,
  DollarSign,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clients = [
  {
    id: "1",
    name: "MedCorp",
    contact: "Dr. Juan García",
    email: "contact@medcorp.com",
    phone: "+57 300 123 4567",
    activeProjects: 1,
    totalSpent: 15000,
    status: "active",
    lastActivity: "Hace 2 horas",
  },
  {
    id: "2",
    name: "PayFast",
    contact: "María López",
    email: "dev@payfast.io",
    phone: "+57 310 987 6543",
    activeProjects: 1,
    totalSpent: 25000,
    status: "active",
    lastActivity: "Hace 1 día",
  },
  {
    id: "3",
    name: "ShopNow",
    contact: "Carlos Rodríguez",
    email: "tech@shopnow.com",
    phone: "+57 320 456 7890",
    activeProjects: 1,
    totalSpent: 18000,
    status: "active",
    lastActivity: "Hace 3 horas",
  },
  {
    id: "4",
    name: "BigCorp",
    contact: "Ana Martínez",
    email: "it@bigcorp.com",
    phone: "+57 315 111 2222",
    activeProjects: 1,
    totalSpent: 50000,
    status: "active",
    lastActivity: "Hace 5 horas",
  },
  {
    id: "5",
    name: "DataViz",
    contact: "Pedro Sánchez",
    email: "hello@dataviz.co",
    phone: "+57 318 333 4444",
    activeProjects: 0,
    totalSpent: 12000,
    status: "inactive",
    lastActivity: "Hace 1 mes",
  },
];

export default function ProClientsPage() {
  const activeClients = clients.filter((c) => c.status === "active");
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Clientes"
        subtitle={`${activeClients.length} clientes activos`}
        action={{
          label: "Nuevo Cliente",
          onClick: () => console.log("Nuevo cliente"),
        }}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clientes</p>
                  <p className="text-3xl font-bold">{clients.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Proyectos Activos</p>
                  <p className="text-3xl font-bold">
                    {clients.reduce((sum, c) => sum + c.activeProjects, 0)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Total</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente..." className="pl-9" />
        </div>

        {/* Clients List */}
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-6">
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary font-medium">
                        {client.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{client.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            client.status === "active"
                              ? "border-green-500/50 text-green-500"
                              : "border-gray-500/50 text-gray-500"
                          }
                        >
                          {client.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{client.contact}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold">{client.activeProjects}</p>
                      <p className="text-xs text-muted-foreground">Proyectos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">${(client.totalSpent / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem>Ver proyectos</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Enviar email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
