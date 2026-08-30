// Camada de persistência dos agendamentos.
//
// IMPORTANTE: esta versão usa localStorage, que só existe dentro do
// navegador de cada pessoa. Ou seja, um agendamento feito no celular
// de um cliente NÃO aparece automaticamente no painel do barbeiro em
// outro aparelho — cada um vê só o que foi salvo no seu próprio navegador.
//
// Para o site e o painel realmente conversarem entre aparelhos
// diferentes (cliente agenda no celular dele, barbeiro vê no dele),
// troque as duas funções abaixo por chamadas ao backend do BarberHub
// (Node/Express + Postgres), por exemplo:
//
//   export async function getBookings() {
//     const res = await fetch("/api/bookings");
//     return res.json();
//   }
//   export async function saveBookings(list) {
//     await fetch("/api/bookings", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(list),
//     });
//   }

const STORAGE_KEY = "marconi-bookings";

export async function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro ao ler agendamentos", e);
    return [];
  }
}

export async function saveBookings(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error("Erro ao salvar agendamentos", e);
    return false;
  }
}
