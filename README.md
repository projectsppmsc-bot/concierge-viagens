# Concierge de Viagens

Plataforma de comparação de voos em dinheiro e milhas. Compare tarifas de companhias aéreas, simule pontos em programas de fidelidade (LATAM Pass, Smiles, Azul, Livelo, Esfera) e receba recomendações inteligentes.

**Modo padrão:** mock (dados simulados). Para dados reais, use Travelpayouts.

---

## Rodando localmente

```cmd
npm.cmd install
npm.cmd run dev
```

Acesse: [http://localhost:3002](http://localhost:3002)

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm.cmd run dev` | Servidor de desenvolvimento na porta 3002 |
| `npm.cmd run build` | Build de produção |
| `npm.cmd run start` | Servidor de produção |
| `npm.cmd run lint` | Verificação de lint |

---

## Configuração de variáveis de ambiente

Copie `.env.example` para `.env.local`:

```cmd
copy .env.example .env.local
```

---

## Integração com dados reais — Travelpayouts

### Por que Travelpayouts?

A [Travelpayouts](https://travelpayouts.com) é uma rede de afiliados de viagens com API gratuita de preços de voos reais. Os dados são coletados de companhias aéreas e parceiros continuamente.

> **Nota:** A Amadeus Self-Service API foi descontinuada e encerra em 17/07/2026. Use Travelpayouts.

### Vantagens

- Cadastro gratuito e imediato (sem aprovação)
- API key disponível na hora
- Dados reais de preços de voos
- Links de compra para o parceiro (Jetradar/Aviasales)
- Opção de afiliado com comissão por venda
- Suporte ao mercado brasileiro (BRL, PT-BR)

---

### Passo 1 — Criar conta gratuita

1. Acesse [travelpayouts.com](https://travelpayouts.com)
2. Clique em **"Join for free"**
3. Preencha nome, e-mail e senha (sem necessidade de documento)
4. Confirme o e-mail

---

### Passo 2 — Obter o token da API

1. Faça login no painel
2. Acesse o menu **"Developers"** → **"API"** (ou vá direto para [app.travelpayouts.com/programs](https://app.travelpayouts.com/programs))
3. Na seção **"Data API"**, copie seu **API Token** (chamado de `X-Access-Token`)

> O token fica em: Painel → Account → API Tokens

---

### Passo 3 — Configurar `.env.local`

Edite `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FLIGHT_PROVIDER=travelpayouts
TRAVELPAYOUTS_TOKEN=seu_token_aqui
```

O campo `TRAVELPAYOUTS_MARKER` é opcional — serve para links de afiliado com comissão.

---

### Passo 4 — Testar localmente

```cmd
npm.cmd run dev
```

1. Acesse [http://localhost:3002/busca](http://localhost:3002/busca)
2. Pesquise: **GRU → LIS** com data em setembro de 2026
3. Aguarde ~2 segundos
4. Os resultados mostram badge azul **"Voo real"** e banner **"Exibindo voos reais via Travelpayouts"**
5. Clique em **"Ver oferta"** → abre o site parceiro (Jetradar) em nova aba

---

### Comportamento de fallback

```
NEXT_PUBLIC_FLIGHT_PROVIDER=travelpayouts
  │
  ├── API retorna voos reais → exibe com badge "Voo real" ✅
  │
  ├── API retorna 0 voos para a rota → exibe mock + banner laranja ⚠️
  │   "A busca real não retornou voos para essa rota."
  │
  └── Erro de rede / token inválido → exibe mock + banner laranja ⚠️
      "A busca real de voos não respondeu."
```

---

### Como alternar entre providers

| `NEXT_PUBLIC_FLIGHT_PROVIDER` | Comportamento |
|---|---|
| `mock` (padrão) | Dados simulados — sem credenciais, funciona offline |
| `travelpayouts` | Dados reais via Travelpayouts — requer `TRAVELPAYOUTS_TOKEN` |
| `amadeus` | ⚠️ Descontinuado em 17/07/2026 — não usar |

---

### Links de compra

O sistema **não vende passagens**. Para cada oferta, é exibido um botão **"Ver oferta"** que abre o site parceiro em nova aba.

A lógica de links funciona em 2 camadas:

1. **Link Travelpayouts** (quando disponível) → `https://www.jetradar.com/...`
2. **Fallback por companhia** → Deep links diretos:
   - LATAM → `latamairlines.com`
   - GOL → `voegol.com.br`
   - Azul → `voeazul.com.br`
   - TAP → `flytap.com`
   - American → `aa.com`
   - Demais → Google Flights

---

## Arquitetura de providers

```
src/services/flights/
  types.ts                  → Interface FlightProvider (contrato comum)
  provider.ts               → Seletor via NEXT_PUBLIC_FLIGHT_PROVIDER
  mock-provider.ts          → Dados simulados (src/mock/flights.ts)
  travelpayouts-provider.ts → Chama /api/flights/search-tp (server-side)
  amadeus-provider.ts       → Legado (descontinuado)

src/app/api/flights/
  search-tp/route.ts  → Travelpayouts: autenticação + busca + mapeamento
  search/route.ts     → Amadeus: legado

src/utils/
  booking-links.ts    → Deep links por companhia aérea
```

**Para adicionar um novo provider** (ex: Duffel, Kiwi):
1. Implemente `FlightProvider` em `src/services/flights/duffel-provider.ts`
2. Adicione `"duffel"` em `ProviderName` no `types.ts`
3. Crie `src/app/api/flights/search-duffel/route.ts`
4. Registre em `provider.ts`

---

## Deploy na Vercel

### Checklist pré-deploy

- [ ] `npm.cmd run build` sem erros
- [ ] `npm.cmd run lint` sem erros
- [ ] Testar localmente em `http://localhost:3002`
- [ ] Criar repositório no GitHub
- [ ] `.gitignore` exclui `.next/`, `node_modules/`, `.env.local`

### Variáveis de ambiente na Vercel

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_FLIGHT_PROVIDER` | `travelpayouts` |
| `TRAVELPAYOUTS_TOKEN` | seu token da API |
| `TRAVELPAYOUTS_MARKER` | seu marker de afiliado (opcional) |

### Passo a passo

1. Criar repositório GitHub e fazer push
2. Acessar [vercel.com](https://vercel.com) → Add New → Project
3. Importar repositório `concierge-viagens`
4. Framework: Next.js (detectado automaticamente)
5. Adicionar variáveis de ambiente
6. Deploy → testar URL pública

---

## Exemplos de busca (dados reais Travelpayouts)

| Origem | Destino | Tipo |
|---|---|---|
| GRU | LIS | Internacional longa |
| GRU | MIA | Internacional longa |
| GIG | MIA | Internacional longa |
| GRU | JFK | Internacional longa |
| CGH | SDU | Doméstica ponte-aérea |
| GRU | SSA | Doméstica |
| GRU | FOR | Doméstica |

> Travelpayouts retorna preços cacheados das últimas buscas. Se uma rota não tiver dados recentes, o sistema exibe mock automaticamente com aviso.

---

## Exemplos de busca (modo mock — sem credenciais)

| Origem | Destino | Mês sugerido |
|---|---|---|
| GRU | LIS | Setembro/2026 |
| GRU | MIA | Setembro/2026 |
| GRU | CDG | Outubro/2026 |
| CGH | SDU | Setembro/2026 |
| CNF | BSB | Setembro/2026 |

---

## Aviso legal

Concierge de Viagens apenas compara e recomenda opções. A compra é realizada no site da companhia aérea ou parceiro. Confirme sempre o preço final antes de concluir a compra.
