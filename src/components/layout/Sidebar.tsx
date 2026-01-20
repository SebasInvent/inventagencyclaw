"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  CreditCard,
  ChevronLeft,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const clientNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Mis Proyectos", href: "/dashboard/projects" },
  { icon: MessageSquare, label: "Mensajes", href: "/dashboard/messages" },
  { icon: Calendar, label: "Calls", href: "/dashboard/calls" },
  { icon: CreditCard, label: "Facturación", href: "/dashboard/billing" },
];

const proNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/pro" },
  { icon: FolderKanban, label: "Proyectos", href: "/pro/projects" },
  { icon: Users, label: "Clientes", href: "/pro/clients" },
  { icon: Calendar, label: "Calendario", href: "/pro/calendar" },
  { icon: MessageSquare, label: "Mensajes", href: "/pro/messages" },
  { icon: BarChart3, label: "Analytics", href: "/pro/analytics" },
  { icon: Settings, label: "Configuración", href: "/pro/settings" },
];

interface SidebarProps {
  variant?: "client" | "pro";
}

export function Sidebar({ variant = "client" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const navItems = variant === "pro" ? proNavItems : clientNavItems;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 70 : 280 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">invent</span>
                  <span className="text-xs text-primary -mt-1">agency</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const NavLink = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  "hover:bg-secondary",
                  isActive && "bg-primary/10 text-primary",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                {!collapsed && (
                  <span className={cn("text-sm", isActive && "font-medium")}>
                    {item.label}
                  </span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return NavLink;
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-4">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed(false)}
                  className="w-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      IA
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expandir menú</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  IA
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Usuario Demo</p>
                <p className="text-xs text-muted-foreground truncate">
                  {variant === "pro" ? "Tech Lead" : "Cliente"}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
