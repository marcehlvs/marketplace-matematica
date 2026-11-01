import type { AppData, WithId } from '../types';

/**
 * Datos de ejemplo para el MODO DEMO (sin Firebase).
 * Son marcadores de posición: nombres, niveles, precios y URLs se reemplazan
 * por los reales desde el panel Admin.
 */
const now = Date.now();
const day = 86_400_000;

export const demoApps: WithId<AppData>[] = [
  {
    id: 'geometria',
    title: 'Geometría en acción',
    summary: 'Construcciones, ángulos y figuras paso a paso, con ejercicios interactivos.',
    description:
      'Recorrido interactivo por los contenidos de geometría. Cada tema se explica paso a paso y se practica con ejercicios que muestran la resolución.',
    level: '1.º año',
    topics: ['Geometría'],
    price: 6500,
    url: 'https://example.com/geometria',
    published: true,
    createdAt: now - day,
  },
  {
    id: 'integrales',
    title: 'Integrales paso a paso',
    summary: 'Resolución guiada de integrales con cada paso explicado.',
    description:
      'Aprendé a integrar viendo cada paso de la resolución: sustitución, partes y más. Ideal para repasar antes de una evaluación.',
    level: '6.º año',
    topics: ['Análisis'],
    price: 8500,
    url: 'https://example.com/integrales',
    published: true,
    createdAt: now - 2 * day,
  },
  {
    id: 'derivadas',
    title: 'Derivadas',
    summary: 'Reglas de derivación con editor de fracciones y exponentes.',
    description:
      'Practicá derivadas con un editor matemático cómodo y recibí la resolución detallada de cada ejercicio.',
    level: '5.º año',
    topics: ['Análisis', 'Funciones'],
    price: 8500,
    url: 'https://example.com/derivadas',
    published: true,
    createdAt: now - 3 * day,
  },
  {
    id: 'estadistica',
    title: 'Estadística',
    summary: 'Datos agrupados, medidas de posición y dispersión.',
    description:
      'Problemas de estadística con datos agrupados, media, mediana, desvío y coeficiente de variación, con su resolución.',
    level: '4.º año',
    topics: ['Estadística'],
    price: 7000,
    url: 'https://example.com/estadistica',
    published: true,
    createdAt: now - 4 * day,
  },
  {
    id: 'funcion-lineal',
    title: 'Rectas en acción',
    summary: 'Videojuego para aprender función lineal jugando.',
    description:
      'Un videojuego educativo para entender pendiente y ordenada al origen. Cada nivel plantea un desafío distinto.',
    level: '3.º año',
    topics: ['Funciones', 'Álgebra'],
    price: 5500,
    url: 'https://example.com/funcion-lineal',
    published: true,
    createdAt: now - 5 * day,
  },
  {
    id: 'decimales',
    title: 'La pizarra de los decimales',
    summary: 'Juego por equipos sobre expresiones decimales. Versión gratuita.',
    description:
      'Juego para el aula con equipos y puntajes sobre expresiones decimales exactas, periódicas puras y mixtas. Es gratis para que pruebes cómo funciona el catálogo.',
    level: '1.º año',
    topics: ['Aritmética'],
    price: 0,
    url: 'https://example.com/decimales',
    published: true,
    createdAt: now - 6 * day,
  },
];
