"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Search, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: "1",
    projectName: "App de Telemedicina",
    lastMessage: "Perfecto, mañana te envío los wireframes actualizados",
    lastMessageTime: "10:30 AM",
    unread: 3,
    participants: [
      { name: "Ana M.", avatar: null, role: "Tech Lead" },
    ],
  },
  {
    id: "2",
    projectName: "Sistema de Pagos",
    lastMessage: "¿Podemos agendar una call para revisar la integración?",
    lastMessageTime: "Ayer",
    unread: 0,
    participants: [
      { name: "Luis G.", avatar: null, role: "Developer" },
    ],
  },
];

const messages = [
  {
    id: "1",
    senderId: "team",
    senderName: "Ana M.",
    content: "¡Hola! Te comparto el avance del dashboard de pacientes. Ya está lista la vista principal con los datos del paciente.",
    timestamp: "10:15 AM",
    isOwn: false,
  },
  {
    id: "2",
    senderId: "user",
    senderName: "Tú",
    content: "Excelente, se ve muy bien. ¿Podrías agregar un filtro por fecha en la lista de citas?",
    timestamp: "10:20 AM",
    isOwn: true,
  },
  {
    id: "3",
    senderId: "team",
    senderName: "Ana M.",
    content: "Claro, lo agrego hoy mismo. También estoy trabajando en la integración con el calendario.",
    timestamp: "10:25 AM",
    isOwn: false,
  },
  {
    id: "4",
    senderId: "team",
    senderName: "Ana M.",
    content: "Perfecto, mañana te envío los wireframes actualizados",
    timestamp: "10:30 AM",
    isOwn: false,
  },
];

export default function MessagesPage() {
  // On mobile we want to start in "list view" — no conversation selected yet.
  // On md+ the layout has both panels visible, so we default to first conv.
  const [selectedConversation, setSelectedConversation] = useState<
    typeof conversations[number] | null
  >(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setNewMessage("");
  };

  // On mobile: show only list when no conversation, only chat when one is selected.
  const showListMobile = !selectedConversation;
  const showChatMobile = !!selectedConversation;

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Mensajes" subtitle="Comunicación con tu equipo" showSearch={false} />

      <div className="flex-1 flex">
        {/* Conversations List */}
        <div
          className={cn(
            "w-full md:w-80 border-r border-border flex-col",
            showListMobile ? "flex" : "hidden md:flex",
          )}
        >
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversación..." className="pl-9" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-colors",
                    "hover:bg-secondary/50",
                    selectedConversation?.id === conv.id && "bg-secondary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.participants[0].avatar || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {conv.participants[0].name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {conv.projectName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-primary h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "flex-1 flex-col",
            showChatMobile ? "flex" : "hidden md:flex",
          )}
        >
          {/* Chat Header */}
          <div className="h-16 border-b border-border px-3 md:px-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              {/* Back button — only on mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversation(null)}
                className="md:hidden shrink-0"
                aria-label="Volver a conversaciones"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {selectedConversation?.participants[0].name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{selectedConversation?.projectName}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {selectedConversation?.participants[0].name} • {selectedConversation?.participants[0].role}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 hidden sm:inline-flex">
              Ver proyecto
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3 md:p-6">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 md:gap-3",
                    message.isOwn && "flex-row-reverse"
                  )}
                >
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {message.senderName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2",
                      message.isOwn
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary rounded-bl-md"
                    )}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p
                      className={cn(
                        "text-[10px] mt-1",
                        message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-border">
            <div className="max-w-3xl mx-auto flex gap-2 md:gap-3 items-center">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
