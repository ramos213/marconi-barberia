import { Scissors, ArrowLeft } from "lucide-react";

export default function Header({ mode, goToSite }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header className="mk-topbar">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Scissors size={20} color="var(--copper)" />
          <span className="mk-serif mk-wordmark text-lg" style={{ fontWeight: 700 }}>MARCONI</span>
          <span className="mk-mono text-xs hidden sm:inline" style={{ color: "var(--muted2)" }}>
            {mode === "panel" ? "· Painel da equipe" : "· Est. 2009"}
          </span>
        </div>

        {mode === "site" ? (
          <>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <span className="mk-navlink" onClick={() => scrollTo("servicos")}>Serviços</span>
              <span className="mk-navlink" onClick={() => scrollTo("fotos")}>Fotos</span>
              <span className="mk-navlink" onClick={() => scrollTo("equipe")}>Equipe</span>
              <span className="mk-navlink" onClick={() => scrollTo("local")}>Local</span>
            </nav>
            <button className="mk-btn mk-btn-primary hidden sm:inline-flex" onClick={() => scrollTo("agendar")}>
              Agendar horário
            </button>
          </>
        ) : (
          <button className="mk-btn mk-btn-ghost" onClick={goToSite}><ArrowLeft size={14} /> Voltar ao site</button>
        )}
      </div>
    </header>
  );
}
