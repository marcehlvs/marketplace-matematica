# Mate Apps — marketplace de apps de matemática

Sitio para **vender apps de matemática** ya hechas y **ofrecer la creación de apps para otras materias** (precio a convenir).
Nombre provisorio: **Mate Apps** (se cambia en `src/config.ts` y `index.html`).

**Stack:** TypeScript · React 19 · Vite · Tailwind CSS 4 · React Router · Firebase (Auth + Firestore + Hosting) · Radix UI (modal accesible) · react-hook-form + zod.

---

## Estado actual

### ✅ Hecho

- **Proyecto base** configurado (Vite + TypeScript estricto + Tailwind + Firebase).
- **Modo demo**: si no hay variables de Firebase, la app funciona igual con datos de ejemplo guardados en el navegador (localStorage). Permite probar todo sin tocar Firebase.
- **Sistema de diseño** (`src/index.css`, `src/components/ui/`):
  - Tokens de color, tipografía, radios y sombras en un solo lugar, con **modo claro y oscuro** (toggle + preferencia del sistema, sin parpadeo al cargar).
  - Componentes consistentes: `Button`, `Card`, `Badge`, `Input/Textarea/Select`, `Modal` (Radix), `Skeleton`, `EmptyState`, `ErrorState`, `Toast`.
  - **Estados** contemplados en cada pantalla: cargando, vacío, error y éxito.
  - **Accesibilidad**: contraste AA, foco visible, enlace "Saltar al contenido", `aria-label` en botones de solo ícono, errores de formulario con `role="alert"`, tabs con teclado, `prefers-reduced-motion`.
  - **Responsive**: diseñado mobile-first para 375 / 768 / 1280px+ (menú hamburguesa en móvil, grillas de 1 → 2 → 3 columnas). *Pendiente revisarlo a ojo en el navegador.*
  - Verificado hasta ahora: `npm run typecheck` y `npm run build` pasan sin errores. Todavía no se probó en un navegador real.
- **Pantallas**: Inicio, Catálogo (búsqueda + filtros por año y tema), Detalle de app, Servicios (formulario de presupuesto), Mi biblioteca, Login/Registro (Google + email), 404.
- **Panel Admin** (`/admin`, solo rol admin): gestión de apps (crear, editar, publicar/despublicar), pedidos (aprobar → otorga acceso, rechazar) y presupuestos (cambiar estado).
- **Compra abstracta** (`src/services/payments/`): las pantallas hablan con una interfaz `PaymentProvider`. Hoy está `ManualProvider` (apps gratis = acceso inmediato; apps pagas = pedido pendiente que aprueba el admin). Mercado Pago se enchufa después sin rehacer pantallas.
- **Reglas de seguridad de Firestore** (`firestore.rules`) pensadas para el plan gratuito.

### ⏳ Falta hacer

**Para poner el sitio online (plan gratuito)**
- [ ] Crear/elegir el proyecto Firebase, activar **Authentication** (Google y email/contraseña) y **Firestore**.
- [ ] Copiar `.env.example` a `.env.local` y completar las 4 variables.
- [ ] Publicar las reglas: `firebase deploy --only firestore:rules`.
- [ ] Seguir **[PUBLICAR.md](./PUBLICAR.md)**: crear el proyecto Firebase, publicar reglas, crear el primer admin y desplegar el sitio.
- [ ] Cargar las apps reales: `node scripts/import-repos.mjs` genera `catalogo-importado.json` desde las cuentas de GitHub (excluye lo que no es de una materia; se edita en `scripts/import-config.json`) y se sube en Admin → Apps → "Importar catálogo". Entra todo como borrador: faltan revisar precios, portadas y URLs.
- [ ] Definir marca definitiva (nombre, color primario en `src/index.css`, logo/favicon).
- [ ] (Opcional) Agregar una pieza en primer plano para la portada: `public/media/hero.png|webp|webm|mp4` (ver "Diseño y portada animada").
- [ ] Reemplazar las portadas generadas por capturas reales de cada app (campo "URL de la portada" en `/admin`).
- [ ] Desplegar en Hosting: `npm run build` y `firebase deploy --only hosting`.
- [ ] Agregar el dominio del sitio a "Dominios autorizados" en Authentication.

