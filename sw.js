/* Folheia: service worker
   Mude VERSAO a cada publicação para que o app avise "Nova versão disponível". */
'use strict';

const VERSAO = 'folheia-v1';
const CACHES = {
  app: `${VERSAO}-app`,             // esqueleto do app e PDF.js
  fontes: `${VERSAO}-fontes`,       // Google Fonts
  capas: `${VERSAO}-capas`,         // capas dos livros do Gutenberg
  catalogo: `${VERSAO}-catalogo`,   // respostas do Gutendex
  traducoes: `${VERSAO}-traducoes`  // tradução e dicionário
};
const MAX_CAPAS = 80;
const MAX_FONTES = 40;
const MAX_CATALOGO = 60;
const MAX_TRADUCOES = 500;

const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';

// arquivos do próprio app: se um deles falhar, a instalação falha (o app não abriria offline)
const ESQUELETO_LOCAL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];
// arquivos externos: se falharem, a instalação continua e eles entram no cache no primeiro uso
const ESQUELETO_EXTERNO = [
  PDFJS + 'pdf.min.js',
  PDFJS + 'pdf.worker.min.js'
];

/* ================= utilidades ================= */

// só guarda respostas completas: 200 ou opacas (no-cors). 206 (áudio com Range) não pode ir para o cache.
const podeGuardar = resp => resp && (resp.status === 200 || resp.type === 'opaque');

// uma resposta que veio de redirecionamento não pode ser usada numa navegação; recria sem a marca
async function semRedirect(resp) {
  if (!resp.redirected) return resp;
  return new Response(await resp.blob(), { status: resp.status, statusText: resp.statusText, headers: resp.headers });
}

async function guardar(nome, req, resp, max) {
  try {
    const cache = await caches.open(nome);
    await cache.put(req, await semRedirect(resp));
    if (max) await limitarCache(nome, max);
  } catch (e) {
    // cota cheia ou resposta recusada: o app segue funcionando sem este item no cache
    console.warn('[sw] não guardou', req.url || req, e);
  }
}

// apaga os itens mais antigos (as chaves vêm na ordem em que foram guardadas)
async function limitarCache(nome, max) {
  const cache = await caches.open(nome);
  const chaves = await cache.keys();
  const sobra = chaves.length - max;
  for (let i = 0; i < sobra; i++) await cache.delete(chaves[i]);
}

