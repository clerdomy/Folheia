// Gera os ícones PNG do app a partir dos SVGs em icons/.
// Uso: npm i -D sharp && npm run icones   (ou: node scripts/gerar-icones.mjs)
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pasta = fileURLToPath(new URL('../icons/', import.meta.url));
const VERDE = '#173027';

// icon.svg tem cantos arredondados (uso "any"); o maskable e o da Apple precisam de fundo inteiro
const saidas = [
  { origem: 'icon.svg', destino: 'icon-192.png', tamanho: 192 },
  { origem: 'icon.svg', destino: 'icon-512.png', tamanho: 512 },
  { origem: 'icon-maskable.svg', destino: 'icon-maskable-512.png', tamanho: 512 },
  { origem: 'icon-maskable.svg', destino: 'apple-touch-icon.png', tamanho: 180, fundo: VERDE }
];

for (const s of saidas) {
  const svg = await readFile(pasta + s.origem);
  let img = sharp(svg, { density: 384 }).resize(s.tamanho, s.tamanho);
  // o iOS não aceita transparência no ícone da tela de início
  if (s.fundo) img = img.flatten({ background: s.fundo });
  await img.png({ compressionLevel: 9 }).toFile(pasta + s.destino);
  console.log(`icons/${s.destino} (${s.tamanho}×${s.tamanho})`);
}
