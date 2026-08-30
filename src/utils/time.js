import { SCHEDULE } from "../data/schedule.js";

export const timeToMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const minToTime = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const todayStr = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
};

export const money = (n) => `R$ ${n.toFixed(2).replace(".", ",")}`;

export function availableSlots(dateStr, durationMin, barberId, bookings) {
  if (!dateStr) return [];
  const d = new Date(dateStr + "T00:00:00");
  const sched = SCHEDULE[d.getDay()];
  if (!sched) return [];
  const [open, close] = sched;
  const slots = [];
  for (let t = open; t + durationMin <= close; t += 30) slots.push(minToTime(t));

  const taken = bookings.filter(
    (b) => b.barberId === barberId && b.date === dateStr && b.status !== "cancelado"
  );
  const now = new Date();
  const isToday = dateStr === todayStr();

  return slots.filter((s) => {
    const start = timeToMin(s);
    if (isToday && start <= now.getHours() * 60 + now.getMinutes()) return false;
    const end = start + durationMin;
    return !taken.some((b) => {
      const bStart = timeToMin(b.time), bEnd = bStart + b.duration;
      return start < bEnd && end > bStart;
    });
  });
}
