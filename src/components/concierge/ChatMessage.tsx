import { Plane, User } from "lucide-react";
import { formatTime } from "@/utils/date-helpers";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/concierge";

interface ChatMessageProps {
  message: ChatMessageType;
  onSuggestion?: (text: string) => void;
}

export function ChatMessage({ message, onSuggestion }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex gap-3", isAssistant ? "items-start" : "items-start flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
        isAssistant
          ? "bg-gradient-to-br from-primary to-blue-700"
          : "bg-gradient-to-br from-slate-500 to-slate-700"
      )}>
        {isAssistant
          ? <Plane className="w-4 h-4 text-white" />
          : <User className="w-4 h-4 text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[80%] space-y-2", isAssistant ? "items-start" : "items-end flex flex-col")}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isAssistant
            ? "bg-white border border-border text-foreground rounded-tl-sm shadow-card"
            : "bg-primary text-white rounded-tr-sm"
        )}>
          {message.content}
        </div>

        {/* Suggestions */}
        {isAssistant && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.suggestedActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => onSuggestion?.(action)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-blue-50 hover:bg-primary hover:text-white transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={cn("text-[10px] text-muted-foreground px-1", !isAssistant && "text-right")}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