**Calidad**
- [ ] Revisar la app a mano en 375 / 768 / 1280px y en modo oscuro.
- [ ] Pasar Lighthouse y axe (accesibilidad) y corregir lo que marquen.
- [ ] Tests (por ejemplo Vitest + Testing Library) para formularios y el flujo de compra.
- [ ] Textos legales: términos, política de privacidad y datos de contacto.
- [ ] Optimizar el tamaño del bundle (hoy ~1 MB, ~330 KB gzip, sobre todo por Firebase): cargar el panel Admin con `React.lazy` y dividir el código.

**Cuando se mejore el plan (Blaze) — Mercado Pago**
- [ ] Pasar el proyecto a Blaze (mantiene la cuota gratuita; configurar alertas de presupuesto).
- [ ] Cloud Function `createPreference` (callable): crea la preferencia de pago en Mercado Pago y devuelve la URL de pago.
- [ ] Cloud Function `mpWebhook`: recibe la notificación, **verifica el pago contra la API de Mercado Pago** y escribe el `entitlement` con el Admin SDK.
- [ ] Crear `MercadoPagoProvider` (implementa `PaymentProvider`, devuelve `{ kind: 'redirect', url }`) y cambiar una línea en `src/services/payments/index.ts`.
- [ ] Páginas de retorno (pago exitoso / pendiente / fallido).
- [ ] Endurecer reglas: `entitlements` pasa a escritura solo-admin/Functions (quitar el permiso de reclamar apps gratuitas desde el cliente o moverlo a una Function).
- [ ] Opcional: Cloud Storage para portadas (hoy se usan URLs o el degradé por defecto) y emails de aviso (Extensions o Functions).

---

## Limitación importante (leer antes de cobrar)

En el plan gratuito **no hay servidor propio**, así que el control de "quién compró" vive en Firestore y en la interfaz.
Eso alcanza para armar y probar todo, pero **cada app de matemática es un sitio aparte con su propia URL**, y cualquiera que la conozca podría abrirla.
Antes de cobrar en serio hay que decidir cómo proteger el acceso a cada app (por ejemplo, que la app valide un token emitido por una Cloud Function). Por eso la integración de pagos y el control de acceso van juntos en la etapa Blaze.

También: el formulario de presupuestos acepta envíos de cualquier visitante (con límites de tamaño en las reglas). Para evitar spam conviene activar **Firebase App Check** más adelante.

---

## Diseño y portada animada

Estética inspirada en sitios tipo "portfolio cinematográfico": **oscuro por defecto**, títulos gigantes en tipografía ancha (Archivo, peso 900), barra de navegación flotante de vidrio, degradé violeta de marca, texto que se "enciende" al hacer scroll, botones magnéticos y contadores animados. Hay modo claro con el botón del sol/luna.

- Librería de animación: `motion` (`src/components/motion/`: `Reveal`, `ScrollText`, `Magnetic`, `CountUp`).
- Portada: `src/components/home/` (`Hero`, `MathField` = fondo de funciones animadas en canvas, `HeroMedia` = tu video/imagen, `Marquee`).
- Todo respeta **"reducir movimiento"** del sistema (sin animaciones) y los efectos magnéticos solo actúan con mouse.
- Colores, tipografías, radios y sombras: `src/index.css`. Para otra paleta, cambiar `--color-brand-from`, `--color-brand-to` y `--color-primary` (en claro y oscuro).

### Video y piezas de la portada (hechos con otra IA)

La portada tiene **dos espacios** en `public/media/`. No hay que tocar código: si el archivo existe se usa; si no, se ve el fondo de funciones animado que se dibuja en código.

