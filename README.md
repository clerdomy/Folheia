# Folheia

Leitor de livros em inglês com páginas em 3D, feito para quem está aprendendo o idioma. Clique numa palavra para ver a tradução e ouvir a pronúncia. Clique duas vezes numa frase para traduzi-la inteira. Você pode ler seus próprios PDFs e TXT ou escolher um livro gratuito na biblioteca, organizada do nível básico ao avançado.

O leitor inteiro é um único arquivo HTML (`index.html`), com CSS e JavaScript puros, sem framework nem etapa de build. Ao lado dele há um servidor pequeno em Node (`servidor.mjs`) e uma função para a Vercel (`api/livro.js`) que baixam os livros do Project Gutenberg, porque o site deles bloqueia o download direto pelo navegador (veja [Download dos livros](#download-dos-livros)). O app também pode ser instalado e funciona offline (veja [App instalável (PWA)](#app-instalável-pwa)).

---

## Funcionalidades

### Leitura

- Livro em 3D com páginas que viram por animação. São duas páginas no computador e uma no celular.
- O texto do PDF ou TXT é reorganizado em páginas de livro, com tipografia própria para leitura longa.
- Ao mudar o tamanho da letra ou da janela, as páginas são remontadas sem perder o ponto de leitura.
- Navegação pelas setas da tela, pelas setas do teclado, pelos cantos dobrados das páginas, por deslizar o dedo no celular ou pela barra de progresso.
- Três temas de página: Papel, Sépia e Noite.

### Aprendizado

- **Clique numa palavra** para ver:
  - a tradução e os outros sentidos (substantivo, verbo…);
  - a transcrição fonética (IPA) e a definição em inglês;
  - a frase em que a palavra aparece.
- **Clique duas vezes** para traduzir a frase inteira. Cada palavra da frase também pode ser traduzida separadamente.
- **Selecione um trecho** com o mouse para traduzir exatamente esse trecho.
- **Como ler em português:** cada palavra e frase ganha uma leitura aproximada escrita com letras do português, por exemplo *water* → **uó**rer e *think* → think.
  - A sílaba forte aparece em negrito.
  - Os sons que não existem em português (th, r americano, é aberto…) ficam sublinhados e vêm com uma dica de como pronunciar.
  - A leitura é gerada a partir da transcrição fonética do dicionário, com regras do inglês americano.
  - Também cobre palavras flexionadas (walked, studies, singing) e as formas fracas comuns em frases (*of* → av, *the* → dha).
  - Pode ser desligada em Ajustes.
- **Ouça** a palavra ou a frase na velocidade normal ou lenta. Quando o dicionário tem gravação humana, aparece também o botão "Voz nativa".
- **Leitura em voz alta** das páginas, marcando a frase e a palavra que estão sendo faladas. As páginas viram sozinhas.
- **Vocabulário pessoal:**
  - salve palavras e frases com a tradução e o contexto;
  - as palavras salvas ficam sublinhadas no texto;
  - a lista pode ser exportada em CSV, que abre no Excel ou pode ser importada no Anki.
- **Nível estimado** do texto (A2, B1, B2 ou C1), calculado pela fórmula de legibilidade Flesch.

### Biblioteca

- **Por nível:** 22 clássicos selecionados em três prateleiras, Básico, Intermediário e Avançado, com descrição em português.
- **Buscar no acervo:** busca por título ou autor entre os mais de 70 mil livros do Project Gutenberg, com filtros por tema.
- **Minha estante:** todos os livros abertos, incluindo os PDFs e TXT da própria pessoa, com a porcentagem lida.

### Salvamento automático

- Reabre sozinho o último livro, na página onde a pessoa parou.
- Os livros ficam guardados no navegador e abrem mesmo sem internet.
- O mesmo arquivo é reconhecido mesmo se for renomeado.

### App instalável

- Instala no celular e no computador, com ícone próprio e janela sem barra do navegador.
- Abre sem internet e reabre o último livro.
- No Chrome e no Edge do computador, PDFs e TXT podem ser abertos direto pelo sistema com "Abrir com > Folheia".

---

## Como rodar

### Opção 1: servidor local (recomendado)

Precisa do [Node.js](https://nodejs.org/) 18 ou mais novo. Não instala nada: o servidor usa só a biblioteca padrão.

```bash
npm start
# Folheia rodando em http://localhost:3000
```

Abra http://localhost:3000. O servidor entrega o app e baixa os livros da biblioteca pelo endpoint `/api/livro` (veja [Download dos livros](#download-dos-livros)). `npm run dev` reinicia sozinho quando um arquivo muda. Para usar outra porta: `PORT=3001 npm start` (no PowerShell: `$env:PORT=3001; npm start`).

### Opção 2: abrir direto

Dê dois cliques em `index.html`. O leitor, a tradução, a voz e os seus PDFs funcionam assim. Dois recursos não funcionam com o arquivo aberto direto: a instalação como app e o modo offline. E o download dos livros da biblioteca passa a usar as rotas antigas (proxies públicos), que falham com frequência.

### Publicar na internet

**Vercel (recomendado):** importe o repositório em [vercel.com](https://vercel.com) ou rode `npx vercel` na pasta. Não precisa de comando de build nem de pasta de saída. A raiz é servida como site estático e `api/livro.js` vira a função `/api/livro` sozinha. Os detalhes estão em [Na Vercel](#na-vercel).

**Outras hospedagens estáticas** (GitHub Pages, Netlify, Cloudflare Pages): envie `index.html`, `manifest.webmanifest`, `sw.js` e `icons/`. O app funciona, inclusive em subpasta (ex.: `usuario.github.io/folheia/`), mas sem a função o download dos livros usa as rotas antigas. Para ter a função nessas plataformas, veja [Em outra hospedagem](#em-outra-hospedagem).

---

## App instalável (PWA)

O Folheia pode ser instalado como app e abre sem internet.

| Arquivo | Função |
| --- | --- |
| `manifest.webmanifest` | Nome, ícones, cores, atalhos (Biblioteca e Meu vocabulário) e abertura de PDF/TXT pelo sistema |
| `sw.js` | Service worker: guarda o app no aparelho e decide o que vem da rede ou do cache |
| `icons/` | `icon.svg` e `icon-maskable.svg` (fontes) e os PNGs gerados a partir deles |
| `scripts/gerar-icones.mjs` | Gera os PNGs com a biblioteca `sharp` |

### Testar localmente

O service worker só funciona em HTTPS ou em `localhost`. Abrindo o arquivo direto (`file://`) ou por IP da rede local, ele não é registrado.

```bash
npm start
# abra http://localhost:3000
```

No Chrome, abra o DevTools e vá em **Application**:

- **Manifest:** mostra os ícones e, em "Installability", qualquer problema que impeça a instalação.
- **Service workers:** deve aparecer `sw.js` como *activated*. Marque "Update on reload" enquanto estiver mexendo no código, para não ficar preso numa versão antiga.
- **Cache storage:** lista os caches `folheia-v1-*`.

Para testar offline, marque **Offline** na aba **Network** e recarregue a página.

### Gerar os ícones

Os PNGs já estão em `icons/`. Para gerá-los de novo depois de editar `icon.svg` ou `icon-maskable.svg`:

```bash
npm i -D sharp
npm run icones
```

O ícone maskable (Android) mantém o desenho dentro do círculo central de 80%, para não ser cortado por nenhum formato de ícone. Para conferir, use [maskable.app](https://maskable.app/editor).

### Publicar uma versão nova

1. Altere os arquivos.
2. No topo do `sw.js`, mude a constante `VERSAO` (por exemplo, de `'folheia-v2'` para `'folheia-v3'`).
3. Publique.

Quem estiver com o app aberto vê o aviso **Nova versão disponível**. Ao tocar em **Atualizar**, a página recarrega uma vez com a versão nova. Os caches da versão anterior são apagados, mas as traduções já consultadas passam para a versão nova.

Sem mudar `VERSAO`, o navegador continua servindo os arquivos antigos do cache.

### O que funciona offline

| Funciona | Precisa de internet |
| --- | --- |
| Abrir o app e reabrir o último livro na página onde parou | Traduzir palavras e frases ainda não consultadas |
| Ler os livros da estante (do Gutenberg e os seus PDFs e TXT) | Buscar no acervo e baixar livros novos |
| Abrir PDFs e TXT novos (o PDF.js fica guardado) | Definições e fonética de palavras novas |
| Traduções, fonética e definições já consultadas (até 500) | "Voz nativa" (gravações do dicionário) |
| Vocabulário, exportação em CSV, ajustes e temas | Capas que ainda não foram vistas |
| Voz do navegador, se o sistema tiver vozes instaladas no aparelho | |
| Capas já vistas (até 80) | |

### O que o service worker guarda

| Requisição | Estratégia |
| --- | --- |
| Páginas (navegação) | Rede primeiro; offline, usa o `index.html` guardado |
| Arquivos do app e PDF.js | Cache primeiro (pré-carregados na instalação) |
| Google Fonts (CSS) | Usa o cache e atualiza em segundo plano |
| Google Fonts (arquivos de fonte) | Cache primeiro |
| Capas do Gutenberg | Cache primeiro, até 80 capas |
| Gutendex (catálogo) | Rede primeiro, cache como reserva |
| Tradução e dicionário | Rede primeiro, cache como reserva, até 500 itens |
| Texto dos livros (`/api/livro`, Gutenberg e proxies) | Não guarda: o app já guarda os livros no IndexedDB |

As capas chegam como respostas opacas, e o Chrome conta vários MB por item na cota do site. Por isso o limite de 80.

### Instalar

- **Chrome e Edge (computador e Android):** botão **Instalar app** na barra superior.
- **iPhone e iPad:** no Safari, toque em **Compartilhar** e depois em **Adicionar à Tela de Início**. O app mostra essa dica uma vez.

---

## Como usar

| Ação | Resultado |
| --- | --- |
| Clique numa palavra | Tradução, pronúncia, definição e contexto |
| Dois cliques numa palavra | Tradução da frase inteira |
| Três cliques | Tradução do parágrafo inteiro |
| Selecionar um trecho | Tradução só do trecho |
| Setas ← → ou PageUp/PageDown | Voltar ou avançar uma página |
| Deslizar o dedo (celular) | Voltar ou avançar uma página |
| Esc | Fechar a ficha, as gavetas ou a biblioteca |
| Botão **Ouvir página** | Leitura em voz alta com marcação da palavra |
| Botão **Lento** | Leitura em voz alta mais devagar |
| Botão **Biblioteca** | Livros gratuitos por nível, busca e estante |
| Botão **Abrir arquivo** | Abrir um PDF ou TXT (também dá para arrastar o arquivo para a tela) |

---

## Serviços externos

Todos são gratuitos e nenhum exige chave de acesso.

| Serviço | Uso | Observação |
| --- | --- | --- |
| [PDF.js](https://mozilla.github.io/pdf.js/) 3.11 | Extrair o texto dos PDFs | Carregado do cdnjs |
| Google Tradutor (endpoint público `translate_a/single`) | Tradução de palavras e frases | Não é uma API oficial e pode limitar o uso |
| [MyMemory](https://mymemory.translated.net/) | Tradução reserva, se o Google falhar | Tem limite diário |
| [Free Dictionary API](https://dictionaryapi.dev/) | Fonética, definições e áudio nativo | Somente inglês |
| Web Speech API | Voz sintetizada | Do próprio navegador; a qualidade varia |
| [Gutendex](https://gutendex.com/) | Catálogo e busca de livros | Funciona direto no navegador |
| [Project Gutenberg](https://www.gutenberg.org/) | Texto e capas dos livros | O texto passa pelo endpoint próprio `/api/livro`; veja [Download dos livros](#download-dos-livros) |
| Google Fonts | Fontes Literata e Instrument Sans | Há fontes reserva se não carregar |

---

## Download dos livros

### Por que precisa de um servidor

O texto dos livros vem do site do Project Gutenberg. Só que o navegador não deixa uma página baixar arquivos de outro site a menos que esse site autorize (é a regra chamada CORS), e o Gutenberg não autoriza. Por isso o download precisa passar por um endereço do próprio Folheia: o navegador pede ao Folheia, e o Folheia pede ao Gutenberg.

Esse endereço é `GET /api/livro?id=<número>`. Ele existe em dois lugares, com a mesma lógica (`lib/gutenberg.mjs`):

| Onde | Arquivo | Cache dos livros |
| --- | --- | --- |
| No seu computador | `servidor.mjs` | Em disco, na pasta `.cache/livros/` |
| Na Vercel | `api/livro.js` | Na CDN da Vercel, por 30 dias |

O endpoint só aceita o número do livro, de 1 a 999999, nunca um endereço. Assim ele não serve de proxy para outros sites. Além disso ele:

- tenta quatro endereços do Gutenberg, em ordem;
- segue redirecionamentos, mas só aceita a resposta se o destino final for `gutenberg.org`;
- desiste de arquivos com mais de 15 MB, sem baixar o resto;
- recusa páginas HTML e textos com menos de 1.500 caracteres;
- desiste de cada tentativa depois de 20 segundos;
- envia o `User-Agent` `Folheia/1.0 (leitor de estudo)`.

Respostas:

- `200` com `text/plain; charset=utf-8`, `Cache-Control: public, max-age=2592000` e o cabeçalho `X-Folheia-Fonte` (`cache` ou `gutenberg`);
- erro em JSON, `{ "erro": "mensagem" }`, com status `400` (número inválido), `404` (o livro não existe), `502` (o Gutenberg está com problema) ou `504` (demorou demais).

### No seu computador

```bash
npm start      # servidor em http://localhost:3000
npm run dev    # igual, reiniciando quando um arquivo muda
npm test       # testes de lib/gutenberg.mjs
```

Os livros baixados ficam em `.cache/livros/<id>.txt` e são servidos de lá nas próximas vezes, para poupar o servidor do Gutenberg. Apague a pasta para baixar de novo. Ela está no `.gitignore`.

O servidor não entrega o próprio código (`servidor.mjs`, `lib/`, `api/`, `scripts/`, `package.json`), a pasta `.cache/`, `node_modules/` nem arquivos ocultos.

### Na Vercel

1. Suba o projeto para o GitHub e importe na Vercel, ou rode `npx vercel` na pasta.
2. Deixe o comando de build e a pasta de saída vazios. A raiz vira o site estático e `api/livro.js` vira a função `/api/livro`.
3. `vercel.json` dá 30 segundos para a função. `.vercelignore` deixa de fora o servidor local, os scripts e os testes.

A CDN da Vercel guarda cada livro por 30 dias (`s-maxage`). Nas próximas chamadas, o cabeçalho `x-vercel-cache: HIT` mostra que veio do cache e a função nem roda.

A lógica compartilhada fica em `lib/`, e não em `api/`, porque na Vercel todo arquivo dentro de `api/` vira uma função.

### Em outra hospedagem

O módulo `lib/gutenberg.mjs` serve em qualquer plataforma. Só muda a casca:

**Netlify Functions** (`netlify/functions/livro.mjs`):

```js
import { buscarLivro, ErroLivro } from '../../lib/gutenberg.mjs';
export const config = { path: '/api/livro' };
export default async req => {
  try {
    const { texto } = await buscarLivro(new URL(req.url).searchParams.get('id'));
    return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=2592000' } });
  } catch (e) {
    const conhecido = e instanceof ErroLivro;
    return Response.json({ erro: conhecido ? e.message : 'Erro inesperado.' }, { status: conhecido ? e.status : 502 });
  }
};
```

**Cloudflare Pages Functions** (`functions/api/livro.js`): o mesmo corpo, exportado como `export async function onRequestGet({ request })`. Para guardar o resultado por 30 dias, use `caches.default`.

Hospedagens só de arquivos estáticos, como o GitHub Pages, não rodam funções. Nelas o leitor percebe que `/api/livro` não existe e usa as rotas antigas.

### Como o leitor escolhe a rota

`fetchBookText(id)`, em `index.html`:

1. Se o livro já está no IndexedDB, usa de lá. Nada é baixado.
2. Se a página veio por `http:` ou `https:`, tenta `./api/livro?id=<id>` com 25 segundos de prazo.
   - Veio o texto: guarda no IndexedDB e abre.
   - Veio um erro JSON `404`: mostra a mensagem e para, porque o livro não existe.
   - Veio `404` em HTML, ou a hospedagem devolveu o `index.html`, ou deu falha de rede: anota que o endpoint não existe e, até recarregar a página, nem tenta de novo.
3. Rotas antigas: o Gutenberg direto (bloqueado por CORS na maioria dos navegadores) e os proxies públicos corsproxy.io, allorigins e codetabs.

Quando tudo falha, a ficha do livro mostra o link para baixar o `.txt` e abrir pelo botão **Abrir arquivo**, e lembra de rodar `npm start` quando o endpoint não existe.

---

## Armazenamento no navegador

Nada do que a pessoa lê ou salva é enviado para servidor. Tudo fica no navegador. A única coisa que chega a um servidor do Folheia é o número do livro a baixar.

**localStorage** (dados pequenos):

| Chave | Conteúdo |
| --- | --- |
| `leitor-settings` | Idioma da tradução, voz, velocidades, tamanho da letra, tema |
| `leitor-vocab` | Palavras e frases salvas |
| `leitor-estante` | Livros da estante, com progresso e nível |
| `leitor-pos:<chave>` | Índice da primeira palavra visível de cada livro |
| `leitor-last` | Chave do último livro aberto |
| `leitor-pwa-dica-ios` | Se a dica de instalação do iPhone e iPad já foi mostrada |

**IndexedDB** (banco `leitor-livros`, tabela `books`):

| Chave | Conteúdo |
| --- | --- |
| `g<id>` | Texto completo de um livro do Gutenberg (ex.: `g1342`) |
| `f<hash>` | Texto extraído de um PDF ou TXT enviado pela pessoa |

**Cache Storage** (service worker): caches `folheia-<versão>-app`, `-fontes`, `-capas`, `-catalogo` e `-traducoes`. Veja [O que o service worker guarda](#o-que-o-service-worker-guarda).

A posição de leitura é salva como **índice de palavra**, e não como número de página. Por isso ela continua correta quando as páginas são remontadas em outro tamanho de tela ou de letra.

A chave `f<hash>` é uma impressão digital (cyrb53) do texto do arquivo. O mesmo conteúdo gera sempre a mesma chave, mesmo com outro nome de arquivo.

---

## Estrutura do código

| Arquivo | Função |
| --- | --- |
| `index.html` | O leitor inteiro: CSS, HTML e JavaScript |
| `manifest.webmanifest`, `sw.js`, `icons/` | App instalável e modo offline |
| `servidor.mjs` | Servidor local: entrega o app e o endpoint `/api/livro` |
| `lib/gutenberg.mjs` | Download do texto no Project Gutenberg, usado pelo servidor e pela função |
| `lib/gutenberg.test.mjs` | Testes do módulo acima (`npm test`) |
| `api/livro.js` | A função `/api/livro` na Vercel |
| `vercel.json`, `.vercelignore` | Tempo máximo da função e arquivos que não vão para a Vercel |
| `scripts/gerar-icones.mjs` | Gera os PNGs dos ícones |

O leitor está em `index.html`, nesta ordem:

1. **CSS:** as variáveis de cor e tamanho ficam em `:root`. Os temas Sépia e Noite redefinem essas variáveis em `html[data-theme="..."]`.
2. **HTML:** barra superior, palco com o livro, ficha de tradução, gavetas de vocabulário e ajustes, biblioteca.
3. **JavaScript**, organizado em seções comentadas:

| Seção | Funções principais |
| --- | --- |
| Documento | `buildDoc()` divide o texto em parágrafos, palavras e frases |
| Extração de PDF | `extractPDF()` reconstrói linhas, parágrafos e títulos |
| Paginação | `paginate()` mede o texto numa página invisível e divide os parágrafos |
| Renderização | `pageHTML()`, `render()`, `goToWord()` |
| Virar páginas | `flip()` anima a folha em 3D com `rotateY` |
| Tradução e dicionário | `translate()`, `lookup()` |
| Como ler em português | `toPT()`, `ipaFor()`, `phraseGuide()`, tabelas `PT_V`, `PT_C`, `PT_MINI` |
| Voz | `speak()`, `startReading()`, `readNext()` |
| Ficha de tradução | `openWord()`, `openSentence()`, `openText()` |
| Vocabulário | `toggleVocab()`, `renderVocab()` |
| Texto do Gutenberg | `cleanGutenberg()`, `findStart()`, `estimateLevel()` |
| Cache e download | `idb`, `fetchViaApi()`, `fetchBookText()` |
| Biblioteca | `LEVELS`, `renderLib()`, `searchCatalog()`, `readBook()` |
| Início | `reopenLast()`, `init()` |
| App instalável (PWA) | registro do `sw.js`, aviso de nova versão, botão "Instalar app", atalhos `?abrir=`, `launchQueue`, avisos de offline |

---

## Personalização

- **Trocar o serviço de tradução:** edite a função `translate()`. Ela só precisa devolver `{ text, dict, src }`. Para produção, a API oficial do Google Cloud Translation ou a DeepL são mais estáveis, mas precisam de um servidor para esconder a chave. Uma função como `api/livro.js` serve para isso.
- **Adicionar livros às prateleiras:** inclua itens no array `LEVELS`, com o número do livro no Gutenberg (`id`), título, autor e uma descrição curta (`blurb`).
- **Trocar o livro de demonstração:** edite a constante `DEMO`. Linhas que começam com `# ` viram títulos de capítulo.
- **Mudar cores e fontes:** altere as variáveis em `:root` e o link do Google Fonts no `<head>`.
- **Ajustar a leitura em português:** edite as tabelas `PT_V` (vogais), `PT_C` (consoantes) e `PT_MINI` (palavras comuns e formas fracas). As dicas de cada som ficam em `PT_TIPS`.
- **Mudar os ajustes padrão:** edite a constante `DEFAULTS` (idioma, velocidades, tamanho da letra, tema).
- **Mudar a capacidade da estante:** ajuste `SHELF_MAX` (padrão: 30 livros).

---

## Limitações conhecidas

- **Download dos livros sem o servidor próprio:** com o arquivo aberto por dois cliques, ou numa hospedagem sem a função, o leitor depende dos proxies públicos, que mudam de regras com frequência. Quando todos falham, a ficha do livro mostra o link para baixar o `.txt` e abrir pelo botão **Abrir arquivo**. Com `npm start` ou na Vercel isso não acontece.
- **Livros muito grandes na Vercel:** a resposta de uma função é limitada a 4,5 MB quando não é transmitida em partes. Quase nenhum livro do Gutenberg chega perto disso (Moby Dick tem 1,2 MB), mas coletâneas como as obras completas de Shakespeare podem falhar lá. No servidor local não há esse limite.
- **PDFs digitalizados** (feitos só de imagem) não têm texto para extrair. Eles precisam passar por OCR antes.
- **PDFs com duas colunas** podem sair com o texto um pouco fora de ordem.
- **Só inglês:** tradução, voz, dicionário e nível estimado assumem que o livro está em inglês. Um livro em outro idioma abre, mas as ferramentas de aprendizado não funcionam bem.
- **Dados por aparelho:** a estante e o vocabulário ficam só naquele navegador. Limpar os dados do site ou usar aba anônima apaga tudo.
- **Qualidade da voz:** depende do navegador e do sistema. Chrome e Edge têm as vozes em inglês mais naturais.

---

## Roteiro

- [x] **Download próprio dos livros** (servidor local e função na Vercel), sem depender de proxies de terceiros.
- [ ] **Suporte a outros idiomas:** detectar o idioma do livro e ajustar tradução, voz e hifenização.
- [ ] **Modo áudio e vídeo:**
  - transcrever podcasts e vídeos no próprio navegador com Whisper (Transformers.js) ou importar legendas `.srt` e `.vtt`;
  - acompanhar o texto em tempo real, com repetição e câmera lenta da voz original.
- [ ] **Perguntas com IA** sobre qualquer trecho, por exemplo "por que ele usou *would* aqui?", com uma função como a de `api/livro.js` guardando a chave.
- [ ] **Sincronização entre aparelhos** com login (Firebase ou Supabase).

---

## Créditos

- Os livros da biblioteca são obras em domínio público disponibilizadas pelo [Project Gutenberg](https://www.gutenberg.org/). "Project Gutenberg" é marca registrada da Project Gutenberg Literary Archive Foundation. Este projeto não é afiliado nem endossado por ela.
- A história de demonstração, *The Keeper of Small Lights*, foi escrita especialmente para este projeto.
