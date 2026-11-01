import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

/** Párrafo cuyas palabras se "encienden" una a una a medida que se hace scroll. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });

  if (reduce) return <p className={className}>{text}</p>;

  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = (i / words.length) * 0.8;
        return <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={[start, start + 0.2]} />;
      })}
    </p>
  );
}
