#!/usr/bin/env node
/**
 * Arma el catálogo a partir de tus repos públicos de GitHub.
 *
 *   node scripts/import-repos.mjs
 *   node scripts/import-repos.mjs cuenta1 cuenta2        (otras cuentas)
 *
 * Genera `catalogo-importado.json` en la raíz del proyecto. Después lo subís desde
 * Admin → Apps → "Importar catálogo". Todo entra como BORRADOR: revisás y publicás.
 *
 * Qué entra y qué no: se edita en scripts/import-config.json (exclude / excludePatterns).
 * Sin token de GitHub alcanza (límite 60 pedidos/hora). Si hace falta: GITHUB_TOKEN=... node ...
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(await readFile(join(here, 'import-config.json'), 'utf8'));
const API = process.env.GITHUB_API ?? 'https://api.github.com';
const RAW = process.env.GITHUB_RAW ?? 'https://raw.githubusercontent.com';
const accounts = process.argv.slice(2).length ? process.argv.slice(2) : config.accounts;

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'mate-apps-import' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const LEVELS = ['1.º año', '2.º año', '3.º año', '4.º año', '5.º año', '6.º año'];
const TOPIC_RULES = [
  ['Aritmética', /aritm|decimal|fracci|multiplic|tabla|enteros|n[uú]meros|potenc|factor/i],
  ['Álgebra', /[aá]lgebra|ecuaci|polinom|factor|m[oó]dulo|inecuaci/i],
  ['Geometría', /geometr|tri[aá]ngulo|[aá]ngulo|cuerpos|per[ií]metro|[aá]rea/i],
  ['Funciones', /funci[oó]n|rectas|lineal|cuadr[aá]tica|gr[aá]fic/i],
  ['Estadística', /estad[ií]stica|probabil|media|desviaci/i],
  ['Análisis', /an[aá]lisis|derivad|integral|l[ií]mite|barrow/i],
];

const matchesAny = (text, patterns) => patterns.some((p) => new RegExp(p, 'i').test(text));

async function getJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} en ${url}`);
  return res.json();
}

async function listRepos(account) {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await getJson(`${API}/users/${account}/repos?per_page=100&page=${page}&sort=updated`);
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

/** Primer párrafo útil del README (sin títulos, badges ni imágenes). */
async function readmeInfo(owner, repo, branch) {
  for (const b of [branch, 'main', 'master']) {
    try {
      const res = await fetch(`${RAW}/${owner}/${repo}/${b}/README.md`);
      if (!res.ok) continue;
      const text = await res.text();
      const para = text
        .split(/\n\s*\n/)
        .map((p) => p.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*_`]/g, '').replace(/\s+/g, ' ').trim())
        .find((p) => p.length > 40 && !/^(npm|yarn|pnpm|git|vite|react \+)/i.test(p));
      const heading = text.match(/^#\s+(.+)$/m)?.[1]?.replace(/[`*_#]|!?\[[^\]]*\]\([^)]*\)/g, '').trim();
      if (para) return { summary: para.slice(0, 300), title: heading && heading.length <= 60 ? heading : '' };
    } catch {
      /* se prueba la siguiente rama */
    }
  }
  return { summary: '', title: '' };
}

const prettyTitle = (name) =>
  name.replace(/[-_]+/g, ' ').replace(/\bapp\b/i, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim().replace(/^./, (c) => c.toUpperCase());

function guessLevel(text) {
  // "1.º año", "1er año", "1.º y 2.º año"... se toma el más bajo que aparezca.
  const found = [...text.matchAll(/\b([1-6])\s*(?:\.?\s*[º°]|er|ro|do|to|ero)(?=\s|\b)(?:\s*a[ñn]o)?/gi)].map((m) => Number(m[1]));
  const withYear = [...text.matchAll(/\b([1-6])\s*(?:\.?\s*[º°]|er|ro|do|to|ero)?\s*a[ñn]o\b/gi)].map((m) => Number(m[1]));
  const all = [...found, ...withYear].filter((n) => !/\b\d\s*(?:er|ro|do|to)\s*grado/i.test(text) || withYear.includes(n));
  return all.length ? LEVELS[Math.min(...all) - 1] : null;
}

const apps = [];
const excluded = [];
const seen = new Set();

for (const account of accounts) {
  let repos;
  try {
    repos = await listRepos(account);
  } catch (e) {
    console.error(`No pude leer la cuenta ${account}: ${e.message}`);
    process.exitCode = 1;
    continue;
  }
  console.log(`${account}: ${repos.length} repos`);

  for (const r of repos) {
    const label = `${account}/${r.name}`;
    const haystack = `${r.name} ${r.description ?? ''} ${(r.topics ?? []).join(' ')}`;
    if (r.fork) { excluded.push({ repo: label, motivo: 'es un fork' }); continue; }
    if (r.archived) { excluded.push({ repo: label, motivo: 'archivado' }); continue; }
    if (config.exclude.includes(r.name)) { excluded.push({ repo: label, motivo: 'en tu lista de exclusión' }); continue; }
    if (matchesAny(r.name, config.excludePatterns)) { excluded.push({ repo: label, motivo: 'no parece una app de materia' }); continue; }

    const { summary: readme, title: readmeTitle } = await readmeInfo(account, r.name, r.default_branch);
    const text = `${haystack} ${readme}`;
    const topics = TOPIC_RULES.filter(([, re]) => re.test(text)).map(([t]) => t);
    const isSchool = matchesAny(haystack, config.schoolKeywords);
    const level = guessLevel(text);
    const url = r.homepage?.startsWith('http') ? r.homepage : `https://${account}.github.io/${r.name}/`;

    // Mismo nombre en dos cuentas (p. ej. versión "PRO"): se marca para decidir cuál queda.
    const key = r.name.toLowerCase().replace(/[^a-z]/g, '');
    const duplicate = seen.has(key);
    seen.add(key);

    const summary = (r.description || readme || 'Completar descripción.').slice(0, 160);
    const needsReview = [];
    if (!isSchool) needsReview.push('no pude confirmar que sea de una materia');
    if (!level) needsReview.push('nivel sin detectar (puse 1.º año)');
    if (!topics.length) needsReview.push('tema sin detectar');
    if (duplicate) needsReview.push('nombre parecido a otro repo');
    if (!r.homepage) needsReview.push('URL supuesta (GitHub Pages): verificala');

    apps.push({
      title: readmeTitle || prettyTitle(r.name),
      summary,
      description: readme || r.description || '',
      level: level ?? '1.º año',
      topics: topics.length ? topics : ['Álgebra'],
      price: 0,
      url,
      published: false,
      createdAt: Date.parse(r.created_at) || Date.now(),
      source: label,
      needsReview,
    });
  }
}

const out = join(process.cwd(), 'catalogo-importado.json');
await writeFile(out, JSON.stringify({ generado: new Date().toISOString(), apps, excluidos: excluded }, null, 2));

console.log(`\nApps para revisar: ${apps.length}`);
for (const a of apps) console.log(`  ✔ ${a.source}${a.needsReview.length ? `   ⚠ ${a.needsReview.join('; ')}` : ''}`);
console.log(`\nExcluidos: ${excluded.length}`);
for (const e of excluded) console.log(`  ✖ ${e.repo}  (${e.motivo})`);
console.log(`\nListo → ${out}\nSubilo desde Admin → Apps → "Importar catálogo".`);
