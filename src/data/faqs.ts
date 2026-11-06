import type { FaqItem } from '../components/ui/Faq';

/** Preguntas frecuentes. Describen cómo funciona hoy la compra (manual); se actualizan al sumar Mercado Pago. */
export const faqs: FaqItem[] = [
  {
    q: '¿Cómo compro una app?',
    a: 'Entrá al catálogo, elegí la app y tocá “Comprar”. Las apps gratuitas quedan disponibles en “Mi biblioteca” al instante. En las pagas se genera un pedido y te contactamos para coordinar el pago; cuando lo confirmamos, la app aparece en tu biblioteca.',
  },
  {
    q: '¿Necesito crear una cuenta?',
    a: 'Sí, para comprar y guardar tus apps. Podés entrar con Google o con email y contraseña.',
  },
  {
    q: '¿Dónde uso la app después de comprarla?',
    a: 'En “Mi biblioteca” encontrás todas tus apps con el botón “Abrir app”. Funcionan desde el navegador, en computadora, tablet o celular.',
  },
  {
    q: '¿Puedo usarla en clase con mis estudiantes?',
    a: 'Sí, las apps están pensadas para el aula. Si querés usarla en toda una escuela, escribinos desde “Servicios” y vemos una licencia institucional.',
  },
  {
    q: '¿Pueden hacer una app para otra materia?',
    a: 'Sí. Contanos qué necesitás en el formulario de “Servicios” (materia, año y ejemplos) y te respondemos con una propuesta. El precio se acuerda según el trabajo.',
  },
  {
    q: '¿Qué pasa si una app falla o tiene un error?',
    a: 'Escribinos por el formulario de “Servicios” indicando el nombre de la app y qué ocurrió, y lo revisamos.',
  },
];
