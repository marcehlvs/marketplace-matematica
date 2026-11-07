#!/usr/bin/env node
/**
 * Saca capturas de tus apps publicadas (escritorio y celular) y las deja en public/capturas/.
 *
 *   npm i -D playwright && npx playwright install chromium     (una sola vez)
 *   node scripts/capturar.mjs                                  (usa catalogo-importado.json)
 *   node scripts/capturar.mjs --archivo otro.json              (otro archivo de apps)
 *   node scripts/capturar.mjs --forzar                         (vuelve a sacar las que ya existen)
 *   node scripts/capturar.mjs --espera 5000                    (más tiempo si la app tarda en cargar)
 *
 * Actualiza el JSON con `coverUrl` y `screenshots`; después lo subís desde Admin → Apps → Importar.
 * Las imágenes viajan con el sitio (no hace falta Firebase Storage). Si una app falla, sigue con las demás.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const file = join(process.cwd(), value('archivo', 'catalogo-importado.json'));
const outDir = join(process.cwd(), 'public', 'capturas');
const wait = Number(value('espera', '2500'));
const force = flag('forzar');

async function launch() {
  try {
    const { chromium } = await import('playwright');
    return await chromium.launch();
  } catch (e) {
    if (process.env.CHROME_PATH) {
      const { chromium } = await import('playwright-core');
      return await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] });
    }
    console.error('No pude abrir el navegador. Instalalo una vez con:\n  npm i -D playwright && npx playwright install chromium');
    console.error(`(${e.message.split('\n')[0]})`);
    process.exit(1);
  }
}

const exists = (p) => access(p).then(() => true, () => false);
const slugify = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let data;
try {
  data = JSON.parse(await readFile(file, 'utf8'));
} catch {
  console.error(`No encontré ${file}. Primero corré: node scripts/import-repos.mjs`);
  process.exit(1);
}
if (!Array.isArray(data.apps) || data.apps.length === 0) {
  console.error('El archivo no tiene apps.');
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const browser = await launch();
let ok = 0;
let failed = 0;

for (const app of data.apps) {
  const slug = slugify((app.source ?? app.title).split('/').pop());
  const desktop = `${slug}-escritorio.jpg`;
  const mobile = `${slug}-celular.jpg`;
  if (!force && (await exists(join(outDir, desktop))) && (await exists(join(outDir, mobile)))) {
    app.coverUrl = `/capturas/${desktop}`;
    app.screenshots = [`/capturas/${desktop}`, `/capturas/${mobile}`];
    console.log(`  ↷ ${app.title}: ya tenía capturas (usá --forzar para rehacerlas)`);
    continue;
  }
  try {
    for (const [name, size, isMobile] of [
      [desktop, { width: 1280, height: 720 }, false],
      [mobile, { width: 390, height: 844 }, true],
    ]) {
      const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1, isMobile, hasTouch: isMobile });
      const page = await context.newPage();
      const res = await page.goto(app.url, { waitUntil: 'networkidle', timeout: 30000 });
      if (res && res.status() >= 400) throw new Error(`la página respondió ${res.status()}`);
      await page.waitForTimeout(wait);
      await page.screenshot({ path: join(outDir, name), type: 'jpeg', quality: 82 });
      await context.close();
    }
    app.coverUrl = `/capturas/${desktop}`;
    app.screenshots = [`/capturas/${desktop}`, `/capturas/${mobile}`];
    ok++;
    console.log(`  ✔ ${app.title}`);
  } catch (e) {
    failed++;
    console.log(`  ✖ ${app.title}: ${e.message.split('\n')[0]}`);
  }
}

await browser.close();
await writeFile(file, JSON.stringify(data, null, 2));
console.log(`\nListo: ${ok} con capturas nuevas, ${failed} con error. Imágenes en public/capturas/.`);
if (failed) console.log('Las que fallaron siguen sin captura: revisá su URL en el JSON y volvé a correr el script.');
