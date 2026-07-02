"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAlerts } from "@/mock/alerts";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const triggered = mockAlerts.filter((a) => a.status === "triggered").length;

export function Header({ onMenuClick, title = "Dashboard" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-4 md:px-6 bg-white border-b border-border">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title — hidden on mobile to save space */}
      <h1 className="hidden md:block text-base font-semibold text-foreground">{title}</h1>

      <div className="flex-1" />

      {/* Search shortcut */}
      <Button
        variant="outline"
        size="sm"
        className="hidden sm:flex items-center gap-2 text-muted-foreground w-48 justify-start"
        asChild
      >
        <a href="/busca">
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Buscar voos...</span>
        </a>
      </Button>

      {/* Alerts bell */}
      <Button variant="ghost" size="icon" className="relative" asChild>
        <a href="/alertas">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {triggered > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {triggered}
            </Badge>
          )}
        </a>
      </Button>

      {/* User avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
        U
      </div>
    </header>
  );
}
