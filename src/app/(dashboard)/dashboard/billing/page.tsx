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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInvoices } from "@/lib/hooks/useInvoices";

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  draft: { label: "Borrador", icon: FileText, color: "text-gray-500 bg-gray-500/10" },
  sent: { label: "Enviada", icon: Clock, color: "text-yellow-500 bg-yellow-500/10" },
  paid: { label: "Pagado", icon: CheckCircle2, color: "text-green-500 bg-green-500/10" },
  overdue: { label: "Vencido", icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
  cancelled: { label: "Cancelado", icon: AlertCircle, color: "text-gray-500 bg-gray-500/10" },
};

export default function BillingPage() {
  const { invoices, totalPaid, totalPending, totalOverdue, loading } = useInvoices();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <p className="text-sm text-muted-foreground">Vencido</p>
                  <p className="text-3xl font-bold text-red-500">
                    ${totalOverdue.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
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
            {invoices.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No tienes facturas aún</p>
              </Card>
            ) : (
              invoices.map((invoice) => {
                const status = statusConfig[invoice.status] || statusConfig.draft;
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
                              <p className="font-medium">{invoice.invoice_number}</p>
                              {invoice.project && (
                                <Badge variant="outline" className="text-xs">
                                  {invoice.project.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {invoice.notes || `Factura ${invoice.invoice_number}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xl font-bold">
                              ${Number(invoice.amount).toLocaleString()} {invoice.currency}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {invoice.status === "paid" && invoice.paid_at
                                ? `Pagado el ${new Date(invoice.paid_at).toLocaleDateString("es-ES")}`
                                : invoice.due_date
                                ? `Vence el ${new Date(invoice.due_date).toLocaleDateString("es-ES")}`
                                : "Sin fecha de vencimiento"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            {(invoice.status === "sent" || invoice.status === "overdue") && (
                              <Button size="sm">Pagar</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
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
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No tienes métodos de pago configurados</p>
                  <p className="text-sm">Próximamente podrás agregar tarjetas con Stripe</p>
                </div>

                <Button variant="outline" className="w-full gap-2" disabled>
                  <Plus className="h-4 w-4" />
                  Agregar método de pago (Próximamente)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