**1. Video de FONDO (detrás del título)** — ya incluido
- `hero-bg.mp4` (o `hero-bg.webm`) + `hero-bg-poster.webp` (imagen que se ve mientras carga, con "reducir movimiento" o si el celular bloquea el autoplay).
- El incluido es el video de curvas violeta/magenta con ecuaciones: 1600×900, 24 fps, 6,9 s, **1,5 MB**, sin audio, con el loop cerrado con un fundido.
- Se pausa solo cuando la portada sale de pantalla.
- Para cambiarlo, reemplazá los dos archivos. Si el nuevo video no cierra bien el loop, este comando lo comprime y lo cierra (reemplazar `X` por el largo del fundido en segundos y `FIN` por `duración - X`):
  ```
  ffmpeg -i original.mp4 -an -filter_complex "[0:v]scale=1600:-2,fps=24,split=3[a][b][c];[a]trim=0:X,setpts=PTS-STARTPTS[head];[b]trim=X:FIN,setpts=PTS-STARTPTS[mid];[c]trim=FIN:DURACION,setpts=PTS-STARTPTS[tail];[tail][head]xfade=transition=fade:duration=X:offset=0[x];[mid][x]concat=n=2:v=1:a=0[v]" -map "[v]" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart hero-bg.mp4
  ```
  y el póster: `ffmpeg -ss 3 -i hero-bg.mp4 -frames:v 1 -c:v libwebp -quality 72 hero-bg-poster.webp`.

**2. Pieza en PRIMER PLANO (delante del título)** — opcional, todavía no hay
- Copiá UN archivo: `hero.webm`, `hero.mp4`, `hero.webp` o `hero.png` (se prueban en ese orden). Aparece centrado abajo, delante de las letras, como el personaje de las referencias.
- **Con fondo transparente** (ideal): PNG/WebP con alfa, o WebM con alfa.
- **Con fondo negro**: video y `HERO_MEDIA_BLACK_BACKGROUND = true` en `src/config.ts`.
- Ideas: personaje 3D amigable con compás/transportador/regla, o una forma geométrica 3D flotando (poliedro, cinta de Möbius). Una imagen liviana rinde más que un video en celulares de escuela.
- Paleta que combina: violeta `#6c47ff`, magenta `#ff5ad9`, cian `#5ee6ff` sobre negro.

## Plan para proteger las apps (a decidir antes de cobrar)

**Por qué no alcanza con "un token dentro de la app":** cada app es una web estática. Todo lo que está en su JavaScript se descarga en el navegador, así que cualquier chequeo hecho *dentro* de la app se puede saltear. Además, si la app ya está publicada en una URL pública (por ejemplo GitHub Pages) o su repo es público, el código y el link ya están a la vista. La verificación tiene que hacerla un **servidor que decida si entrega o no los archivos**.

**Camino recomendado — una "puerta" (gateway) delante de las apps:**
1. Las apps vendidas se sirven desde un único lugar (p. ej. un Cloudflare Worker con los builds de todas las apps en `play.tudominio.com/<appId>/`). Las versiones públicas actuales se despublican y los repos pasan a privados.
2. En "Abrir app", el marketplace obtiene el token del usuario (`user.getIdToken()`) y lo manda a la puerta.
3. La puerta verifica la firma del token de Firebase y lee `entitlements/{uid}_{appId}` por la API REST de Firestore **usando el token del propio usuario**; las reglas ya dejan leer ese documento solo a su dueño, así que si responde OK, compró.
4. Si compró, la puerta guarda una cookie de sesión corta (HttpOnly, 1–2 h) y entrega los archivos. Sin cookie válida: redirige al marketplace.
- Esta parte **no requiere Blaze** (el plan gratuito de Cloudflare Workers alcanza para empezar). Mercado Pago sí requiere Functions o un Worker adicional para el webhook.
- Alternativa con Blaze: Cloud Functions que verifican el acceso y sirven los archivos (Hosting reescribe a la función).

**Límite que conviene asumir:** esto evita que los links circulen y que entre cualquiera, pero quien compró descarga el JS de la app. No impide que un comprador la copie o comparta su cuenta; eso solo se controla con lógica en servidor.

