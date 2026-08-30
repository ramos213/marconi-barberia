import { useState, useEffect, useMemo } from "react";
import { Check, ChevronRight } from "lucide-react";
import { SERVICES } from "../data/services.js";
import { BARBERS } from "../data/barbers.js";
import { SCHEDULE } from "../data/schedule.js";
import { availableSlots, todayStr, fmtDate, money } from "../utils/time.js";

export default function BookingForm({ bookings, addBooking, loaded }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [barberId, setBarberId] = useState(BARBERS[0].id);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState("");

  const service = SERVICES.find((s) => s.id === serviceId);
  const closed = date && SCHEDULE[new Date(date + "T00:00:00").getDay()] === null;
  const slots = useMemo(
    () => availableSlots(date, service.duration, barberId, bookings),
    [date, service, barberId, bookings]
  );

  useEffect(() => { setTime(""); }, [date, serviceId, barberId]);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) { setError("Preencha nome e telefone."); return; }
    if (!time) { setError("Escolha um horário disponível."); return; }
    const booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      clientName: name.trim(),
      phone: phone.trim(),
      serviceId, serviceName: service.name, price: service.price, duration: service.duration,
      barberId, barberName: BARBERS.find((b) => b.id === barberId).name,
      date, time,
      status: "agendado", paid: false, paidAmount: 0, paymentMethod: null,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setConfirmed(booking);
  };

  if (confirmed) {
    return (
      <div className="mk-ticket p-6">
        <div className="flex items-center gap-2 mb-4" style={{ color: "var(--success)" }}>
          <Check size={18} /><span className="mk-mono text-sm" style={{ fontWeight: 600 }}>AGENDAMENTO CONFIRMADO</span>
        </div>
        <div className="mk-serif text-2xl mb-1" style={{ fontWeight: 700 }}>{confirmed.serviceName}</div>
        <div className="text-sm mb-5" style={{ color: "var(--muted2)" }}>com {confirmed.barberName}</div>
        <div className="grid grid-cols-2 gap-4 mk-mono text-sm mb-6">
          <div><div style={{ color: "var(--muted2)" }}>DATA</div><div className="text-base mt-1">{fmtDate(confirmed.date)}</div></div>
          <div><div style={{ color: "var(--muted2)" }}>HORÁRIO</div><div className="text-base mt-1">{confirmed.time}</div></div>
          <div><div style={{ color: "var(--muted2)" }}>CLIENTE</div><div className="text-base mt-1">{confirmed.clientName}</div></div>
          <div><div style={{ color: "var(--muted2)" }}>VALOR</div><div className="text-base mt-1" style={{ color: "var(--copper-light)" }}>{money(confirmed.price)}</div></div>
        </div>
        <p className="text-xs mb-5" style={{ color: "var(--muted2)" }}>O pagamento é feito na barbearia, direto com {confirmed.barberName}.</p>
        <button className="mk-btn mk-btn-outline" onClick={() => { setConfirmed(null); setName(""); setPhone(""); setTime(""); }}>
          Fazer novo agendamento
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mk-card p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="mk-label">Nome</label>
          <input className="mk-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
        </div>
        <div>
          <label className="mk-label">Telefone / WhatsApp</label>
          <input className="mk-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 90000-0000" />
        </div>
        <div>
          <label className="mk-label">Serviço</label>
          <select className="mk-select" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>)}
          </select>
        </div>
        <div>
          <label className="mk-label">Barbeiro</label>
          <select className="mk-select" value={barberId} onChange={(e) => setBarberId(e.target.value)}>
            {BARBERS.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.role}</option>)}
          </select>
        </div>
        <div>
          <label className="mk-label">Data</label>
          <input type="date" className="mk-input" min={todayStr()} value={date} onChange={(e) => setDate(e.target.value)} />
          {closed && <div className="text-xs mt-2" style={{ color: "var(--oxblood-light)" }}>Fechado aos domingos — escolha outro dia.</div>}
        </div>
        <div>
          <label className="mk-label">Duração / valor</label>
          <div className="mk-input flex items-center justify-between" style={{ background: "var(--surface-2)" }}>
            <span className="mk-mono text-sm" style={{ color: "var(--muted2)" }}>{service.duration} min</span>
            <span className="mk-mono text-sm" style={{ color: "var(--copper-light)" }}>{money(service.price)}</span>
          </div>
        </div>
      </div>

      {!closed && date && (
        <div className="mt-6">
          <label className="mk-label">Horários disponíveis {loaded && slots.length === 0 && "— nenhum livre nesse dia"}</label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto mk-scrollbar pr-1">
            {slots.map((s) => (
              <div key={s} className={`mk-slot ${time === s ? "selected" : ""}`} onClick={() => setTime(s)}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="text-sm mt-4" style={{ color: "var(--oxblood-light)" }}>{error}</div>}

      <button type="submit" className="mk-btn mk-btn-primary w-full sm:w-auto mt-7">
        Confirmar agendamento <ChevronRight size={16} />
      </button>
    </form>
  );
}
