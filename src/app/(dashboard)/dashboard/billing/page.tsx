"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const invoices = [
  {
    id: "INV-2026-001",
    project: "App de Telemedicina",
    amount: 4000,
    status: "paid",
    issuedAt: "2026-01-05",
    paidAt: "2026-01-07",
    description: "Pago inicial - 50%",
  },
  {
    id: "INV-2026-002",
    project: "Sistema de Pagos",
    amount: 5000,
    status: "pending",
    issuedAt: "2026-01-15",
    dueDate: "2026-01-30",
    description: "Pago inicial - 50%",
  },
  {
    id: "INV-2025-015",
    project: "Dashboard Analytics",
    amount: 7500,
    status: "paid",
    issuedAt: "2025-12-01",
    paidAt: "2025-12-03",
    description: "Pago final - 50%",
  },
];

const paymentMethods = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiry: "12/27",
    isDefault: true,
  },
];

const statusConfig = {
  paid: { label: "Pagado", icon: CheckCircle2, color: "text-green-500 bg-green-500/10" },
  pending: { label: "Pendiente", icon: Clock, color: "text-yellow-500 bg-yellow-500/10" },
  overdue: { label: "Vencido", icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
};

export default function BillingPage() {
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen">
      <Header title="Facturación" subtitle="Gestiona tus pagos y facturas" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pagado</p>
                  <p className="text-3xl font-bold text-green-500">
                    ${totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendiente</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    ${totalPending.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Facturas</p>
                  <p className="text-3xl font-bold">{invoices.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="methods">Métodos de Pago</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            {invoices.map((invoice) => {
              const status = statusConfig[invoice.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <Card key={invoice.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", status.color)}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{invoice.id}</p>
                            <Badge variant="outline" className="text-xs">
                              {invoice.project}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {invoice.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            ${invoice.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.status === "paid"
                              ? `Pagado el ${new Date(invoice.paidAt!).toLocaleDateString("es-ES")}`
                              : `Vence el ${new Date(invoice.dueDate!).toLocaleDateString("es-ES")}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === "pending" && (
                            <Button size="sm">Pagar</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>
                  Administra tus tarjetas y métodos de pago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {method.brand} •••• {method.last4}
                          </p>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Principal
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expira {method.expiry}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                ))}

                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar método de pago
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
