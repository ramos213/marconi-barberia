import { useState } from "react";
import { Lock } from "lucide-react";
import Dashboard from "./Dashboard.jsx";

// Demonstração apenas — troque por autenticação real (login de barbeiro
// no backend do BarberHub) antes de usar em produção com dinheiro de verdade.
const PANEL_PASSWORD = "marconi2026";

export default function PanelView({ bookings, updateBooking, reload }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-5 py-24">
        <div className="mk-card p-8 text-center">
          <Lock size={22} color="var(--copper)" className="mx-auto mb-4" />
          <div className="mk-serif text-xl mb-1" style={{ fontWeight: 700 }}>Painel do Barbeiro</div>
          <div className="text-sm mb-6" style={{ color: "var(--muted2)" }}>Acesso restrito à equipe.</div>
          <input
            type="password" className="mk-input text-center" placeholder="Senha de acesso" value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { pw === PANEL_PASSWORD ? setAuthed(true) : setPwError("Senha incorreta."); } }}
          />
          {pwError && <div className="text-xs mt-2" style={{ color: "var(--oxblood-light)" }}>{pwError}</div>}
          <button className="mk-btn mk-btn-primary w-full mt-4" onClick={() => (pw === PANEL_PASSWORD ? setAuthed(true) : setPwError("Senha incorreta."))}>
            Entrar
          </button>
          <div className="text-xs mt-5" style={{ color: "#6f6555" }}>Demonstração · senha: {PANEL_PASSWORD}</div>
        </div>
      </div>
    );
  }
  return <Dashboard bookings={bookings} updateBooking={updateBooking} reload={reload} />;
}
