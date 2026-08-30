# Barbearia Marconi

Site com agendamento pelo cliente + painel do barbeiro, feito em React + Vite + Tailwind.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  data/         catálogo de serviços, barbeiros e horário de funcionamento
  utils/        helpers de data/hora e a camada de persistência (storage.js)
  components/   Header, SiteView (site público), PanelView/Dashboard (painel)
  assets/images fotos reais da loja usadas na seção "Fotos"
```

## Painel do barbeiro

O painel **não tem link visível no site**. Para acessar, adicione `#painel`
no final do endereço, por exemplo:

```
https://seudominio.com/#painel
```

Depois disso, ele pede uma senha (definida em `src/components/PanelView.jsx`,
hoje `marconi2026` só para demonstração). Troque essa senha e, antes de usar
com dinheiro de verdade, troque por um login real — hoje é só uma trava no
frontend, não autenticação de verdade.

## ⚠️ Limitação importante: `localStorage`

Os agendamentos hoje são salvos com `localStorage`, ou seja, **só existem no
navegador de quem preencheu o formulário**. Um cliente que agenda pelo celular
dele não aparece automaticamente no painel do barbeiro em outro aparelho.

Isso funciona para testar o fluxo, mas para o site e o painel realmente se
falarem entre aparelhos diferentes, é preciso um backend. As duas funções que
precisam mudar estão isoladas em `src/utils/storage.js` — trocando
`getBookings`/`saveBookings` por chamadas `fetch` para uma API (o
[BarberHub](../) já usa Node/Express + PostgreSQL via Prisma), o resto do app
não precisa mudar.

## Notificação para o barbeiro

O painel usa a Notification API do navegador: com a aba aberta, ele checa a
cada 15s se chegou agendamento novo e dispara uma notificação. Isso funciona
enquanto o navegador/app estiver aberto (mesmo em segundo plano na maioria
dos casos), mas não com o app totalmente fechado — para isso seria necessário
push notification de verdade (service worker + backend) ou reaproveitar a
integração de WhatsApp via Meta Cloud API que já está prevista no BarberHub.

## Deploy

Qualquer host de site estático funciona (Vercel, Netlify, Cloudflare Pages):
build command `npm run build`, output directory `dist`.
