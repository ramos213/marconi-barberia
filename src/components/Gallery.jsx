import { GALLERY } from "../data/gallery.js";

export default function Gallery() {
  return (
    <section id="fotos" className="max-w-6xl mx-auto px-5 py-16">
      <div className="mk-eyebrow mb-2">A casa por dentro</div>
      <h2 className="mk-serif text-3xl mb-8" style={{ fontWeight: 700 }}>Fotos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GALLERY.map((g, i) => (
          <div key={i} className={`mk-photo ${i === 0 ? "mk-photo-wide" : ""}`}>
            <img src={g.src} alt={g.caption} loading="lazy" />
            <div className="mk-photo-caption">{g.caption}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
