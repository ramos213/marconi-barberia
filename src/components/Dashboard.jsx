import { useState, useEffect, useRef } from "react";
import { Check, X, Banknote, RefreshCw, Trash2, CircleDollarSign, Bell, BellOff } from "lucide-react";
import { BARBERS } from "../data/barbers.js";
import { todayStr, fmtDate, money, timeToMin } from "../utils/time.js";

export default function Dashboard({ bookings, updateBooking, reload }) {
  const [date, setDate] = useState(todayStr());
  const [barberFilter, setBarberFilter] = useState("todos");
  const [payingId, setPayingId] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Pix");
  const [notifPermission, setNotifPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );
  const [toast, setToast] = useState(null);
  const seenIds = useRef(null);

  // Verifica a agenda periodicamente enquanto o painel está aberto.
  useEffect(() => {
    const id = setInterval(() => { reload(); }, 15000);
    return () => clearInterval(id);
  }, [reload]);

  // Detecta agendamentos novos e dispara notificação + toast.
  useEffect(() => {
    if (seenIds.current === null) {
      seenIds.current = new Set(bookings.map((b) => b.id));
      return;
    }
    const fresh = bookings.filter((b) => !seenIds.current.has(b.id));
    if (fresh.length === 0) return;
    fresh.forEach((b) => {
      seenIds.current.add(b.id);
      const msg = `${b.clientName} agendou ${b.serviceName} às ${b.time} · ${fmtDate(b.date)}`;
      setToast(msg);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try { new Notification("Novo agendamento — Marconi", { body: msg }); } catch (e) {}
      }
    });
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [bookings]);

  const requestNotif = () => {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then((perm) => setNotifPermission(perm));
  };

  const dayBookings = bookings
    .filter((b) => b.date === date && (barberFilter === "todos" || b.barberId === barberFilter))
    .sort((a, b) => timeToMin(a.time) - timeToMin(b.time));

  const totalDia = bookings.filter((b) => b.date === date && b.paid).reduce((sum, b) => sum + b.paidAmount, 0);
  const concluidos = bookings.filter((b) => b.date === date && b.status === "concluido").length;
  const pendentes = dayBookings.filter((b) => b.status === "agendado").length;

  const openPay = (b) => { setPayingId(b.id); setPayAmount(String(b.price)); setPayMethod("Pix"); };
  const confirmPay = (b) => {
    const amt = parseFloat(String(payAmount).replace(",", "."));
    if (isNaN(amt) || amt < 0) return;
    updateBooking(b.id, { paid: true, paidAmount: amt, paymentMethod: payMethod, status: "concluido" });
    setPayingId(null);
  };
  const cancelBooking = (b) => { if (window.confirm(`Cancelar o horário de ${b.clientName} às ${b.time}?`)) updateBooking(b.id, { status: "cancelado" }); };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      {toast && (
        <div className="mk-toast">
          <div className="flex items-center gap-2 mb-1" style={{ color: "var(--copper-light)" }}>
            <Bell size={14} /><span className="text-xs mk-mono" style={{ fontWeight: 600 }}>NOVO AGENDAMENTO</span>
          </div>
          <div className="text-sm">{toast}</div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="mk-eyebrow mb-1">Painel do Barbeiro</div>
          <h2 className="mk-serif text-2xl" style={{ fontWeight: 700 }}>Agenda do dia</h2>
        </div>
        <div className="flex items-center gap-2">
          {notifPermission === "granted" && (
            <div className="mk-notify-btn on"><Bell size={13} /> Notificações ativas</div>
          )}
          {notifPermission === "default" && (
            <div className="mk-notify-btn off" onClick={requestNotif}><BellOff size={13} /> Ativar notificações</div>
          )}
          {notifPermission === "denied" && (
            <div className="mk-notify-btn off" title="Permissão bloqueada no navegador"><BellOff size={13} /> Notificações bloqueadas</div>
          )}
          <button className="mk-btn mk-btn-ghost" onClick={reload}><RefreshCw size={14} /> Atualizar</button>
        </div>
      </div>
      <p className="text-xs mb-6" style={{ color: "var(--muted2)" }}>
        A agenda é verificada a cada 15s enquanto esta aba fica aberta no seu celular ou computador.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="mk-card p-5">
          <div className="text-xs mb-1" style={{ color: "var(--muted2)" }}>Recebido no dia</div>
          <div className="mk-stat-num text-2xl" style={{ color: "var(--success)" }}>{money(totalDia)}</div>
        </div>
        <div className="mk-card p-5">
          <div className="text-xs mb-1" style={{ color: "var(--muted2)" }}>Concluídos</div>
          <div className="mk-stat-num text-2xl">{concluidos}</div>
        </div>
        <div className="mk-card p-5">
          <div className="text-xs mb-1" style={{ color: "var(--muted2)" }}>Aguardando</div>
          <div className="mk-stat-num text-2xl" style={{ color: "var(--copper-light)" }}>{pendentes}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input type="date" className="mk-input" style={{ width: "auto" }} value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="mk-select" style={{ width: "auto" }} value={barberFilter} onChange={(e) => setBarberFilter(e.target.value)}>
          <option value="todos">Todos os barbeiros</option>
          {BARBERS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {dayBookings.length === 0 ? (
        <div className="mk-card p-10 text-center" style={{ color: "var(--muted2)" }}>
          Nenhum agendamento para {fmtDate(date)} ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {dayBookings.map((b) => (
            <div key={b.id} className={`mk-ticket p-5 ${b.paid ? "paid" : ""} ${b.status === "cancelado" ? "cancelled" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mk-mono text-lg" style={{ minWidth: 54, color: "var(--copper-light)", fontWeight: 600 }}>{b.time}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 600 }}>{b.clientName}</span>
                      {b.status === "agendado" && <span className="mk-badge mk-badge-pending">Agendado</span>}
                      {b.status === "concluido" && <span className="mk-badge mk-badge-paid"><Check size={11} /> Pago</span>}
                      {b.status === "cancelado" && <span className="mk-badge mk-badge-cancelled">Cancelado</span>}
                    </div>
                    <div className="text-sm mt-1" style={{ color: "var(--muted2)" }}>
                      {b.serviceName} · {b.barberName} · {b.phone}
                    </div>
                    {b.paid && (
                      <div className="text-xs mt-1 mk-mono" style={{ color: "var(--success)" }}>
                        {money(b.paidAmount)} recebido via {b.paymentMethod}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="mk-mono text-sm" style={{ color: "var(--muted2)" }}>{money(b.price)}</span>
                  {b.status === "agendado" && (
                    <>
                      <button className="mk-btn mk-btn-primary" style={{ padding: "8px 14px" }} onClick={() => openPay(b)}>
                        <Banknote size={14} /> Registrar pagamento
                      </button>
                      <button className="mk-btn mk-btn-ghost" style={{ padding: "8px 10px" }} onClick={() => cancelBooking(b)}>
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {payingId === b.id && (
                <div className="mt-4 pt-4 flex flex-wrap items-end gap-3" style={{ borderTop: "1px solid var(--divider)" }}>
                  <div>
                    <label className="mk-label">Valor recebido</label>
                    <input className="mk-input" style={{ width: 130 }} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="mk-label">Forma de pagamento</label>
                    <select className="mk-select" style={{ width: 140 }} value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                      <option>Pix</option><option>Dinheiro</option><option>Cartão</option>
                    </select>
                  </div>
                  <button className="mk-btn mk-btn-primary" onClick={() => confirmPay(b)}><CircleDollarSign size={14} /> Confirmar</button>
                  <button className="mk-btn mk-btn-ghost" onClick={() => setPayingId(null)}><X size={14} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