- [ ] Decidir hosting de las apps vendidas y construir la puerta.
- [ ] Despublicar las versiones públicas actuales y pasar los repos a privados.
- [ ] Cambiar el botón "Abrir app" para ir por la puerta (hoy abre `app.url` directo).

## Cómo correrlo

```bash
npm install
cp .env.example .env.local   # opcional: sin esto corre en modo demo
npm run dev                  # http://localhost:5173
```

Otros comandos: `npm run typecheck`, `npm run build`, `npm run preview`.

En **modo demo**, en `/login` aparecen los botones "Entrar como usuario" y "Entrar como admin" para probar todo el flujo (comprar → pedido pendiente → aprobar en `/admin` → la app aparece en "Mi biblioteca"). Para reiniciar los datos de demo, borrar el almacenamiento local del sitio.

## Configurar Firebase

1. Consola de Firebase → crear proyecto (plan Spark/gratuito).
2. **Authentication** → Sign-in method → activar *Google* y *Correo electrónico/contraseña*.
3. **Firestore Database** → crear base de datos.
4. Configuración del proyecto → Tus apps → agregar app web → copiar la configuración a `.env.local`.
5. Instalar la CLI (`npm i -g firebase-tools`), `firebase login`, `firebase init` (elegir el proyecto; no sobrescribir `firebase.json` ni las reglas) y `firebase deploy --only firestore:rules`.

### Primer admin

1. Ingresar al sitio una vez con tu cuenta (se crea `users/{tu-uid}` con `role: "user"`).
2. En la consola de Firestore, abrir `users/{tu-uid}` y cambiar el campo `role` a `admin`.
3. Recargar el sitio: aparece "Admin" en el menú.

## Estructura

```
src/
  index.css              tokens de diseño (claro/oscuro)
  config.ts              marca, años, temas, materias
  types.ts               modelos de datos
  components/
    ui/                  sistema de diseño (Button, Card, Field, Modal, Toast, estados…)
    layout/              Header, Footer, Layout, Container/PageHeader
    AppCard, AppCover, AppGrid, RequireAuth
  context/               AuthContext, ThemeContext
  hooks/useAsync.ts      loading / error / data / reload
  services/
    store.ts             acceso a datos: Firestore o localStorage (modo demo)
    catalog.ts, library.ts, quotes.ts
    payments/            PaymentProvider + ManualProvider
  pages/                 Home, Catalog, AppDetail, Services, Library, Login, NotFound, admin/
firestore.rules          reglas de seguridad
firebase.json            Hosting (SPA) + Firestore
```

## Modelo de datos (Firestore)

| Colección | Documento | Quién escribe |
|---|---|---|
| `users` | `{uid}`: `email`, `name`, `role` (`user` / `admin`) | cada persona crea el suyo; solo admin cambia roles |
| `apps` | `title`, `summary`, `description`, `level`, `topics[]`, `price`, `url`, `coverUrl?`, `published`, `createdAt` | admin |
| `orders` | `uid`, `email`, `appId`, `appTitle`, `amount`, `status`, `createdAt` | crea quien compra; aprueba admin |
| `entitlements` | `{uid}_{appId}`: `uid`, `appId`, `createdAt` | admin (o la persona, solo apps gratis) |
| `quotes` | `name`, `email`, `subject`, `description`, `budget?`, `status`, `createdAt` | cualquiera crea; lee/gestiona admin |

## Decisiones de diseño (para mantener la consistencia)

- Un **solo CTA primario** por pantalla; el resto es `secondary` o `ghost`.
- **Nada de colores sueltos** en las pantallas: se usan los tokens (`bg-surface`, `text-text-muted`, `border-border`, `bg-primary`…). Para cambiar la paleta se edita `src/index.css`.
- **Nada de controles sueltos**: botones, inputs, selects y modales siempre salen de `components/ui`.
- Cada lista o formulario cubre **cargando / vacío / error / éxito**.
- Imágenes con `alt` descriptivo; las decorativas con `alt=""`.