// busca com prazo máximo: uma requisição pendurada (ex.: capa num servidor lento)
// segura a versão antiga do service worker e atrasa o "Atualizar" até ela terminar
function buscar(req, prazo) {
  if (!prazo) return fetch(req);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), prazo);
  return fetch(req, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

/* ================= estratégias ================= */

async function cacheFirst(req, nome, { max, prazo } = {}) {
  const salvo = await caches.match(req, { cacheName: nome });
  if (salvo) return salvo;
  const resp = await buscar(req, prazo);
  if (podeGuardar(resp)) await guardar(nome, req, resp.clone(), max);
  return resp;
}

async function networkFirst(req, nome, { max, prazo } = {}) {
  try {
    const resp = await buscar(req, prazo);
    if (podeGuardar(resp)) guardar(nome, req, resp.clone(), max);
    return resp;
  } catch (e) {
    const salvo = await caches.match(req, { cacheName: nome });
    if (salvo) return salvo;
    throw e;
  }
}

async function staleWhileRevalidate(req, nome, evento, { max, prazo } = {}) {
  const salvo = await caches.match(req, { cacheName: nome });
  const rede = buscar(req, prazo).then(resp => {
    if (podeGuardar(resp)) return guardar(nome, req, resp.clone(), max).then(() => resp);
    return resp;
  });
  if (salvo) {
    // atualiza em segundo plano sem atrasar a resposta
    evento.waitUntil(rede.catch(() => {}));
    return salvo;
  }
  return rede;
}

// navegação: rede primeiro; offline, abre o index.html guardado
async function navegacao(req) {
  try {
    const resp = await fetch(req);
    if (resp.status === 200 && resp.type === 'basic') guardar(CACHES.app, './index.html', resp.clone());
    return resp;
  } catch (e) {
    const salvo = await caches.match('./index.html', { cacheName: CACHES.app }) ||
                  await caches.match('./', { cacheName: CACHES.app });
    if (salvo) return salvo;
    throw e;
  }
}

/* ================= roteamento ================= */

const HOSTS_TRADUCAO = ['translate.googleapis.com', 'api.mymemory.translated.net', 'api.dictionaryapi.dev'];
const CAPA = /^\/cache\/epub\/\d+\/pg\d+\.cover\.[a-z]+\.jpg$/i;

function rota(req, url, evento) {
  const host = url.hostname;

  if (url.origin === self.location.origin) return cacheFirst(req, CACHES.app);
  if (url.href.startsWith(PDFJS)) return cacheFirst(req, CACHES.app);

  if (host === 'fonts.googleapis.com') return staleWhileRevalidate(req, CACHES.fontes, evento, { max: MAX_FONTES, prazo: 10000 });
  // os arquivos de fonte têm a versão no endereço e nunca mudam: ficam até a próxima VERSAO
  if (host === 'fonts.gstatic.com') return cacheFirst(req, CACHES.fontes, { max: MAX_FONTES, prazo: 20000 });

  if (host === 'www.gutenberg.org' || host === 'gutenberg.org') {
    // só as capas; o texto dos livros (.txt) passa direto e vai para o IndexedDB pelo app
    return CAPA.test(url.pathname) ? cacheFirst(req, CACHES.capas, { max: MAX_CAPAS, prazo: 10000 }) : null;
  }
  if (host === 'gutendex.com') return networkFirst(req, CACHES.catalogo, { max: MAX_CATALOGO, prazo: 30000 });

  if (HOSTS_TRADUCAO.includes(host)) {
    // no dicionário, só as respostas da API; os áudios (/media/) passam direto
    if (host === 'api.dictionaryapi.dev' && !url.pathname.startsWith('/api/')) return null;
    return networkFirst(req, CACHES.traducoes, { max: MAX_TRADUCOES, prazo: 15000 });
  }

  // proxies dos livros (corsproxy.io, allorigins, codetabs) e o resto: passa direto pela rede
  return null;
}

/* ================= ciclo de vida ================= */

self.addEventListener('install', evento => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHES.app);
    // cache: 'reload' ignora o cache HTTP, para não guardar uma versão velha do app
    await Promise.all(ESQUELETO_LOCAL.map(async url => {
      const resp = await fetch(new Request(url, { cache: 'reload' }));
      if (!resp.ok) throw new Error(`${url}: ${resp.status}`);
      await cache.put(url, await semRedirect(resp));
    }));
    const externos = await Promise.allSettled(ESQUELETO_EXTERNO.map(async url => {
      const resp = await fetch(new Request(url, { mode: 'cors', cache: 'reload' }));
      if (!resp.ok) throw new Error(`${url}: ${resp.status}`);
      await cache.put(url, resp);
    }));
    externos.filter(r => r.status === 'rejected').forEach(r => console.warn('[sw] pré-cache externo falhou', r.reason));
    // sem skipWaiting aqui: a página mostra "Nova versão disponível" e a pessoa decide quando atualizar
  })());
});

self.addEventListener('activate', evento => {
  evento.waitUntil((async () => {
    const atuais = Object.values(CACHES);
    // só mexe nos caches do Folheia (no GitHub Pages, vários sites dividem a mesma origem)
    const antigos = (await caches.keys()).filter(n => n.startsWith('folheia-') && !atuais.includes(n));
    await herdarTraducoes(antigos);
    await Promise.all(antigos.map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

// as traduções já consultadas passam para a versão nova, para continuarem funcionando offline
async function herdarTraducoes(antigos) {
  try {
    const novo = await caches.open(CACHES.traducoes);
    for (const nome of antigos.filter(n => n.endsWith('-traducoes'))) {
      const velho = await caches.open(nome);
      for (const req of await velho.keys()) {
        if (!(await novo.match(req))) await novo.put(req, await velho.match(req));
      }
    }
    await limitarCache(CACHES.traducoes, MAX_TRADUCOES);
  } catch (e) { console.warn('[sw] não herdou as traduções', e); }
}

self.addEventListener('message', evento => {
  if (evento.data && evento.data.tipo === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (req.mode === 'navigate') { evento.respondWith(navegacao(req)); return; }

  const resposta = rota(req, url, evento);
  if (resposta) evento.respondWith(resposta);
  // sem rota: não chama respondWith e a requisição segue direto pela rede
});
