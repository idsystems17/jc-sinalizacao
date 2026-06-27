# BRIEFING — JC Sinalização e Serigrafia

## 1. Objetivo do Projeto

Site institucional + vitrine de produtos com **painel administrativo** para o dono gerenciar orçamentos, catálogo, portfólio e depoimentos — sem precisar de programador para o dia a dia.

---

## 2. Stack Técnica (mantendo o que o AI Studio gerou)

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS v4 |
| Animações | Framer Motion (motion/react) |
| Ícones | Lucide React |
| Persistência | localStorage (zero backend) |
| Deploy | GitHub → Vercel (automático) |
| Formulário | Envio via WhatsApp formatado |

**Remover:** `@google/genai` — foi inserido pelo AI Studio mas não é usado.

---

## 3. Arquitetura de Páginas

### Vitrine (pública)

```
┌─────────────────────────────────────┐
│  01. NAVBAR — fixa, responsiva      │
├─────────────────────────────────────┤
│  02. HERO — headline + CTAs         │
├─────────────────────────────────────┤
│  03. SOBRE — história + diferenciais│  ← NOVO
├─────────────────────────────────────┤
│  04. COMO FUNCIONA — 3 passos       │  ← NOVO
├─────────────────────────────────────┤
│  05. PRODUTOS & SERVIÇOS — catálogo │  ← já existe
├─────────────────────────────────────┤
│  06. PORTFÓLIO — galeria de fotos   │  ← NOVO
├─────────────────────────────────────┤
│  07. FORMULÁRIO DE ORÇAMENTO        │  ← já existe (melhorar)
├─────────────────────────────────────┤
│  08. DEPOIMENTOS — carrossel        │  ← já existe
├─────────────────────────────────────┤
│  09. FAQ — perguntas frequentes     │  ← NOVO
├─────────────────────────────────────┤
│  10. LOCALIZAÇÃO & CONTATO          │  ← já existe
├─────────────────────────────────────┤
│  11. FOOTER                         │  ← já existe
└─────────────────────────────────────┘
```

### Admin Panel (privado)

```
┌─────────────────────────────────────┐
│  LOGIN — senha simples com hash     │  ← NOVO (hoje está aberto!)
├─────────────────────────────────────┤
│  DASHBOARD — resumo + métricas      │  ← já existe
├─────────────────────────────────────┤
│  ORÇAMENTOS — pipeline de status    │  ← já existe
├─────────────────────────────────────┤
│  CATÁLOGO — CRUD de produtos        │  ← já existe
├─────────────────────────────────────┤
│  PORTFÓLIO — gerenciar fotos        │  ← NOVO
├─────────────────────────────────────┤
│  DEPOIMENTOS — aprovar/rejeitar     │  ← já existe
├─────────────────────────────────────┤
│  CONFIGURAÇÕES — dados da empresa   │  ← já existe
└─────────────────────────────────────┘
```

---

## 4. Features por Prioridade

### Prioridade Alta (entrega mínima)
- [ ] Substituir dados placeholder pelos dados reais do JC
- [ ] Senha de acesso no admin (hash SHA-256 local, sem backend)
- [ ] Formulário de orçamento → envia mensagem formatada no WhatsApp do JC
- [ ] Logo real + favicon
- [ ] Meta tags SEO + Open Graph

### Prioridade Média (entrega completa)
- [ ] Seção "Sobre" — história da empresa, anos de mercado, diferenciais
- [ ] Seção "Como Funciona" — 3 passos: escolha → orçamento → produção
- [ ] Seção "Portfólio" — galeria com fotos de trabalhos realizados
- [ ] Seção "FAQ" — accordion com dúvidas comuns
- [ ] Admin: gestão do portfólio (adicionar/remover fotos por URL)
- [ ] Lazy loading de imagens

### Prioridade Baixa (polimento)
- [ ] Animações de entrada por seção (scroll reveal)
- [ ] Indicador de progresso de scroll no topo
- [ ] Exportar orçamentos em texto formatado para o WhatsApp
- [ ] PWA básico (manifest + ícones)
- [ ] Domínio customizado no Vercel

---

## 5. Fluxo de Orçamento (ponta a ponta)

```
Cliente → clica "Orçamento" no produto
       → produto entra no carrinho lateral
       → preenche dados no formulário
       → clica "Enviar"
       → abre WhatsApp com mensagem formatada
         pro número do JC
       → orçamento salvo em localStorage
       → JC responde pelo WhatsApp normalmente
       → JC abre o admin e atualiza o status
```

---

## 6. O que preciso do JC (dados reais)

| Dado | Para usar em |
|---|---|
| Telefone WhatsApp | Formulário, botão flutuante, footer |
| Endereço completo | Mapa, footer |
| Email de contato | Footer, configurações |
| Instagram | Footer, Hero |
| Facebook | Footer |
| Horário de funcionamento | Seção contato |
| Senha do admin | Proteção do painel |
| Logo (PNG/SVG) | Navbar, footer, favicon |
| Fotos de trabalhos | Portfólio |

---

## 7. Plano de Deploy

```
GitHub: idsystems17/jc-sinalizacao
           ↓ push automático
Vercel: jc-sinalizacao.vercel.app
           ↓ (futuro)
Domínio: jcsinalizacao.com.br (se tiver)
```

---

## 8. Fases de Implementação

```
FASE 1 — Base sólida          (1 sessão)
  • instalar deps + rodar local
  • dados reais
  • senha admin
  • formulário → WhatsApp
  • SEO básico

FASE 2 — Novas seções         (1 sessão)
  • Sobre
  • Como Funciona
  • Portfólio + admin do portfólio
  • FAQ

FASE 3 — Polimento + Deploy   (1 sessão)
  • logo real + favicon
  • animações refinadas
  • GitHub + Vercel
  • ajustes finais com o JC
```
