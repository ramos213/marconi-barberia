// Motivo decorativo baseado nas luminárias geométricas de cobre reais da loja.
export default function PendantLight({ size = 64, glow = true, style }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 60 84" style={style} className="mk-hex">
      <line x1="30" y1="0" x2="30" y2="18" stroke="var(--divider)" strokeWidth="1.5" />
      <polygon points="30,18 46,27 46,45 30,54 14,45 14,27" fill="none" stroke="var(--copper)" strokeWidth="1.6" />
      <polygon points="30,26 39,31 39,41 30,46 21,41 21,31" fill="none" stroke="var(--copper)" strokeWidth="1" opacity="0.5" />
      {glow && <circle className="mk-glow-dot" cx="30" cy="36" r="3.2" fill="var(--copper-light)" />}
    </svg>
  );
}
