/** Cinta de temas que se desplaza sin parar. Es decorativa (los temas reales están en el catálogo). */
export function Marquee({ items }: { items: readonly string[] }) {
  // El contenido se repite para que el corte del bucle (-50%) sea invisible.
  const track = [...items, ...items, ...items, ...items];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-border py-5 md:py-7">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="display flex items-center gap-10 text-3xl md:text-5xl">
            <span className="text-transparent [-webkit-text-stroke:1px_var(--color-border-strong)]">{item}</span>
            <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
