import { Sparkles } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelect: (q: string) => void;
}

const questions = [
  "Quero ir para Lisboa em setembro gastando pouco",
  "Tenho 80 mil milhas Smiles. Vale a pena usar?",
  "Quais destinos internacionais por até R$ 3.000?",
  "Qual opção tem menos escalas para a Europa?",
  "Vale a pena voar em executiva com milhas?",
  "Quando é a melhor época para viajar para Miami?",
  "Como funciona o LATAM Pass?",
  "Crie um alerta de preço para minha rota",
];

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Perguntas sugeridas
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="text-left text-xs px-3 py-2.5 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-blue-50/50 hover:text-primary transition-all text-foreground leading-snug"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
