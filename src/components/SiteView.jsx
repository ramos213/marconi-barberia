import { Star, MapPin, Phone, ChevronRight } from "lucide-react";
import { SERVICES } from "../data/services.js";
import { BARBERS } from "../data/barbers.js";
import { money } from "../utils/time.js";
import PendantLight from "./PendantLight.jsx";
import RazorDivider from "./RazorDivider.jsx";
import Gallery from "./Gallery.jsx";
import BookingForm from "./BookingForm.jsx";

export default function SiteView({ bookings, addBooking, loaded }) {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mk-eyebrow mb-4">República · São Paulo · Desde 2009</div>
            <h1 className="mk-serif text-5xl sm:text-6xl leading-none" style={{ fontWeight: 700 }}>
              Barba feita,<br />conversa boa,<br /><span style={{ color: "var(--copper-light)", fontStyle: "italic", fontWeight: 500 }}>sem pressa.</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed" style={{ color: "var(--muted2)", maxWidth: 440 }}>
              Cadeiras de couro, navalha afiada e uma equipe que trata cada corte como o único da tarde.
              Agende em menos de um minuto e escolha seu barbeiro de confiança.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="mk-btn mk-btn-primary" onClick={() => document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" })}>
                Agendar horário <ChevronRight size={16} />
              </button>
              <div className="flex items-center gap-1.5 text-sm">
                <Star size={16} fill="var(--copper-light)" color="var(--copper-light)" />
                <span style={{ fontWeight: 700 }}>4,8</span>
                <span style={{ color: "var(--muted2)" }}>(778 avaliações)</span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:flex justify-center items-center" style={{ height: 320 }} aria-hidden="true">
            <PendantLight size={90} style={{ position: "absolute", top: 0, left: 30 }} />
            <PendantLight size={70} style={{ position: "absolute", top: 40, left: 160 }} />
            <PendantLight size={110} style={{ position: "absolute", top: -10, left: 240 }} />
            <PendantLight size={60} style={{ position: "absolute", top: 70, left: 340 }} />
          </div>
        </div>
      </section>

      <RazorDivider />

      {/* SERVICES */}
      <section id="servicos" className="max-w-3xl mx-auto px-5 py-16">
        <div className="mk-eyebrow mb-2">O que fazemos</div>
        <h2 className="mk-serif text-3xl mb-8" style={{ fontWeight: 700 }}>Serviços</h2>
        <div>
          {SERVICES.map((s) => (
            <div className="mk-service-row" key={s.id}>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="mk-serif text-lg" style={{ fontWeight: 600 }}>{s.name}</span>
                </div>
                <div className="text-sm mt-0.5" style={{ color: "var(--muted2)" }}>{s.desc} · {s.duration} min</div>
              </div>
              <div className="mk-dots" />
              <div className="mk-mono text-lg" style={{ color: "var(--copper-light)", fontWeight: 600 }}>{money(s.price)}</div>
            </div>
          ))}
        </div>
      </section>

      <RazorDivider />

      <Gallery />

      <RazorDivider />

      {/* TEAM */}
      <section id="equipe" className="max-w-5xl mx-auto px-5 py-16">
        <div className="mk-eyebrow mb-2">Quem corta</div>
        <h2 className="mk-serif text-3xl mb-8" style={{ fontWeight: 700 }}>Equipe</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {BARBERS.map((b) => (
            <div className="mk-card p-6" key={b.id}>
              <div className="flex items-center justify-center rounded-full mx-auto mb-4" style={{ width: 64, height: 64, background: "var(--oxblood)" }}>
                <span className="mk-serif text-2xl">{b.name[0]}</span>
              </div>
              <div className="text-center">
                <div className="mk-serif text-lg" style={{ fontWeight: 600 }}>{b.name}</div>
                <div className="text-sm mt-1" style={{ color: "var(--muted2)" }}>{b.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RazorDivider />

      {/* ABOUT */}
      <section id="sobre" className="max-w-3xl mx-auto px-5 py-16">
        <div className="mk-eyebrow mb-2">Desde 2009</div>
        <h2 className="mk-serif text-3xl mb-6" style={{ fontWeight: 700 }}>Sobre a casa</h2>
        <p className="leading-relaxed" style={{ color: "var(--muted2)" }}>
          Concreto queimado, luminárias de cobre e cadeiras de couro vermelho que já viram décadas de conversa.
          A Marconi nasceu na Rua Marconi, no coração da República, e segue com a mesma ideia: um corte bem-feito
          não se apressa. Toalha quente, navalha afiada e atenção total ao que você pediu — nem um milímetro a mais.
        </p>
      </section>

      {/* BOOKING */}
      <section id="agendar" className="max-w-3xl mx-auto px-5 py-16">
        <div className="mk-eyebrow mb-2">Reserve sua cadeira</div>
        <h2 className="mk-serif text-3xl mb-8" style={{ fontWeight: 700 }}>Agendar horário</h2>
        <BookingForm bookings={bookings} addBooking={addBooking} loaded={loaded} />
      </section>

      <RazorDivider />

      {/* LOCATION / FOOTER */}
      <footer id="local" className="max-w-6xl mx-auto px-5 py-16 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="mk-eyebrow mb-3">Endereço</div>
          <div className="flex items-start gap-2" style={{ color: "var(--muted2)" }}>
            <MapPin size={16} className="mt-0.5" color="var(--copper)" />
            <span>Rua Marconi, 67 – República<br />São Paulo - SP, 01004-000</span>
          </div>
        </div>
        <div>
          <div className="mk-eyebrow mb-3">Contato</div>
          <div className="flex items-center gap-2" style={{ color: "var(--muted2)" }}>
            <Phone size={16} color="var(--copper)" /><span>(11) 99464-8174</span>
          </div>
        </div>
        <div>
          <div className="mk-eyebrow mb-3">Horário</div>
          <ul style={{ color: "var(--muted2)" }} className="space-y-1 mk-mono text-xs">
            <li>Seg – Sex: 09:00 – 20:00</li>
            <li>Sábado: 09:00 – 18:00</li>
            <li>Domingo: fechado</li>
          </ul>
        </div>
      </footer>
    </>
  );
}
