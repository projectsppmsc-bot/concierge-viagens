import type { Metadata } from "next";
import Link from "next/link";
import {
  Plane, Search, Award, LayoutDashboard, TrendingDown,
  Bell, MessageSquare, Sparkles, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Início" };

const features = [
  {
    icon: TrendingDown,
    title: "Compare preços em dinheiro",
    desc: "Veja todas as opções de companhias aéreas lado a lado e encontre a tarifa mais barata para a sua rota.",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    icon: Award,
    title: "Simule com milhas",
    desc: "Calcule quanto custaria sua viagem em milhas LATAM, Smiles, Azul, Livelo e Esfera de uma só vez.",
    color: "from-violet-400 to-violet-600",
  },
  {
    icon: Bell,
    title: "Monitore promoções",
    desc: "Crie alertas para rotas específicas e receba notificação quando o preço atingir sua meta.",
    color: "from-amber-400 to-amber-600",
  },
  {
    icon: MessageSquare,
    title: "Recomendações inteligentes",
    desc: "Converse com o Concierge IA para receber sugestões personalizadas de roteiros e melhor custo-benefício.",
    color: "from-blue-400 to-blue-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground leading-tight block">Concierge</span>
              <span className="text-[11px] text-muted-foreground">de Viagens</span>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/busca" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              Buscar Voos
            </Link>
            <Link href="/milhas" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              Milhas
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              Dashboard
            </Link>
          </nav>
          <Button size="sm" asChild>
            <Link href="/busca" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar voos</span>
              <span className="sm:hidden">Buscar</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Comparação inteligente de voos e milhas
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
          Encontre a melhor forma
          <br />
          <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
            de viajar
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Compare preços em dinheiro, milhas ou oportunidade. Um concierge digital para encontrar o melhor custo-benefício para cada viagem.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Button size="lg" asChild className="w-full sm:w-auto text-base px-8 gap-2 shadow-lg shadow-primary/25">
            <Link href="/busca">
              <Search className="w-5 h-5" />
              Buscar voos agora
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 gap-2">
            <Link href="/milhas">
              <Award className="w-5 h-5" />
              Comparar milhas
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild className="w-full sm:w-auto text-base px-8 gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="w-5 h-5" />
              Ver dashboard
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Apenas comparamos e recomendamos. A compra é realizada no site do parceiro.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-bold text-center text-foreground mb-3">
          Tudo que você precisa para viajar melhor
        </h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">
          Ferramentas gratuitas para comparar, planejar e monitorar as melhores tarifas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-blue-700 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pronto para planejar sua próxima viagem?
          </h2>
          <p className="text-blue-100 mb-8">
            Pesquise agora e encontre as melhores tarifas em dinheiro ou milhas.
          </p>
          <Button size="lg" variant="secondary" asChild className="gap-2 text-base px-10">
            <Link href="/busca">
              <Plane className="w-5 h-5" />
              Começar busca gratuita
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Concierge de Viagens · Modo demonstração · Dados simulados
        </p>
      </footer>
    </div>
  );
}
