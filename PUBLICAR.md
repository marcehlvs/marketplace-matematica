# Publicar Mate Apps — paso a paso

Todo funciona con el plan gratuito de Firebase (Spark). Tiempo estimado: 30–40 minutos.
Antes de empezar: Node 20+ instalado y el proyecto abierto en una terminal (`npm install` hecho).

## 1. Crear el proyecto en Firebase

1. Entrá a <https://console.firebase.google.com> → **Agregar proyecto** → nombre (por ejemplo `mate-apps`). Podés desactivar Google Analytics.
2. **Compilación → Authentication → Comenzar** y habilitá dos métodos: **Google** y **Correo electrónico/contraseña**.
3. **Compilación → Firestore Database → Crear base de datos** → modo **producción** → ubicación `southamerica-east1` (São Paulo, la más cercana). La ubicación no se puede cambiar después.
4. **Configuración del proyecto (⚙) → Tus apps → `</>` Web** → registrá la app (sin Hosting por ahora). Te muestra un bloque `firebaseConfig`.

## 2. Conectar el proyecto (variables de entorno)

Copiá `.env.example` como `.env.local` y completá con los 4 valores del bloque `firebaseConfig`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Esas claves **no son secretas** (identifican el proyecto; la seguridad la dan las reglas del paso 3). El archivo `.env.local` igual está en `.gitignore`.

Reiniciá `npm run dev`. Si el aviso "Modo demo" desapareció, ya estás hablando con Firebase.

## 3. Publicar las reglas de seguridad

Sin este paso Firestore queda cerrado (nadie puede leer ni escribir).

```
npm install -g firebase-tools
firebase login
firebase use --add          # elegí tu proyecto y ponele el alias "default"
firebase deploy --only firestore:rules,firestore:indexes
```

## 4. Crear tu usuario admin

1. Con `npm run dev` abierto, entrá a `/login` y registrate (Google o email).
2. En la consola de Firebase → Firestore → colección `users` → tu documento (el id es tu UID).
3. Cambiá el campo `role` de `user` a `admin`.
4. Recargá el sitio: aparece **Admin** en el menú.

## 5. Cargar el catálogo desde tus repos de GitHub

El script lee las cuentas `marcehlvs` y `bejarano-matematica`, deja afuera lo que no es una app de materia (biblioteca, TPs de programación, etc.) y arma un archivo para importar.

```
node scripts/import-repos.mjs
```

- Muestra qué entra (✔, con avisos ⚠ si hay que revisar algo) y qué se excluye (✖, con el motivo).
- Para excluir o incluir otros repos, editá `scripts/import-config.json` (`exclude` = nombres exactos, `excludePatterns` = palabras) y volvé a correrlo.
- Si GitHub responde con límite de pedidos: `GITHUB_TOKEN=tu_token node scripts/import-repos.mjs`.

Después, en el sitio: **Admin → Apps → Importar catálogo** y elegí `catalogo-importado.json`.

Todo entra como **borrador y con precio $0**. Para cada app:

1. **Editar**: revisá título, descripción, nivel y temas (el script los adivina).
2. Verificá que la **URL** abra la app (si el repo no tenía "homepage", el script supone `https://cuenta.github.io/repo/`).
3. Cargá el **precio**. ⚠️ Si publicás con $0, cualquier persona registrada puede reclamarla gratis.
4. Pegá la **URL de la portada** (una captura de la app) y recién ahí **Publicar**.

Si dos repos son la misma app (por ejemplo `ecuaciones-modulo` y `EcuacionesConModulo`), dejá la mejor y no publiques la otra.

## 6. Publicar el sitio (Firebase Hosting)

```
npm run build
firebase deploy --only hosting
```

La terminal te da la URL: `https://TU-PROYECTO.web.app`. El login con Google ya funciona ahí porque Firebase autoriza ese dominio solo.

Para actualizar el sitio más adelante: `npm run build` y `firebase deploy --only hosting` otra vez.

### Dominio propio (opcional)
Firebase → Hosting → **Agregar dominio personalizado** y seguí los pasos de DNS. Después agregalo en **Authentication → Configuración → Dominios autorizados**.

## 7. Checklist antes de mostrarlo

- [ ] El aviso "Modo demo" no aparece.
- [ ] Entrás con tu cuenta y ves **Admin**.
- [ ] Probá desde una ventana privada con otra cuenta: el catálogo se ve, "Mi biblioteca" está vacía y `/admin` te rechaza.
- [ ] Apps con precio: el pedido queda **pendiente** y lo aprobás en Admin → Pedidos (por ahora el cobro es manual).
- [ ] Todas las apps publicadas tienen precio, portada y URL que abre.

## Lo que todavía NO está resuelto
- **Las apps siguen siendo públicas**: quien conozca la URL de GitHub Pages entra sin pagar. Ver "Plan para proteger las apps" en el README (hace falta saber dónde están publicadas).
- **Mercado Pago**: se agrega cuando pases al plan Blaze (ver README).
