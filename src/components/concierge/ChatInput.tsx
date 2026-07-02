"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Pergunte ao seu concierge..." }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-border rounded-b-2xl">
      <div className={cn(
        "flex-1 flex items-end gap-2 rounded-xl border border-input bg-muted/30 px-3 py-2 transition-colors",
        "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
      )}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 max-h-28"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground opacity-50 cursor-not-allowed"
          disabled
          title="Entrada de voz (em breve)"
        >
          <Mic className="w-4 h-4" />
        </Button>
      </div>
      <Button
        type="button"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
