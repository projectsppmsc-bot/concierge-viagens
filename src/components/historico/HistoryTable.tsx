"use client";

import { useState } from "react";
import { Search, Trash2, RotateCcw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HistoryRow } from "./HistoryRow";
import { useHistory } from "@/hooks/useHistory";

export function HistoryTable() {
  const { history, removeEntry, clearHistory } = useHistory();
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = history
    .filter((h) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        h.originCity.toLowerCase().includes(q) ||
        h.destinationCity.toLowerCase().includes(q) ||
        h.origin.toLowerCase().includes(q) ||
        h.destination.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const diff = new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime();
      return sortDesc ? diff : -diff;
    });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white rounded-xl border border-border px-4 py-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Filtrar por cidade ou aeroporto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 px-0 h-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortDesc(!sortDesc)}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortDesc ? "Mais recente" : "Mais antigo"}
          </Button>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="gap-1.5 text-xs text-muted-foreground hover:text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar tudo
            </Button>
          )}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> pesquisa{filtered.length !== 1 ? "s" : ""}
        </p>
        {search && (
          <Badge variant="secondary" className="text-xs">
            Filtrado por &quot;{search}&quot;
          </Badge>
        )}
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-border gap-3">
          <RotateCcw className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-foreground">Nenhuma pesquisa encontrada</p>
          {search && (
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              Limpar filtro
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((h) => (
            <HistoryRow key={h.id} entry={h} onRemove={removeEntry} />
          ))}
        </div>
      )}
    </div>
  );
}
