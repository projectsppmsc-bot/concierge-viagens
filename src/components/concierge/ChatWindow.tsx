"use client";

import { useEffect, useRef } from "react";
import { Plane, RotateCcw, Sparkles } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { Button } from "@/components/ui/button";
import { useConciergeContext } from "@/context/ConciergeContext";

export function ChatWindow() {
  const { session, isThinking, sendMessage, clearSession } = useConciergeContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isThinking]);

  const showSuggestions = session.messages.length <= 1;

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-2xl border border-border overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shrink-0">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground">Concierge de Viagens</p>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Seu assistente inteligente de viagens · Respostas simuladas
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSession}
          title="Nova conversa"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 min-h-0">
        {session.messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSuggestion={(text) => sendMessage(text)}
          />
        ))}

        {/* Typing indicator */}
        {isThinking && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions — shown only at start */}
      {showSuggestions && !isThinking && (
        <div className="border-t border-border bg-white/60">
          <SuggestedQuestions onSelect={(q) => sendMessage(q)} />
        </div>
      )}

      {/* AI disclaimer */}
      {!showSuggestions && (
        <div className="px-4 py-2 bg-white/60 border-t border-border flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            Powered by Claude · Especialista em viagens e milhas
          </p>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSend={(text) => sendMessage(text)}
        disabled={isThinking}
      />
    </div>
  );
}
